// app/categories/_components/Filters.tsx
"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Filters() {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

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

    const min = sp.get("min") ?? "4200";
    const max = sp.get("max") ?? "15540";

    return (
        <div className="space-y-8">
            <h2 className="text-[28px]" style={{ fontFamily: "Bodoni Moda, serif" }}>
                Filter By
            </h2>

            {/* Price */}
            <div>
                <p className="mb-3 text-sm text-neutral-300">Price</p>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min={0}
                        max={20000}
                        step={100}
                        value={Number(min)}
                        onChange={(e) => setMany({ min: e.target.value })}
                        className="w-full"
                    />
                    <input
                        type="range"
                        min={0}
                        max={20000}
                        step={100}
                        value={Number(max)}
                        onChange={(e) => setMany({ max: e.target.value })}
                        className="w-full"
                    />
                </div>
                <div className="mt-2 flex justify-between text-xs text-neutral-400">
                    <span>${Number(min).toLocaleString()}</span>
                    <span>${Number(max).toLocaleString()}</span>
                </div>
            </div>

            {/* Color */}
            <fieldset>
                <legend className="mb-2 text-sm text-neutral-300">Diamond Color</legend>
                <div className="space-y-2 text-sm">
                    {["green", "pink", "blue", "yellow"].map((c) => (
                        <label key={c} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="color"
                                value={c}
                                checked={sp.get("color") === c}
                                onChange={(e) => setMany({ color: e.target.value })}
                            />
                            <span className="capitalize">{c}</span>
                        </label>
                    ))}
                    <button className="text-xs text-neutral-400 underline" onClick={() => setMany({ color: null })}>
                        Clear
                    </button>
                </div>
            </fieldset>

            {/* Shape */}
            <fieldset>
                <legend className="mb-2 text-sm text-neutral-300">Diamond Shape</legend>
                <div className="space-y-2 text-sm">
                    {["oval", "rectangle", "pear", "round"].map((s) => (
                        <label key={s} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="shape"
                                value={s}
                                checked={sp.get("shape") === s}
                                onChange={(e) => setMany({ shape: e.target.value })}
                            />
                            <span className="capitalize">{s}</span>
                        </label>
                    ))}
                    <button className="text-xs text-neutral-400 underline" onClick={() => setMany({ shape: null })}>
                        Clear
                    </button>
                </div>
            </fieldset>
        </div>
    );
}
