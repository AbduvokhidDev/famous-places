import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
  { to: "/myplaces", label: "My Places" },
  { to: "/famousplaces", label: "Famous Places" },
  { to: "/about", label: "About" },
];

const authBtn =
  "bg-archazor text-white px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.8)] hover:scale-105 sm:px-4 sm:py-2 sm:text-base";

function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-cyan-300 font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300"
      : "text-white hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300";

  return (
    <header className="sticky top-0 z-50 w-full bg-black/50 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="font-heading inline-block whitespace-nowrap bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-xl font-black tracking-wide text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.9)] md:text-2xl"
        >
          Famous places ✦
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className={authBtn}>Kirish</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className={authBtn}>Ro'yxatdan o'tish</button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <nav className="hidden items-center gap-6 md:flex">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkClass}>
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <UserButton />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menyu"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </Show>
        </div>
      </div>

      <Show when="signed-in">
        {open && (
          <nav className="flex flex-col gap-1 border-t border-white/10 px-4 pb-4 pt-2 md:hidden">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={(state) =>
                  `block rounded-lg px-2 py-3 ${linkClass(state)}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </Show>
    </header>
  );
}

export default Navbar;
