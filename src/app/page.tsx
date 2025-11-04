
import HomePage from "./pages/HomePage";
import { FaWhatsapp } from "react-icons/fa";

export default function page() {
  return (
    <main className="bg-[#1A1A1D] text-[#F7F5EF]">
      <HomePage />
      {/* WhatsApp button (absolute inside hero) */}
      <a
        href="https://wa.me/919820026633"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-4 right-4 z-100 grid place-items-center w-12 h-12 rounded-full text-white transition-colors focus:outline-none"
      >
        <FaWhatsapp className="w-12 h-12" />
      </a>
    </main>
  );
}
