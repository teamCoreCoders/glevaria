// components/NewsletterModal.tsx
import React, { useEffect, useRef, useState } from "react";
import FocusTrap from "focus-trap-react";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: { email: string; phone?: string; consent: boolean }) => void;
};

export default function NewsletterModal({ open, onClose, onSubmit }: Props) {
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    // Local visibility state managed by timers while still allowing parent to open it if desired.
    const [isAutoOpen, setIsAutoOpen] = useState(false);
    const visible = open || isAutoOpen;

    // 1) Open 10s after first mount.
    useEffect(() => {
        const firstTimer = window.setTimeout(() => setIsAutoOpen(true), 5000);
        return () => window.clearTimeout(firstTimer);
    }, []);

    // 2) When closed, schedule re-open after 30s.
    const scheduleReopenRef = useRef<number | null>(null);
    const scheduleReopen = () => {
        if (scheduleReopenRef.current) window.clearTimeout(scheduleReopenRef.current);
        scheduleReopenRef.current = window.setTimeout(() => {
            setIsAutoOpen(true);
            scheduleReopenRef.current = null;
        }, 40000);
    };

    // Lock scroll when open
    useEffect(() => {
        if (!visible) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [visible]);

    // Close on Escape
    useEffect(() => {
        if (!visible) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [visible]);

    // Capture opener and restore focus
    useEffect(() => {
        if (!visible) return;
        triggerRef.current = (document.activeElement as HTMLElement) ?? null;
        return () => triggerRef.current?.focus();
    }, [visible]);

    // Unified close that also arms the 30s timer
    const handleClose = () => {
        // If parent controls open, notify it; also close local auto state.
        onClose?.();
        setIsAutoOpen(false);
        scheduleReopen();
    };

    if (!visible) return null;

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit?.({
            email: String(fd.get("email") || ""),
            phone: String(fd.get("phone") || ""),
            consent: fd.get("consent") === "on",
        });
        handleClose();
    };

    return (
        <div aria-hidden={false} className="fixed inset-0 z-[1000] wix-madefor-text">
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
            <FocusTrap>
                <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="newsletter-heading"
                    aria-describedby="newsletter-desc"
                    className="text-black pointer-events-auto absolute left-1/2 top-1/2 w-[min(92vw,820px)] -translate-x-1/2 -translate-y-1/2 rounded border border-neutral-800 bg-white p-6 shadow-2xl md:p-10"
                >
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={handleClose}
                        className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-black hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        ✕
                    </button>

                    <h2
                        id="newsletter-heading"
                        className="mb-4 md:mt-0 mt-4 text-center text-2xl font-semibold tracking-wide md:text-3xl"
                    >
                        Sign up for the Newsletter For a 15% Discount
                    </h2>

                    <p id="newsletter-desc" className="mb-6 text-black md:text-xl">
                        You will receive the discount code on your registered email. Receive emails about new arrivals, exclusive sales and much more.
                    </p>

                    <form onSubmit={submit} className="space-y-6">
                        <label className="block">
                            <span className="block text-lg">Email</span>
                            <input
                                name="email"
                                type="email"
                                required
                                className="mt-2 block w-full border-0 border-b border-neutral-400 bg-transparent py-2 outline-none focus:border-black"
                                placeholder=""
                            />
                        </label>

                        <label className="block">
                            <span className="block text-lg">Phone number</span>
                            <input
                                name="phone"
                                type="tel"
                                pattern="[0-9+\-\s()]{6,}"
                                className="mt-2 block w-full border-0 border-b border-neutral-400 bg-transparent py-2 outline-none focus:border-black"
                                placeholder=""
                            />
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                name="consent"
                                type="checkbox"
                                className="h-5 w-5 accent-black"
                                aria-describedby="consent-help"
                            />
                            <span id="consent-help">Yes, To subscribe to your newsletter</span>
                        </label>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="group inline-flex h-11 w-16 items-center justify-center rounded-full bg-black text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black"
                                aria-label="Submit"
                            >
                                <span className="translate-x-0 transition group-hover:translate-x-1">➔</span>
                            </button>
                        </div>
                    </form>
                </div>
            </FocusTrap>
        </div>
    );
}
