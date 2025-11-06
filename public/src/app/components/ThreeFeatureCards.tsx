// components/ThreeFeatureCards.tsx
import Image from "next/image";

type Card = {
    title: string;
    src: string;
    alt: string;
};

const CARDS: Card[] = [
    { title: "Best Sellers", src: "/images/card-1.png", alt: "Best sellers diamond ring" },
    { title: "New In", src: "/images/card-2.png", alt: "New in diamond necklace" },
    { title: "gift of love", src: "/images/card-3.png", alt: "Gift of love diamond earrings" },
];

export default function ThreeFeatureCards() {
    return (
        <section className="bg-black text-white">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {CARDS.map((c, i) => (
                        <article key={i} className="group">
                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-none bg-black">
                                {/* Image */}
                                <Image
                                    src={c.src}
                                    alt={c.alt}
                                    fill
                                    priority={i === 0}
                                    className="object-contain md:object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.08]"
                                    sizes="(max-width: 768px) 100vw, 32vw"
                                />
                            </div>

                            {/* Title below image */}
                            <h3
                                className="md:mt-20 mt-5 text-center font-bold tracking-wide"
                                style={{
                                    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
                                    fontSize: "clamp(2.15rem, 2.2vw, 1.6rem)",
                                }}
                            >
                                {c.title}
                            </h3>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
