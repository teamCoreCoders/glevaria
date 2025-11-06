// app/categories/[slug]/page.tsx
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SortBy from "../../components/SortBy";
import Filters from "../../components/Filters";

/* ---------------- Types & Mock Data ---------------- */
type Product = {
    id: string;
    title: string;
    subtitle?: string;
    img: string;
    price: number;
    color: string;
    shape: string;
    category: string;      // rings | bracelets | necklaces | earrings
    type: string;          // lumiere | prism | soleil | riviere | amour | ivy
};

const ALL_PRODUCTS: Product[] = [
    { id: "1", title: "Oval Cut Lab Diamond", subtitle: "Solitaire Ring (c7-44)", img: "/images/oval-default.png", price: 9500, color: "green", shape: "oval", category: "rings", type: "lumiere" },
    { id: "2", title: "Oval Cut Lab Diamond", subtitle: "Solitaire Ring (c7-44)", img: "/images/oval-default.png", price: 9500, color: "green", shape: "oval", category: "rings", type: "prism" },
    { id: "3", title: "Oval Cut Lab Diamond", subtitle: "Solitaire Ring (c7-44)", img: "/images/oval-default.png", price: 9500, color: "green", shape: "oval", category: "rings", type: "soleil" },
    { id: "4", title: "Pink Lab Diamond bracelet", subtitle: "Halo bracelet (CV136)", img: "/images/pink-default.png", price: 12500, color: "pink", shape: "rectangle", category: "bracelets", type: "prism" },
    { id: "5", title: "Pink Lab Diamond bracelet", subtitle: "Halo bracelet (CV136)", img: "/images/pink-default.png", price: 12500, color: "pink", shape: "rectangle", category: "bracelets", type: "ivy" },
    { id: "6", title: "Pink Lab Diamond bracelet", subtitle: "Halo bracelet (CV136)", img: "/images/pink-default.png", price: 12500, color: "pink", shape: "rectangle", category: "bracelets", type: "amour" },
    { id: "7", title: "Blue Lab Diamond Pendant", subtitle: "Necklace (CV40-3)", img: "/images/blue-pendant-default.png", price: 15400, color: "blue", shape: "pear", category: "necklaces", type: "riviere" },
    { id: "8", title: "Blue Lab Diamond Pendant", subtitle: "Necklace (CV40-3)", img: "/images/blue-pendant-default.png", price: 15400, color: "blue", shape: "pear", category: "necklaces", type: "prism" },
    { id: "9", title: "Blue Lab Diamond Pendant", subtitle: "Necklace (CV40-3)", img: "/images/blue-pendant-default.png", price: 15400, color: "blue", shape: "pear", category: "necklaces", type: "soleil" },
    { id: "10", title: "Pink Lab Diamond Halo Earrings", subtitle: "and Pendant (CV39-2, CV39-5)", img: "/images/pink-earring-set-default.png", price: 14200, color: "pink", shape: "oval", category: "earrings", type: "lumiere" },
    { id: "11", title: "Pink Lab Diamond Halo Earrings", subtitle: "and Pendant (CV39-2, CV39-5)", img: "/images/pink-earring-set-default.png", price: 14200, color: "pink", shape: "oval", category: "earrings", type: "amour" },
    { id: "12", title: "Pink Lab Diamond Halo Earrings", subtitle: "and Pendant (CV39-2, CV39-5)", img: "/images/pink-earring-set-default.png", price: 14200, color: "pink", shape: "oval", category: "earrings", type: "prism" },
];

/* ---------------- Slugs ---------------- */
const CATEGORIES = ["bracelets", "rings", "necklaces", "earrings"] as const;
const COLLECTIONS = ["lumiere", "prism", "soleil", "riviere", "amour", "ivy"] as const;
const SPECIAL = ["all-products"] as const;
const ALL_SLUGS = [...CATEGORIES, ...COLLECTIONS, ...SPECIAL] as const;

/* ---------------- SSG params ---------------- */
export async function generateStaticParams() {
    return ALL_SLUGS.map((slug) => ({ slug }));
}

/* ---------------- Metadata (await params for Next 15) ---------------- */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const lower = slug.toLowerCase();
    const isCollection = (COLLECTIONS as readonly string[]).includes(lower);
    const isAll = lower === "all-products";

    const pretty = isAll
        ? "All Products"
        : lower.charAt(0).toUpperCase() + lower.slice(1);

    return {
        title: `${pretty} | Glevera`,
        description: isAll
            ? "Browse all products across categories and collections, crafted with lab-grown diamonds."
            : isCollection
                ? `Explore the ${pretty} collection crafted with lab-grown diamonds — vibrant, sustainable, and timeless.`
                : `Explore ${pretty} crafted with lab-grown diamonds — vibrant, sustainable, and timeless.`,
    };
}

