"use client";

import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NewsletterModal from "../components/NewsletterModal";
import BestSellersSection from "../sections/HomePageSections/BestSellersSection";
import HeroSection from "../sections/HomePageSections/HeroSection";
// import CategoriesShowcase from "../components/CategoriesShowcase";
import MarqueeBanner from "../components/MarqueeBanner";

import { Inter } from "next/font/google"; // clean sans like the reference
import ThreeFeatureCards from "../components/ThreeFeatureCards";
import VerticalCarousel from "../components/VerticalCarousel";

const inter = Inter({ subsets: ["latin"], weight: ["400"] })

export default function HomePage() {
    const [open, setOpen] = useState(false);
    return (

        <main className="bg-black text-white wix-madefor-text">
            <Header />
            {/* <NewsletterModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={(data) => {
                    // TODO: integrate with Firestore/Mailchimp/etc.
                    console.log(data);
                }}
            /> */}
            <HeroSection />
            <BestSellersSection />
            <VerticalCarousel />
            {/* <CategoriesShowcase /> */}
            <main className={`${inter.className}`}>
                <MarqueeBanner
                    text="New Arrivals Every Week"
                    repeat={12}
                    speedSec={16}
                    gapRem={0.5}
                    direction="left"
                    className="py-3 fraunces-text" /* thin band like screenshot */
                />
            </main>
            <ThreeFeatureCards />
            <Footer />
        </main>
    );
}
