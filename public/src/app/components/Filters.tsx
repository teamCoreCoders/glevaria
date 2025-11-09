// app/categories/_components/Filters.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";

/* Currency formatter derived from ?currency= in URL */
function useCurrencyFormatter() {
    const sp = useSearchParams();
    const currency = (sp.get("currency") || "USD").toUpperCase();

    const locale =
        currency === "INR" ? "en-IN" :
            currency === "EUR" ? "de-DE" :
                "en-US";

    const fmt = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
            }),
        [locale, currency]
    );

    return { currency, fmt };
}

export default function Filters() {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();
    const { fmt } = useCurrencyFormatter();

    const setMany = useCallback(
        (entries: Record<string, string | null>) => {
            const q = new URLSearchParams(sp.toString());
            Object.entries(entries).forEach(([k, v]) => {
                if (v === null) q.delete(k);
                else q.set(k, v);
            });
            router.push(`${pathname}?${q.toString()}`);
        },
        [router, pathname, sp]
    );

    // Defaults
    const min = Number(sp.get("min") ?? 76649);
    const max = Number(sp.get("max") ?? 1268175);

    // Slider config
    const DOMAIN_MIN = 0;
    const DOMAIN_MAX = 2000000;
    const STEP = 1000;

    const setMinSafe = (val: number) => {
        const safe = Math.min(Math.max(val, DOMAIN_MIN), max - STEP);
        setMany({ min: String(safe) });
    };
    const setMaxSafe = (val: number) => {
        const safe = Math.max(Math.min(val, DOMAIN_MAX), min + STEP);
        setMany({ max: String(safe) });
    };

    // Accordions
    const [openColor, setOpenColor] = useState(false);
    const [openShape, setOpenShape] = useState(false);

    // Multi-select helpers (URL-based)
    const getAll = (key: "color" | "shape") => {
        const raw = sp.getAll(key);
        if (raw.length) return new Set(raw);
        const single = sp.get(key);
        return single ? new Set([single]) : new Set<string>();
    };
    const toggleValue = (key: "color" | "shape", value: string) => {
        const q = new URLSearchParams(sp.toString());
        const selected = getAll(key);
        if (selected.has(value)) selected.delete(value);
        else selected.add(value);
        q.delete(key);
        for (const v of selected) q.append(key, v);
        router.push(`${pathname}?${q.toString()}`);
    };
    const clearKey = (key: "color" | "shape") => {
        const q = new URLSearchParams(sp.toString());
        q.delete(key);
        router.push(`${pathname}?${q.toString()}`);
    };

    const selectedColors = getAll("color");
    const selectedShapes = getAll("shape");

    return (
        <div className="space-y-8 wix-madefor-text">
            <h2 className="text-[28px] fraunces-text">
                Filter By
            </h2>

            {/* Price */}
            <div>
                <p className="mb-3 text-sm text-neutral-300">Price</p>

                {/* Two normal sliders: Min and Max */}
                <div className="flex flex-col gap-4" style={{ "--thumb": "18px" } as React.CSSProperties}>
                    {/* Min slider */}
                    <div className="relative">
                        <label className="mb-1 block text-[12px] text-neutral-400">Min</label>
                        <input
                            aria-label="Minimum price"
                            type="range"
                            min={DOMAIN_MIN}
                            max={DOMAIN_MAX}
                            step={STEP}
                            value={min}
                            onChange={(e) => setMinSafe(Number(e.target.value))}
                            className="range-thumb w-full appearance-none bg-transparent cursor-pointer"
                            style={{ touchAction: "none" }}
                        />
                        <div className="mt-1 text-xs text-white">{fmt.format(min)}</div>
                    </div>

                    {/* Max slider */}
                    <div className="relative">
                        <label className="mb-1 block text-[12px] text-neutral-400">Max</label>
                        <input
                            aria-label="Maximum price"
                            type="range"
                            min={DOMAIN_MIN}
                            max={DOMAIN_MAX}
                            step={STEP}
                            value={max}
                            onChange={(e) => setMaxSafe(Number(e.target.value))}
                            className="range-thumb w-full appearance-none bg-transparent cursor-pointer"
                            style={{ touchAction: "none" }}
                        />
                        <div className="mt-1 text-xs text-white">{fmt.format(max)}</div>
                    </div>
                </div>
            </div>

            {/* Diamond Color (dropdown) */}
            <div>
                <button
                    type="button"
                    onClick={() => setOpenColor((v) => !v)}
                    className="flex w-full items-center justify-between py-2 text-left text-sm text-neutral-300"
                    aria-expanded={openColor}
                >
                    <span>Diamond Color</span>
                    <FiChevronDown className={`transition-transform ${openColor ? "rotate-180" : ""}`} />
                </button>
                {openColor && (
                    <div className="mt-2 pl-1 space-y-2 text-sm">
                        {["green", "pink", "blue", "yellow"].map((c) => (
                            <label key={c} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedColors.has(c)}
                                    onChange={() => toggleValue("color", c)}
                                />
                                <span className="capitalize">{c}</span>
                            </label>
                        ))}
                        {selectedColors.size > 0 && (
                            <button className="text-xs text-neutral-400 underline" onClick={() => clearKey("color")}>
                                Clear
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Diamond Shape (dropdown) */}
            <div>
                <button
                    type="button"
                    onClick={() => setOpenShape((v) => !v)}
                    className="flex w-full items-center justify-between py-2 text-left text-sm text-neutral-300"
                    aria-expanded={openShape}
                >
                    <span>Diamond Shape</span>
                    <FiChevronDown className={`transition-transform ${openShape ? "rotate-180" : ""}`} />
                </button>
                {openShape && (
                    <div className="mt-2 pl-1 space-y-2 text-sm">
                        {["oval", "rectangle", "pear", "round"].map((s) => (
                            <label key={s} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedShapes.has(s)}
                                    onChange={() => toggleValue("shape", s)}
                                />
                                <span className="capitalize">{s}</span>
                            </label>
                        ))}
                        {selectedShapes.size > 0 && (
                            <button className="text-xs text-neutral-400 underline" onClick={() => clearKey("shape")}>
                                Clear
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Centered white thumb on white line (2px track) */}
            <style jsx>{`
        .range-thumb {
          outline: none;
          height: 24px; /* vertical room for centering */
        }
        /* WebKit (Chrome/Safari/Edge) white circular thumb */
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: var(--thumb);
          width: var(--thumb);
          border-radius: 50%;
          background: #ffffff;
          border: none;
          box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
          cursor: pointer;
          /* Center the thumb exactly over a 2px track inside 24px input height */
          margin-top: calc((2px - var(--thumb)) / 2);
        }
        .range-thumb:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 2px rgba(0,0,0,0.2), 0 0 0 3px #fff;
        }
        /* Firefox white circular thumb */
        .range-thumb::-moz-range-thumb {
          height: var(--thumb);
          width: var(--thumb);
          border-radius: 50%;
          background: #ffffff;
          border: none;
          box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
          cursor: pointer;
        }
        /* White thin line (track) */
        .range-thumb::-webkit-slider-runnable-track {
          -webkit-appearance: none;
          height: 2px;
          background: rgba(255,255,255,0.7);
        }
        .range-thumb::-moz-range-track {
          height: 2px;
          background: rgba(255,255,255,0.7);
        }
      `}</style>
        </div>
    );
}