/* ---------------- Filter/sort helper ---------------- */
function filterSort(data: Product[], spObj: Record<string, any>) {
    const min = Number(spObj.min ?? 0);
    const max = Number(spObj.max ?? 1e9);
    const colorsArr = Array.isArray(spObj.color) ? spObj.color : spObj.color ? [String(spObj.color)] : [];
    const shapesArr = Array.isArray(spObj.shape) ? spObj.shape : spObj.shape ? [String(spObj.shape)] : [];
    const colors = new Set(colorsArr);
    const shapes = new Set(shapesArr);

    let items = data.filter((p) => p.price >= min && p.price <= max);
    if (colors.size) items = items.filter((p) => colors.has(p.color));
    if (shapes.size) items = items.filter((p) => shapes.has(p.shape));

    const sort = String(spObj.sort ?? "rec");
    if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
    return items;
}

/* ---------------- Page (await params/searchParams) ---------------- */
type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
};

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const sp = await searchParams;

    const lower = slug.toLowerCase();
    if (!ALL_SLUGS.includes(lower as any)) notFound();

    const isCollection = (COLLECTIONS as readonly string[]).includes(lower);
    const isAll = lower === "all-products";
    const normalizedCategory = lower.endsWith("s") ? lower.slice(0, -1) : lower;

    // Base dataset selection
    const base = isAll
        ? ALL_PRODUCTS
        : isCollection
            ? ALL_PRODUCTS.filter((p) => p.type === lower)
            : ALL_PRODUCTS.filter((p) => p.category === lower || p.category === normalizedCategory);

    const pretty = isAll
        ? "All Products"
        : lower.charAt(0).toUpperCase() + lower.slice(1);

    const products = filterSort(base, sp);

    return (
        <main className="min-h-screen bg-black text-white">
            <Header />

            <section className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16">
                {/* Breadcrumb */}
                <p className="mb-6 text-sm text-neutral-400">
                    <Link href="/" className="underline hover:text-white transition-colors">Home</Link> &gt; {pretty}
                </p>

                {/* 2-column: 20% / 80% */}
                <div className="grid grid-cols-1 lg:grid-cols-[20%_80%] gap-10">
                    {/* LEFT: Filters only */}
                    <aside>
                        <Filters />
                    </aside>

                    {/* RIGHT: header + top bar (count left, sort right) + products */}
                    <div>
                        {/* Header */}
                        <h1 className="text-[42px] sm:text-[56px] lg:text-[72px] leading-[1.05] font-[500]" style={{ fontFamily: "Bodoni Moda, serif" }}>
                            {pretty}
                        </h1>
                        <p className="mt-4 max-w-3xl text-neutral-300">
                            {isAll
                                ? "Explore our entire range of lab-grown diamond jewelry across rings, bracelets, necklaces, and earrings."
                                : isCollection
                                    ? `Discover the ${pretty} collection — vibrant lab-grown diamond designs to elevate every look.`
                                    : `Wrap your wrist in luxury with our vibrant diamond ${lower}, perfect for stacking or wearing solo for effortless elegance.`}
                        </p>

                        {/* Top bar: count left, SortBy right */}
                        <div className="mt-8 flex items-center justify-between">
                            <span className="text-sm text-neutral-400">{products.length} products</span>
                            <SortBy />
                        </div>

                        {/* Grid */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-12">
                            {products.map((p) => (
                                <article key={p.id} className="group">
                                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
                                        <Image
                                            src={p.img}
                                            alt={p.title}
                                            fill
                                            className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                                            sizes="(max-width: 640px) 94vw, (max-width: 1280px) 44vw, 28vw"
                                        />
                                    </div>
                                    <h3 className="mt-5 text-[15px] text-neutral-200">{p.title}</h3>
                                    {p.subtitle && <p className="text-[13px] text-neutral-400">{p.subtitle}</p>}
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* WhatsApp button with custom image (bigger size) */}
            <a
                href="https://wa.me/919820026633"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="fixed bottom-4 right-4 z-[100] grid place-items-center w-16 h-16 focus:outline-none"
            >
                <span className="relative inline-block w-12 h-12">
                    <Image
                        src="/images/whatsapp.png"
                        alt="WhatsApp"
                        fill
                        sizes="48px"
                        className="object-contain"
                        priority
                    />
                </span>
            </a>

            <Footer />
        </main>
    );
}
