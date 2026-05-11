import { useState } from "react";
import { HeroCarousel } from "./HeroCarousel";
import { Sidebar } from "./Sidebar";

export const HeroSection = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-4">
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-11">
        {}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {}
        <div className="flex-1 min-w-0">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
};
