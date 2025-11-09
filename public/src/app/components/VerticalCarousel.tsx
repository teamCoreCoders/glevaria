"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
    key: string;
    title: string;
    subtitle?: string;
    desc?: string;
    image: string;
    alt: string;
};

const ITEMS: Item[] = [
    {
        key: "rings",
        title: "Rings",
        subtitle: "Modern cuts",
        desc: "Signature solitaire, halo, and eternity silhouettes crafted to shine from every angle.",
        image: "/images/hover3.png",
        alt: "Rings",
    },
    {
        key: "earrings",
        title: "Earrings",
        subtitle: "Everyday sparkle",
        desc: "From delicate studs to statement drops, elevate looks with effortless brilliance.",
        image: "/images/hover2.png",
        alt: "Earrings",
    },
    {
        key: "necklaces",
        title: "Necklaces",
        subtitle: "Layer with love",
        desc: "Chains and pendants designed for stacking and story‑telling moments.",
        image: "/images/hover4.png",
        alt: "Necklaces",
    },
    {
        key: "bracelets",
        title: "Bracelets",
        subtitle: "Stack your shine",
        desc: "Tennis and cuff styles that bring a refined finish to every ensemble.",
        image: "/images/hover1.png",
        alt: "Bracelets",
    },
];

const AUTOPLAY_MS = 2800;

export default function VerticalCarousel() {
    const [index, setIndex] = useState(0);
    const wrap = (i: number) => (i + ITEMS.length) % ITEMS.length;

    // Autoplay
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const start = () => {
        stop();
        timerRef.current = setInterval(() => {
            setIndex((i) => (i + 1) % ITEMS.length);
        }, AUTOPLAY_MS);
    };
    const stop = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
    };
    useEffect(() => {
        start();
        return stop;
    }, []);

    const vis = useMemo(() => {
        const prev = wrap(index - 1);
        const curr = wrap(index);
        const next = wrap(index + 1);
        return [prev, curr, next];
    }, [index]);

    const active = ITEMS[index];

    return (
        <section className="bg-black text-white ">
            <div className="mx-auto max-w-[1450px] px-4 sm:px-8 py-8 sm:py-12">
                {/* Force 12-col grid on all breakpoints */}
                <div className="grid grid-cols-12 gap-6 sm:gap-8">
                    {/* Left column: keep span consistent across sizes */}
                    <aside className="col-span-5 ">
                        <div className="relative h-[64vh] sm:h-[66vh] lg:h-[70vh] min-h-[360px]">
                            <div className="absolute inset-0 grid place-items-center">
                                <div className="w-full max-w-[540px] text-center sm:mt-0 md:mt-0 lg:mt-50 ">
                                    <h2
                                        className="select-none font-[500] leading-[0.95] tracking-[-0.02em] fraunces-text "
                                        style={{ fontSize: "clamp(2rem, 6.2vw, 5rem)" }}
                                    >
                                        {active.title}
                                    </h2>
                                    {active.subtitle && (
                                        <p className="mt-3 text-white/70 text-[15px] sm:text-[17px]">
                                            {active.subtitle}
                                        </p>
                                    )}
                                    {active.desc && (
                                        <p className="mt-4 text-white/60 text-[13px] sm:text-[15px] leading-relaxed max-w-[580px]">
                                            {active.desc}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right column */}
                    <div className="col-span-7">
                        <Carousel3Up
                            items={ITEMS}
                            vis={vis}
                            onPause={stop}
                            onResume={start}
                        />

                        <div className="mt-5 sm:mt-6 flex items-center justify-center gap-3">
                            {ITEMS.map((_, i) => (
                                <button
                                    key={i}
                                    aria-label={`Go to ${i + 1}`}
                                    onClick={() => setIndex(i)}
                                    className={`h-[6px] rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Carousel3Up({
    items,
    vis,
    onPause,
    onResume,
}: {
    items: Item[];
    vis: number[];
    onPause: () => void;
    onResume: () => void;
}) {
    return (
        <div
            className=" relative mx-auto w-full max-w-[680px] h-[64vh] sm:h-[66vh] lg:h-[100vh] min-h-[340px] overflow-hidden"
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <CarouselImage item={items[vis[0]]} size="small" />
                <CarouselImage item={items[vis[1]]} size="large" />
                <CarouselImage item={items[vis[2]]} size="small" />
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-0 h-14 sm:h-16 bg-gradient-to-b from-black to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 sm:h-16 bg-gradient-to-t from-black to-transparent" />
        </div>
    );
}

function CarouselImage({ item, size }: { item: Item; size: "small" | "large" }) {
    // Keep same proportions on mobile as desktop feel
    const boxH = size === "large" ? "56%" : "22%";
    const scale = size === "large" ? "scale-100" : "scale-95";

    return (
        <div
            className={` relative w-[86%] sm:w-[78%] my-2 sm:my-3 transition-transform duration-500 ${scale}`}
            style={{ height: boxH }}
        >
            <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-contain object-center"
                sizes="(max-width: 640px) 86vw, 42vw"
                priority={false}
            />
        </div>
    );
}
