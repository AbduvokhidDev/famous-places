import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-cyan-300 font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300"
      : "text-white hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300";

  return (
    <header
      className="
    w-full
    bg-black/50
    backdrop-blur-2xl
    shadow-[0_10px_40px_rgba(0,0,0,0.45)]
    sticky top-0
    z-50
  "
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="
    font-heading text-2xl font-black
    bg-gradient-to-r from-white via-cyan-200 to-cyan-400
    bg-clip-text text-transparent
    drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]
    hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]
    hover:scale-105
    transition-all duration-300
    inline-block
    tracking-wide
  "
        >
          Famous places ✦
        </Link>

        <nav className="flex items-center gap-6">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <SignInButton mode="modal">
                <button
                  className="
      bg-archazor text-white px-4 py-2 rounded-lg font-medium
      transition-all duration-300
      hover:bg-cyan-400
      hover:text-black
      hover:shadow-[0_0_20px_rgba(34,211,238,0.8)]
      hover:scale-105
    "
                >
                  Kirish
                </button>
              </SignInButton>
            </SignInButton>

            <SignUpButton mode="modal">
              <SignUpButton mode="modal">
                <button
                  className="
      bg-archazor text-white px-4 py-2 rounded-lg font-medium
      transition-all duration-300
      hover:bg-cyan-400
      hover:text-black
      hover:shadow-[0_0_20px_rgba(34,211,238,0.8)]
      hover:scale-105
    "
                >
                  Ro'yxatdan o'tish
                </button>
              </SignUpButton>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
            <NavLink to="/myplaces" className={linkClass}>
              My Places
            </NavLink>
            <NavLink to="/famousplaces" className={linkClass}>
              Famous Places
            </NavLink>

            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
