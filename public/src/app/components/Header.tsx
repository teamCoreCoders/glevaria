'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { CgProfile, CgShoppingCart } from 'react-icons/cg';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';

/* ---------------- Currency menu ---------------- */

const CURRENCIES = [
    { code: 'USD', label: 'USD', symbol: '$' },
    { code: 'AED', label: 'AED', symbol: 'د.إ' },
    { code: 'INR', label: 'INR', symbol: '₹' },
    { code: 'EUR', label: 'EUR', symbol: '€' },
    { code: 'AUD', label: 'AUD', symbol: 'A$' },
    { code: 'CAD', label: 'CAD', symbol: 'C$' },
] as const;

type Currency = typeof CURRENCIES[number]['code'];

function CurrencyMenu({ compact = false }: { compact?: boolean }) {
    const [open, setOpen] = useState(false);
    const [currency, setCurrency] = useState<Currency>('USD');

    useEffect(() => {
        const fromStorage = typeof window !== 'undefined' ? localStorage.getItem('currency') : null;
        const fromUrl =
            typeof window !== 'undefined'
                ? (new URLSearchParams(window.location.search).get('currency') as Currency | null)
                : null;
        const initial = (fromUrl || fromStorage || 'USD') as Currency;
        if (CURRENCIES.find((c) => c.code === initial)) setCurrency(initial);
    }, []);

    const active = useMemo(() => CURRENCIES.find((c) => c.code === currency)!, [currency]);

    const selectCurrency = (code: Currency) => {
        setCurrency(code);
        localStorage.setItem('currency', code);
        const url = new URL(window.location.href);
        url.searchParams.set('currency', code);
        window.history.replaceState({}, '', url.toString());
        setOpen(false);
    };

    return (
        <div className="relative z-10">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1 text-[#F7F5EF]"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="uppercase">
                    {active.code}
                    {!compact && ` (${active.symbol})`}
                </span>
                <MdKeyboardArrowDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <ul
                    role="listbox"
                    className="absolute right-0 mt-2 w-36 bg-black text-[#F7F5EF] shadow-lg ring-1 ring-white/10 focus:outline-none"
                >
                    {CURRENCIES.map((c) => {
                        const isActive = c.code === active.code;
                        return (
                            <li key={c.code}>
                                <button
                                    role="option"
                                    aria-selected={isActive}
                                    onClick={() => selectCurrency(c.code)}
                                    className={`w-full text-left px-4 py-2 hover:bg-white/10 ${isActive ? 'bg-white/15' : ''}`}
                                >
                                    <span className="uppercase">{c.code}</span> ({c.symbol})
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

/* ---------------- Collection menu (desktop inline) ---------------- */

const COLLECTION_CATEGORIES = [
    { name: 'Lumiere', icon: '/images/lumiere.png', href: '/categories/lumiere' },
    { name: 'Prism', icon: '/images/prism.png', href: '/categories/prism' },
    { name: 'Soleil', icon: '/images/soleil.png', href: '/categories/soleil' },
    { name: 'Riviere', icon: '/images/riviere.png', href: '/categories/riviere' },
    { name: 'Amour', icon: '/images/amour.png', href: '/categories/amour' },
    { name: 'Ivy', icon: '/images/ivy.png', href: '/categories/ivy' },
] as const;

const FEATURED_ITEMS = [
    { id: 1, href: '/categories/feature-1', image: '/images/blue-pendant.png', label: 'Check this' },
    { id: 2, href: '/categories/feature-2', image: '/images/green-ring.png', label: 'Check that' },
] as const;

function CollectionMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [open]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={open}
            >
                Collection
                <MdKeyboardArrowDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute left-[350px] -translate-x-1/2 top-[50px] w-screen z-40">
                    <div className="mx-auto max-w-[1400px] bg-[#F3EFEB] text-black shadow-xl ring-1 ring-black/10">
                        <div className="flex items-start gap-8 px-10 py-1">
                            <div className="shrink-0 pt-1 min-w-[120px]">
                                <p className="text-lg tracking-wide text-black">Collection</p>
                            </div>

                            <aside className="shrink-0">
                                <h4 className="text-sm tracking-wide text-black/70 mb-3">Categories</h4>
                                <ul className="space-y-4">
                                    {COLLECTION_CATEGORIES.map((c) => (
                                        <li key={c.name}>
                                            <Link
                                                href={c.href}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-3 px-2 rounded hover:bg-black/5"
                                            >
                                                <img src={c.icon} alt="" className="h-8 w-8 object-contain" />
                                                <span className="text-sm">{c.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </aside>

                            <div className="grow" />

                            <div className="flex items-start gap-10">
                                {FEATURED_ITEMS.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="block text-center"
                                    >
                                        <div className="bg-black aspect-[3/4] w-[155px] max-w-[28vw] overflow-hidden">
                                            <img src={item.image} alt="" className="h-full w-full object-contain" />
                                        </div>
                                        <p className="mt-2 text-[11px] leading-none text-black/70">{item.label}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------------- Mobile drawer ---------------- */

function useBodyLock(locked: boolean) {
    useEffect(() => {
        if (!locked) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [locked]);
}

function MobileDrawer({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    useBodyLock(open);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    const [collectionOpen, setCollectionOpen] = useState(false);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity duration-200 lg:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />
            {/* Panel */}
            <aside
                className={`z-10 fixed top-0 right-0 h-full w-full bg-[#0B0B0B] text-[#F7F5EF] shadow-xl ring-1 ring-white/10 transition-transform duration-300 will-change-transform lg:hidden ${open ? 'translate-x-0' : 'translate-x-full'
                    }`}
                aria-hidden={!open}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <span className="text-2xl bodoni-moda-bm">GLEVERA</span>
                    <button aria-label="Close menu" onClick={onClose} className="p-2">
                        <IoClose className="w-6 h-6" />
                    </button>
                </div>

                <nav className="px-2 py-3">
                    <ul className="space-y-1">
                        {/* Collection collapsible */}
                        <li>
                            <button
                                onClick={() => setCollectionOpen((v) => !v)}
                                className="w-full flex items-center justify-between px-3 py-3 rounded hover:bg-white/5"
                            >
                                <span>Collection</span>
                                <MdKeyboardArrowDown
                                    className={`w-5 h-5 transition-transform ${collectionOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {collectionOpen && (
                                <div className="px-3 pb-2">
                                    <p className="text-xs text-white/60 mb-2">Categories</p>
                                    <ul className="grid grid-cols-2 gap-2">
                                        {COLLECTION_CATEGORIES.map((c) => (
                                            <li key={c.name}>
                                                <Link
                                                    href={c.href}
                                                    onClick={onClose}
                                                    className="flex items-center gap-2 px-2 py-2 rounded hover:bg-white/5"
                                                >
                                                    <img src={c.icon} alt="" className="h-12 w-12 object-contain" />
                                                    <span className="text-sm">{c.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* Flat links */}
                        <li>
                            <Link href="/categories/bracelets" onClick={onClose} className="block px-3 py-3 rounded hover:bg-white/5">
                                Bracelets
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories/necklaces" onClick={onClose} className="block px-3 py-3 rounded hover:bg-white/5">
                                Necklaces
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories/earrings" onClick={onClose} className="block px-3 py-3 rounded hover:bg-white/5">
                                Earrings
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories/rings" onClick={onClose} className="block px-3 py-3 rounded hover:bg-white/5">
                                Rings
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories/our-story" onClick={onClose} className="block px-3 py-3 rounded hover:bg-white/5">
                                Our Story
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories/contact" onClick={onClose} className="block px-3 py-3 rounded hover:bg-white/5">
                                Contact
                            </Link>
                        </li>

                        {/* Currency (compact) */}
                        <li className="px-3 pt-1">
                            <CurrencyMenu compact />
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
}

/* ---------------- Basic cart panel ---------------- */

function CartPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />
            <aside
                className={`z-30 fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#0B0B0B] text-[#F7F5EF] shadow-2xl ring-1 ring-white/10 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'
                    }`}
                aria-hidden={!open}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <span className="text-lg">Your Cart</span>
                    <button onClick={onClose} className="p-2" aria-label="Close cart">
                        <IoClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Empty/cart items placeholder */}
                <div className="p-4 space-y-4">
                    <div className="text-white/70 text-sm">Your cart is empty.</div>
                    {/* Example item row (remove when wiring to real cart) */}
                    {/* <div className="flex items-center gap-3">
            <img src="/images/sample-item.jpg" className="w-16 h-16 object-cover rounded" alt="" />
            <div className="flex-1">
              <p className="text-sm">Pink Lab Diamond Ring</p>
              <p className="text-xs text-white/60">Size 6 • Qty 1</p>
            </div>
            <p className="text-sm">$1,250</p>
          </div> */}
                </div>

                <div className="mt-auto p-4 border-t border-white/10">
                    <div className="flex justify-between text-sm mb-3">
                        <span>Subtotal</span>
                        <span>$0.00</span>
                    </div>
                    <button className="w-full py-2 rounded bg-white/10 hover:bg-white/20 text-sm">
                        Checkout
                    </button>
                </div>
            </aside>
        </>
    );
}

/* ---------------- Header with responsive menus ---------------- */

export default function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showSearch) {
            const id = setTimeout(() => searchRef.current?.focus(), 150);
            return () => clearTimeout(id);
        }
    }, [showSearch]);

    const onSubmitMobileSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchRef.current?.value?.trim();
        if (!q) return;
        // Replace with router if desired
        window.location.href = `/search?q=${encodeURIComponent(q)}`;
    };

    return (
        <header className="bg-black">
            {/* First row */}
            <div className="max-w-[1400px] mx-auto flex justify-between items-center px-4 py-2">
                {/* Search left (desktop) */}
                <div className="hidden lg:flex items-center gap-2">
                    <FiSearch className="text-[#F7F5EF] w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-black text-[#F7F5EF] placeholder-[#F7F5EF] w-24 md:w-30 outline-none text-md"
                    />
                </div>
                {/* Free shipping text right */}
                <div className="text-[#F7F5EF] text-sm px-2 py-1">Free shipping on all orders Worldwide</div>
            </div>

            {/* Second row */}
            <div className="max-w-[1400px] mx-auto px-4 py-3 relative">
                <div className="flex items-center justify-between">
                    {/* Logo left */}
                    <div className="px-2">
                        <span className="text-white text-2xl md:text-5xl bodoni-moda-bm">GLEVERA</span>
                    </div>

                    {/* Navigation center (desktop only) */}
                    <nav className="hidden lg:flex justify-center">
                        <ul className="flex flex-wrap justify-center md:gap-5 text-[#F7F5EF] text-lg px-2 py-1">
                            <li>
                                <CollectionMenu />
                            </li>
                            <li className="px-2">
                                <Link href="/categories/bracelets" className="hover:underline">
                                    Bracelets
                                </Link>
                            </li>
                            <li className="px-2">
                                <Link href="/categories/necklaces" className="hover:underline">
                                    Necklaces
                                </Link>
                            </li>
                            <li className="px-2">
                                <Link href="/categories/earrings" className="hover:underline">
                                    Earrings
                                </Link>
                            </li>
                            <li className="px-2">
                                <Link href="/categories/rings" className="hover:underline">
                                    Rings
                                </Link>
                            </li>
                            <li className="px-2">
                                <Link href="/categories/our-story" className="hover:underline">
                                    Our Story
                                </Link>
                            </li>
                            <li className="px-2">
                                <Link href="/categories/contact" className="hover:underline">
                                    Contact
                                </Link>
                            </li>
                            <li className="px-2">
                                <CurrencyMenu />
                            </li>
                        </ul>
                    </nav>

                    {/* Right icons desktop */}
                    <div className="hidden lg:flex justify-end items-center gap-4 text-[#F7F5EF] px-2 py-1">
                        <MdOutlineFavoriteBorder className="w-6 h-6 cursor-pointer" />
                        <CgShoppingCart onClick={() => setCartOpen(true)} className="w-6 h-6 cursor-pointer" />
                        <CgProfile className="w-6 h-6 cursor-pointer" />
                    </div>

                    {/* Mobile / Tablet actions: icons + hamburger on the right */}
                    <div className="flex lg:hidden items-center gap-2 text-[#F7F5EF] ml-auto">
                        <button aria-label="Toggle search" onClick={() => setShowSearch((v) => !v)} className="p-1">
                            <FiSearch className="w-5 h-5" />
                        </button>
                        <button aria-label="Wishlist" className="p-1">
                            <MdOutlineFavoriteBorder className="w-6 h-6" />
                        </button>
                        <button aria-label="Open cart" onClick={() => setCartOpen(true)} className="p-1">
                            <CgShoppingCart className="w-6 h-6" />
                        </button>
                        <button aria-label="Profile" className="p-1">
                            <CgProfile className="w-6 h-6" />
                        </button>
                        <button
                            aria-label="Open menu"
                            onClick={() => setDrawerOpen(true)}
                            className="p-1"
                        >
                            <RxHamburgerMenu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Slide-down search (mobile/tablet only) */}
                <div
                    className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${showSearch ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <form onSubmit={onSubmitMobileSearch} className="px-2 pt-3">
                        <div className="flex items-center gap-2 bg-black/50 border border-white/15 rounded-md px-3 py-2">
                            <FiSearch className="w-5 h-5 text-white/80" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search products"
                                className="bg-transparent outline-none w-full text-[15px] placeholder-white/60"
                            />
                            <button type="submit" className="px-3 py-1 text-sm rounded bg-white/10 hover:bg-white/20">
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Mobile drawer */}
            <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            {/* Cart panel for all screens (primarily used on mobile/tablet) */}
            <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
        </header>
    );
}