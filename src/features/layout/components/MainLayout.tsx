import { Outlet } from "react-router";
import { Suspense } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { Toaster } from "@/components/ui/sonner";
import { BackToTop } from "./BackToTop";

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 w-full relative">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
      <Toaster position="top-center" richColors />
    </div>
  );
};
