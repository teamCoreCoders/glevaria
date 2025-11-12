// components/ThreeFeatureCards.tsx
import Image from "next/image";

type Card = {
    title: string;
    src: string;
    alt: string;
};

const CARDS: Card[] = [
    { title: "New In", src: "/images/ni.png", alt: "New in diamond necklace" },
    { title: "Best Sellers", src: "/images/bs6-h.png", alt: "Best sellers diamond ring" },
    { title: "gift of love", src: "/images/gol.png", alt: "Gift of love diamond earrings" },
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
                            <h1
                                className="md:mt-20 mt-5 text-center font-bold fraunces-text tracking-[-3px] md:tracking-[-5px] text-5xl"
                            >
                                {c.title}
                            </h1>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
