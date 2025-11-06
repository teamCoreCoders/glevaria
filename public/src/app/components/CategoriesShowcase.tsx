// components/StackedCategories.tsx
import Image from "next/image";

type Cat = { key: string; title: string; image: string; alt: string };

const CATS: Cat[] = [
    { key: "rings", title: "Rings", image: "/images/hover.png", alt: "Rings" },
    { key: "earrings", title: "Earrings", image: "/images/hover.png", alt: "Earrings" },
    { key: "necklaces", title: "Necklaces", image: "/images/hover.png", alt: "Necklaces" },
    { key: "bracelets", title: "Bracelets", image: "/images/hover.png", alt: "Bracelets" },
];

// Desktop: titles + images same sticky anchor point
const TITLE_TOP_DESKTOP = `14vh`;
const titleTopDesktop = (_i: number) => TITLE_TOP_DESKTOP;
const IMAGE_TOP_DESKTOP = TITLE_TOP_DESKTOP; // image pins at same point as title
const IMAGE_HEIGHT_DESKTOP = `74vh`;        // ensure top + height < 100vh

// Mobile: tighter spacing
const TITLE_TOP_MOBILE = `16vh`;
const IMAGE_GAP_MOBILE = `6vh`;
const IMAGE_TOP_MOBILE = `calc(${TITLE_TOP_MOBILE} + ${IMAGE_GAP_MOBILE})`;
const IMAGE_HEIGHT_MOBILE = `48vh`;

export default function StackedCategories() {
    return (
        <section className="bg-black text-white">
            {/* Important: no overflow-y on ancestors for sticky to work */}
            <div className="mx-auto max-w-[1450px] px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* LEFT (desktop): stacked sticky titles (compact) */}
                    <aside className="hidden lg:block lg:col-span-4 relative">
                        {CATS.map((c, i) => (
                            <div key={c.key} className="relative h-[100vh]">
                                <h2
                                    className="sticky select-none font-[500] leading-[0.9] tracking-[-0.02em]"
                                    style={{
                                        top: titleTopDesktop(i),
                                        fontFamily: "Bodoni Moda, serif",
                                        fontSize: "clamp(2rem, 6vw, 8rem)",
                                        zIndex: 30 - i,
                                        pointerEvents: "none",
                                        display: "block",
                                    }}
                                >
                                    {c.title}
                                </h2>
                            </div>
                        ))}
                    </aside>

                    {/* RIGHT: desktop images stick at same top as titles; mobile has per-item title+image */}
                    <div className="lg:col-span-8 relative">
                        {/* MOBILE: compact per-item title + image just below it */}
                        <div className="lg:hidden">
                            {CATS.map((c, i) => (
                                <section key={c.key} className="relative h-[90vh]" aria-label={c.title}>
                                    {/* Sticky title */}
                                    <h2
                                        className="sticky select-none font-[500] leading-[0.9] tracking-[-0.02em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                                        style={{
                                            top: `calc(${TITLE_TOP_MOBILE} + env(safe-area-inset-top, 0px))`,
                                            fontFamily: "Bodoni Moda, serif",
                                            fontSize: "clamp(1.4rem, 10.5vw, 3rem)",
                                            zIndex: 20,
                                            pointerEvents: "none",
                                            paddingLeft: "4vw",
                                        }}
                                    >
                                        {c.title}
                                    </h2>

                                    {/* Sticky image directly under title */}
                                    <div
                                        className="sticky"
                                        style={{ top: IMAGE_TOP_MOBILE, height: IMAGE_HEIGHT_MOBILE, zIndex: 10 + i }}
                                    >
                                        <div className="relative h-full w-full">
                                            <Image
                                                src={c.image}
                                                alt={c.alt}
                                                fill
                                                priority={i === 0}
                                                className="object-cover object-center"
                                                sizes="100vw"
                                            />
                                            <div className="absolute inset-0 bg-black/25" />
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>

                        {/* DESKTOP: image sticks at same anchor as title, not full-screen */}
                        <div className="hidden lg:block">
                            {CATS.map((c, i) => (
                                <section key={c.key} className="relative h-[100vh]" aria-label={c.title}>
                                    <div
                                        className="sticky"
                                        style={{ top: IMAGE_TOP_DESKTOP, height: IMAGE_HEIGHT_DESKTOP, zIndex: 10 + i }}
                                    >
                                        <div className="relative h-full w-full">
                                            <Image
                                                src={c.image}
                                                alt={c.alt}
                                                fill
                                                priority={i === 0}
                                                className="object-cover object-center"
                                                sizes="66vw"
                                            />
                                            <div className="absolute inset-0 bg-black/30" />
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
