// app/categories/[slug]/page.tsx
import Footer from "../components/Footer";
import Header from "../components/Header";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import SortBy from "../components/SortBy";
import Filters from "../components/Filters";

/* ---------------- Mock data (replace with CMS) ---------------- */
type Product = {
    id: string;
    title: string;
    subtitle?: string;
    img: string;
    price: number;
    color: string;
    shape: string;
    category: string;
};

const ALL_PRODUCTS: Product[] = [
    { id: "1", title: "Oval Cut Lab Diamond", subtitle: "Solitaire Ring (c7-44)", img: "/images/oval-default.png", price: 9500, color: "white", shape: "oval", category: "rings" },
    { id: "2", title: "Pink Lab Diamond bracelet", subtitle: "Halo bracelet (CV136)", img: "/images/pink-default.png", price: 12500, color: "pink", shape: "cushion", category: "bracelets" },
    { id: "3", title: "Blue Lab Diamond Pendant", subtitle: "Necklace (CV40-3)", img: "/images/blue-pendant-default.png", price: 15400, color: "blue", shape: "pear", category: "necklaces" },
    { id: "4", title: "Pink Lab Diamond Halo Earrings", subtitle: "and Pendant (CV39-2, CV39-5)", img: "/images/pink-earring-set-default.png", price: 14200, color: "pink", shape: "oval", category: "earrings" },
];

const CATEGORIES = ["bracelets", "rings", "necklaces", "earrings", "lumiere", "prism", "soleil", "riviere", "amour", "ivy"] as const;

/* ---------------- SSG for common slugs ---------------- */
export async function generateStaticParams() {
    return CATEGORIES.map((slug) => ({ slug })); // [web:169]
}

/* ---------------- Dynamic metadata (await params) ---------------- */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params; // Next 15 requires await [attached_file:1]
    const name = slug.charAt(0).toUpperCase() + slug.slice(1);
    return {
        title: `${name} | Glevera`,
        description: `Explore ${name} crafted with lab-grown diamonds — vibrant, sustainable, and timeless.`,
    };
}

/* ---------------- Helpers ---------------- */
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

/* ---------------- Page (await both params & searchParams) ---------------- */
type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
};

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { slug: rawSlug } = await params; // unwrap [attached_file:1]
    const sp = await searchParams;          // unwrap [attached_file:1]

    const slug = rawSlug.toLowerCase();
    if (!CATEGORIES.includes(slug as any)) notFound(); // [web:170]

    // Normalize bracelet vs bracelets
    const normalizedCategory = slug.endsWith("s") ? slug.slice(0, -1) : slug;

    const pretty = slug.charAt(0).toUpperCase() + slug.slice(1);
    const products = filterSort(
        ALL_PRODUCTS.filter((p) => p.category === slug || p.category === normalizedCategory),
        sp
    );

    return (
        <main className="min-h-screen bg-black text-white ">
            <Header />
            <section className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16 wix-madefor-text">
                <p className="mb-6 text-sm text-neutral-400">Home &gt; {pretty}</p>
                <h1 className="text-[42px] sm:text-[56px] lg:text-[72px] leading-[1.05] font-[500]">
                    {pretty}
                </h1>
                <p className="mt-4 max-w-3xl text-neutral-300">
                    Wrap your wrist in luxury with our vibrant diamond {slug}, perfect for stacking or wearing solo for effortless elegance.
                </p>

                <div className="mt-8 flex items-center justify-between">
                    <span className="text-sm text-neutral-400">{products.length} products</span>
                    <SortBy />
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <aside className="lg:col-span-3">
                        <Filters />
                    </aside>

                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-12">
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

            <a
                href="https://wa.me/919820026633"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="fixed bottom-4 right-4 z-[100] grid place-items-center w-12 h-12 rounded-full text-white"
            >
                <FaWhatsapp className="w-12 h-12" />
            </a>
            <Footer />
        </main>
    );
}
