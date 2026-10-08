import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-slate-950 text-white">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/30 blur-[80px] md:-top-40 md:-left-40 md:h-[500px] md:w-[500px] md:blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-indigo-600/30 blur-[80px] md:-right-40 md:h-[500px] md:w-[500px] md:blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-60 w-60 rounded-full bg-sky-500/20 blur-[80px] md:left-1/3 md:h-[400px] md:w-[400px] md:blur-[120px]" />

      <div className="relative flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
