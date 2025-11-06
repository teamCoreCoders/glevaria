import HomePage from "./pages/HomePage";
import Image from "next/image";

export default function page() {
  return (
    <main className="bg-[#1A1A1D] text-[#F7F5EF]">
      <HomePage />

      {/* WhatsApp button with custom image (bigger size) */}
      <a
        href="https://wa.me/919820026633"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-4 right-4 z-[100] grid place-items-center w-16 h-16 focus:outline-none"
      >
        <span className="relative inline-block w-12 h-12">
          <Image
            src="/images/whatsapp.png"
            alt="WhatsApp"
            fill
            sizes="48px"
            className="object-contain"
            priority
          />
        </span>
      </a>
    </main>
  );
}
