import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

type Card = {
    titleLine1: string;
    titleLine2?: string;
    subtitle: string;
    img: string;      // default image
    imgHover: string; // hover image
    alt: string;
};

const CARDS: Card[] = [
    { titleLine1: "Oval Cut Lab Diamond", titleLine2: "Solitaire Ring (c7-44)", subtitle: "", img: "/images/bs1.png", imgHover: "/images/bs1-h.png", alt: "Oval Cut Lab Diamond Solitaire Ring" },
    { titleLine1: "Pink Lab Diamond", titleLine2: "Halo Ring (CV136)", subtitle: "", img: "/images/bs2.png", imgHover: "/images/bs2-h.png", alt: "Pink Lab Diamond Halo Ring" },
    { titleLine1: "Blue Lab Diamond Pendant", titleLine2: "Necklace (CV40-3)", subtitle: "", img: "/images/bs3.png", imgHover: "/images/bs3-h.png", alt: "Blue Lab Diamond Pendant Necklace" },
    { titleLine1: "Pink Lab Diamond Halo Earrings", titleLine2: "and Pendant (CV39-2, CV39-5)", subtitle: "", img: "/images/bs4.png", imgHover: "/images/bs4-h.png", alt: "Pink Lab Diamond Halo Earrings and Pendant" },
    { titleLine1: "Oval Cut Lab Diamond", titleLine2: "Solitaire Ring (c7-44)", subtitle: "", img: "/images/bs5.png", imgHover: "/images/bs5-h.png", alt: "Oval Cut Lab Diamond Solitaire Ring" },
    { titleLine1: "Pink Lab Diamond", titleLine2: "Halo Ring (CV136)", subtitle: "", img: "/images/bs6.png", imgHover: "/images/bs6-h.png", alt: "Pink Lab Diamond Halo Ring" },
    { titleLine1: "Blue Lab Diamond Pendant", titleLine2: "Necklace (CV40-3)", subtitle: "", img: "/images/bs7.png", imgHover: "/images/bs7-h.png", alt: "Blue Lab Diamond Pendant Necklace" },
    { titleLine1: "Pink Lab Diamond Halo Earrings", titleLine2: "and Pendant (CV39-2, CV39-5)", subtitle: "", img: "/images/bs8.png", imgHover: "/images/bs8-h.png", alt: "Pink Lab Diamond Halo Earrings and Pendant" },
    { titleLine1: "Pink Lab Diamond Halo Earrings", titleLine2: "and Pendant (CV39-2, CV39-5)", subtitle: "", img: "/images/bs9.png", imgHover: "/images/bs9-h.png", alt: "Pink Lab Diamond Halo Earrings and Pendant" },
];

// How many virtual repeats to ensure smooth loop
const REPEATS = 3; // total virtual lists = 3x; middle start keeps headroom

export default function BestSellersSection() {
    const trackRef = useRef<HTMLDivElement>(null);

    // Build virtual list indices
    const VLIST = useMemo(() => {
        const list: Card[] = [];
        for (let r = 0; r < REPEATS; r++) list.push(...CARDS);
        return list;
    }, []);

    // After mount, jump scrollLeft to the middle copy so both sides have room
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const itemWidth = getItemWidth(el);
        const startIndex = CARDS.length; // start of middle copy
        el.scrollLeft = startIndex * (itemWidth + gapPx(el));
    }, [VLIST]);

    // Looping: when user ne extreme left/right touch kiya, back to middle jump
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const onScroll = () => {
            const totalItems = VLIST.length;
            const itemW = getItemWidth(el) + gapPx(el);
            const totalWidth = totalItems * itemW;

            const leftBoundary = CARDS.length * itemW * 0.3;
            const rightBoundary = (CARDS.length * (REPEATS - 1)) * itemW - leftBoundary;

            if (el.scrollLeft <= leftBoundary) {
                // jump forward by one full copy
                el.scrollLeft += CARDS.length * itemW;
            } else if (el.scrollLeft >= rightBoundary) {
                // jump backward by one full copy
                el.scrollLeft -= CARDS.length * itemW;
            }
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [VLIST]);

    // Desktop wheel -> horizontal
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            }
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    return (
        <main className="bg-black text-white">
            <section className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
                <h1 className="select-none text-center fraunces-text tracking-[-5px] md:tracking-[-10px] md:text-left text-[42px] sm:text-[56px] lg:text-[84px]">
                    Best Sellers
                </h1>

                {/* Universal horizontal scroller (mobile + desktop) */}
                <div className="mt-10 sm:mt-14 lg:mt-16 -mx-4 px-4">
                    <div
                        ref={trackRef}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none"
                        style={{ WebkitOverflowScrolling: "touch" }}
                    >
                        {VLIST.map((card, idx) => (
                            <div
                                key={`${idx}-${card.img}`}
                                className="snap-start shrink-0 w-[70vw] xs:w-[62vw] sm:w-[42vw] md:w-[32vw] xl:w-[22vw]"
                            >
                                <BestSellerCard card={card} />
                            </div>
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
            <div className="relative w-full aspect-[1/1] overflow-hidden rounded-none">
                {/* Base image */}
                <Image
                    src={card.img}
                    alt={card.alt}
                    fill
                    priority={false}
                    className="object-cover object-center transition-opacity duration-300 ease-out opacity-100 group-hover:opacity-0"
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 42vw, 22vw"
                />
                {/* Hover image */}
                <Image
                    src={card.imgHover}
                    alt={`${card.alt} hover`}
                    fill
                    className="object-cover object-center transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100"
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 42vw, 22vw"
                />
            </div>

            <div className="mt-6 text-[18px] md:text-[17px] leading-[1.35] text-[#EDEDED]">
                <p>{card.titleLine1}</p>
                {card.titleLine2 && <p className="mt-1">{card.titleLine2}</p>}
            </div>
        </article>
    );
}

/* Helpers */
function gapPx(container: HTMLElement): number {
    // Read computed gap from flex container (fallback 24px ~ gap-6)
    const style = getComputedStyle(container);
    const colGap = parseFloat(style.columnGap || style.gap || "24");
    return Number.isFinite(colGap) ? colGap : 24;
}
function getItemWidth(container: HTMLElement): number {
    // First child width to compute scroll snap item size
    const item = container.querySelector<HTMLElement>("div.snap-start");
    if (!item) return container.clientWidth * 0.6;
    return item.clientWidth;
}
