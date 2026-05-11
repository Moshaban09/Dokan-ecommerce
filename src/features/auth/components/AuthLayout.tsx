import { Outlet } from "react-router";
import { Suspense } from "react";
import authImg from "@/assets/auth.png";

export function AuthLayout() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-[100px] xl:gap-[129px] min-h-[calc(100vh-142px)] pt-15 pb-20 lg:pt-15 lg:pb-35 overflow-x-hidden">
      <div className="hidden lg:flex lg:w-1/2 xl:w-[805px] bg-[#CBE4E8] rounded-e-sm overflow-hidden items-end justify-center h-auto">
        <img
          src={authImg}
          alt="Authentication"
          className="w-full h-full object-contain pt-10"
        />
      </div>

      {}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 lg:px-0">
        <Suspense
          fallback={
            <div className="w-full flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-slate-300 border-t-black rounded-full animate-spin"></div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
