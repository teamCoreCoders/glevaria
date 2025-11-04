// app/categories/[slug]/page.tsx
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import SortBy from "../../components/SortBy";
import Filters from "../../components/Filters";

// Mock data — replace with CMS/DB
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
    { id: "1", title: "Oval Cut Lab Diamond", subtitle: "Solitaire Ring (c7-44)", img: "/images/oval-default.png", price: 9500, color: "green", shape: "oval", category: "rings" },
    { id: "2", title: "Oval Cut Lab Diamond", subtitle: "Solitaire Ring (c7-44)", img: "/images/oval-default.png", price: 9500, color: "green", shape: "oval", category: "rings" },
    { id: "3", title: "Oval Cut Lab Diamond", subtitle: "Solitaire Ring (c7-44)", img: "/images/oval-default.png", price: 9500, color: "green", shape: "oval", category: "rings" },
    { id: "4", title: "Pink Lab Diamond bracelet", subtitle: "Halo bracelet (CV136)", img: "/images/pink-default.png", price: 12500, color: "pink", shape: "rectangle", category: "bracelets" }, // example data
    { id: "5", title: "Pink Lab Diamond bracelet", subtitle: "Halo bracelet (CV136)", img: "/images/pink-default.png", price: 12500, color: "pink", shape: "rectangle", category: "bracelets" }, // example data
    { id: "6", title: "Pink Lab Diamond bracelet", subtitle: "Halo bracelet (CV136)", img: "/images/pink-default.png", price: 12500, color: "pink", shape: "rectangle", category: "bracelets" }, // example data
    { id: "7", title: "Blue Lab Diamond Pendant", subtitle: "Necklace (CV40-3)", img: "/images/blue-pendant-default.png", price: 15400, color: "blue", shape: "pear", category: "necklaces" },
    { id: "8", title: "Blue Lab Diamond Pendant", subtitle: "Necklace (CV40-3)", img: "/images/blue-pendant-default.png", price: 15400, color: "blue", shape: "pear", category: "necklaces" },
    { id: "9", title: "Blue Lab Diamond Pendant", subtitle: "Necklace (CV40-3)", img: "/images/blue-pendant-default.png", price: 15400, color: "blue", shape: "pear", category: "necklaces" },
    { id: "10", title: "Pink Lab Diamond Halo Earrings", subtitle: "and Pendant (CV39-2, CV39-5)", img: "/images/pink-earring-set-default.png", price: 14200, color: "pink", shape: "oval", category: "earrings" },
    { id: "11", title: "Pink Lab Diamond Halo Earrings", subtitle: "and Pendant (CV39-2, CV39-5)", img: "/images/pink-earring-set-default.png", price: 14200, color: "pink", shape: "oval", category: "earrings" },
    { id: "12", title: "Pink Lab Diamond Halo Earrings", subtitle: "and Pendant (CV39-2, CV39-5)", img: "/images/pink-earring-set-default.png", price: 14200, color: "pink", shape: "oval", category: "earrings" },
];

const CATEGORIES = ["bracelets", "rings", "necklaces", "earrings", "lumiere", "prism", "soleil", "riviere", "amour", "ivy"] as const;

export async function generateStaticParams() {
    return CATEGORIES.map((slug) => ({ slug }));
}

type PageProps = { params: { slug: string }; searchParams: { [k: string]: string | string[] | undefined } };

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const name = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
    return {
        title: `${name} | Glevera`,
        description: `Explore ${name} crafted with lab-grown diamonds — vibrant, sustainable, and timeless.`,
    };
}

function filterSort(data: Product[], sp: PageProps["searchParams"]) {
    const min = Number(sp.min ?? 0);
    const max = Number(sp.max ?? 1e9);
    const colors = new Set(Array.isArray(sp.color) ? (sp.color as string[]) : sp.color ? [String(sp.color)] : []);
    const shapes = new Set(Array.isArray(sp.shape) ? (sp.shape as string[]) : sp.shape ? [String(sp.shape)] : []);
    let items = data.filter((p) => p.price >= min && p.price <= max);
    if (colors.size) items = items.filter((p) => colors.has(p.color));
    if (shapes.size) items = items.filter((p) => shapes.has(p.shape));
    const sort = String(sp.sort ?? "rec");
    if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
    return items;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const slug = params.slug.toLowerCase();
    if (!CATEGORIES.includes(slug as any)) notFound();

    // NOTE: your sample has category "bracelet", while route is "bracelets".
    // Normalize here so bracelets route can show bracelet data.
    const normalizedCategory = slug.endsWith("s") ? slug.slice(0, -1) : slug;

    const pretty = slug.charAt(0).toUpperCase() + slug.slice(1);
    const products = filterSort(
        ALL_PRODUCTS.filter((p) => p.category === slug || p.category === normalizedCategory),
        searchParams
    );

    return (
        <main className="min-h-screen bg-black text-white">
            <Header />
            <section className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16">
                {/* Breadcrumb + header */}
                <p className="mb-6 text-sm text-neutral-400">Home &gt; {pretty}</p>
                <h1 className="text-[42px] sm:text-[56px] lg:text-[72px] leading-[1.05] font-[500]" style={{ fontFamily: "Bodoni Moda, serif" }}>
                    {pretty}
                </h1>
                <p className="mt-4 max-w-3xl text-neutral-300">
                    Wrap your wrist in luxury with our vibrant diamond {slug}, perfect for stacking or wearing solo for effortless elegance.
                </p>

                {/* Top bar */}
                <div className="mt-8 flex items-center justify-between">
                    <span className="text-sm text-neutral-400">{products.length} products</span>
                    <SortBy />
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Filters */}
                    <aside className="lg:col-span-3">
                        <Filters />
                    </aside>

                    {/* Grid */}
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

            {/* WhatsApp button */}
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
