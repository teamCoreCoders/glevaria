import Image from "next/image";

type Card = {
    titleLine1: string;
    titleLine2?: string;
    subtitle: string;
    img: string;       // default image
    imgHover: string;  // hover image
    alt: string;
};

const CARDS: Card[] = [
    {
        titleLine1: "Oval Cut Lab Diamond",
        titleLine2: "Solitaire Ring (c7-44)",
        subtitle: "",
        img: "/images/oval-default.png",
        imgHover: "/images/hover.png",
        alt: "Oval Cut Lab Diamond Solitaire Ring",
    },
    {
        titleLine1: "Pink Lab Diamond",
        titleLine2: "Halo Ring (CV136)",
        subtitle: "",
        img: "/images/pink-default.png",
        imgHover: "/images/hover.png",
        alt: "Pink Lab Diamond Halo Ring",
    },
    {
        titleLine1: "Blue Lab Diamond Pendant",
        titleLine2: "Necklace (CV40-3)",
        subtitle: "",
        img: "/images/blue-pendant-default.png",
        imgHover: "/images/hover.png",
        alt: "Blue Lab Diamond Pendant Necklace",
    },
    {
        titleLine1: "Pink Lab Diamond Halo Earrings",
        titleLine2: "and Pendant (CV39-2, CV39-5)",
        subtitle: "",
        img: "/images/pink-earring-set-default.png",
        imgHover: "/images/hover.png",
        alt: "Pink Lab Diamond Halo Earrings and Pendant",
    },
];

export default function BestSellersSection() {
    return (
        <main className=" md:h-screen h-auto bg-black text-white">
            <section className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
                <h1
                    className="select-none text-center md:text-left text-[42px] sm:text-[56px] lg:text-[84px] leading-none tracking-[-0.02em] font-[500]"
                    style={{ fontFamily: "Bodoni Moda, serif" }}
                >
                    Best Sellers
                </h1>

                {/* Mobile: horizontal scroll; Desktop: grid */}
                <div className="mt-10 sm:mt-14 lg:mt-16">
                    {/* Mobile/Tablet horizontal scroller */}
                    <div className="sm:hidden -mx-4 px-4">
                        <div
                            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none"
                            style={{ WebkitOverflowScrolling: "touch" }}
                        >
                            {CARDS.map((card, idx) => (
                                <div key={idx} className="snap-start shrink-0 w-[70vw] xs:w-[62vw] sm:w-[50vw]">
                                    <BestSellerCard card={card} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop grid */}
                    <div className="hidden sm:grid grid-cols-2 xl:grid-cols-4 gap-y-14 sm:gap-y-16 gap-x-10 xl:gap-x-12">
                        {CARDS.map((card, idx) => (
                            <BestSellerCard key={idx} card={card} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Hide native scrollbar utility */}
            <style jsx>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </main>
    );
}

function BestSellerCard({ card }: { card: Card }) {
    return (
        <article className="group w-full flex flex-col items-center text-center">
            {/* Square media box with overflow clip */}
            <div className="relative w-full md:w-[295px] aspect-[1/1] overflow-hidden rounded-none">
                {/* Base image */}
                <Image
                    src={card.img}
                    alt={card.alt}
                    fill
                    priority={false}
                    className="object-cover object-center transition-opacity duration-300 ease-out opacity-100 group-hover:opacity-0"
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 295px"
                />
                {/* Hover image */}
                <Image
                    src={card.imgHover}
                    alt={`${card.alt} hover`}
                    fill
                    className="object-cover object-center transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100"
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 295px"
                />
            </div>

            <div className="mt-6 text-[18px] md:text-[17px] leading-[1.35] text-[#EDEDED]">
                <p>{card.titleLine1}</p>
                {card.titleLine2 && <p className="mt-1">{card.titleLine2}</p>}
            </div>
        </article>
    );
}
