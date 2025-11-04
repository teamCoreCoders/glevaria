// Hero.tsx (additions marked)
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative isolate min-h-screen overflow-hidden">
            <Image
                src="/images/hero-hand.png"
                alt="HeroSection"
                fill
                priority
                sizes="100vw"
                className="object-cover z-0"
            />

            {/* Content */}
            <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl place-items-center px-6">
                <div className="text-center">
                    <h1 className="mb-[400] bodoni-moda-bm text-white text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-[0.04em]">
                        Vibrant. Sustainable. Timeless.
                    </h1>

                    <div className="mt-40 flex justify-center">
                        <a
                            href="#shop"
                            className="group inline-flex items-center gap-2 rounded border border-white  px-5 py-2 text-white  transition"
                        >
                            <span>Shop all</span>
                            <svg
                                className="h-4 w-4 transition rotate-0 group-hover:-rotate-45"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M5 12h14" />
                                <path d="M13 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
