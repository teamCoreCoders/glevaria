'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full bg-black text-white wix-madefor-text">
            {/* Top grid: links + contact */}
            <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8 py-10 md:py-14">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
                    {/* Column 1 */}
                    <nav className="space-y-3">
                        <FooterLink href="/">Home</FooterLink>
                        <FooterLink href="/shop">Shop</FooterLink>
                        <FooterLink href="/our-story">Our Story</FooterLink>
                        <FooterLink href="/gift-card">Gift Card</FooterLink>
                        <FooterLink href="/contact">Contact</FooterLink>
                        <FooterLink href="/locations">Locations</FooterLink>
                    </nav>

                    {/* Column 2 */}
                    <nav className="space-y-3">
                        <FooterLink href="/faq">FAQ</FooterLink>
                        <FooterLink href="/terms-conditions">Terms & Conditions</FooterLink>
                        <FooterLink href="/shipping-policy">Shipping Policy</FooterLink>
                        <FooterLink href="/refund-policy">Refund Policy</FooterLink>
                        <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                        <FooterLink href="/accessibility">Accessibility Statement</FooterLink>
                    </nav>

                    {/* Column 3/4: address + contact (spans 2 on large for similar spacing) */}
                    <div className="col-span-2 lg:col-span-2">
                        <address className="not-italic text-sm leading-6 text-white/80">
                            340, 341, Diamond Village, Mahidarpura,<br />
                            Surat, 395007
                        </address>
                        <div className="mt-3 space-y-1 text-sm text-white/80">
                            <a href="mailto:contact@grandeurjewels.in" className="hover:underline">
                                contact@grandeurjewels.in
                            </a>
                            <div>
                                <a href="tel:+919638222738" className="hover:underline">+91 9638222738</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Big wordmark */}
                <div className="pt-12 md:pt-16">
                    <div className="flex items-center justify-center">
                        <span className="fraunces-text tracking-[15px] md:tracking-[25px] text-[40px] md:text-[80px] leading-none">
                            GLEVERA
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8 pb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Socials */}
                    <div className="flex items-center gap-6 text-sm text-white/80">
                        <Social href="https://instagram.com">Instagram</Social>
                        <Social href="https://twitter.com">Twitter</Social>
                        <Social href="https://facebook.com">Facebook</Social>
                        <Social href="https://pinterest.com">Pinterest</Social>
                    </div>

                    {/* Copyright */}
                    <div className="text-xs text-white/60">
                        © 2025 Grandeur. All rights reseverd.
                        {/* <a
                            href="https://www.wix.com/studio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:no-underline"
                        >
                            Wix Studio
                        </a> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="block text-sm text-white/80 hover:text-white transition-colors"
        >
            {children}
        </Link>
    );
}

function Social({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
        >
            {children}
        </a>
    );
}
