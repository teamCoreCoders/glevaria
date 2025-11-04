// app/categories/_components/SortBy.tsx
"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortBy() {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();
    const current = sp.get("sort") ?? "rec";

    const set = useCallback(
        (k: string, v: string) => {
            const q = new URLSearchParams(sp.toString());
            q.set(k, v);
            router.push(`${pathname}?${q.toString()}`);
        },
        [router, pathname, sp]
    );

    return (
        <label className="text-sm text-neutral-300">
            Sort By:&nbsp;
            <select
                value={current}
                onChange={(e) => set("sort", e.target.value)}
                className="bg-transparent border border-neutral-700 rounded px-2 py-1 text-white"
            >
                <option value="rec">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
            </select>
        </label>
    );
}
