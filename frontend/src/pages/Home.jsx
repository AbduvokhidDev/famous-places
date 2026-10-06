import { SignInButton, SignUpButton } from "@clerk/react";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <h1
        className="
    text-4xl md:text-5xl lg:text-6xl
    font-extrabold
    mb-6
    bg-gradient-to-r from-white via-cyan-200 to-cyan-400
    bg-clip-text text-transparent
    drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]
    hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.9)]
    transition-all duration-500
  "
      >
        Welcome to famous places✨
      </h1>
      <p
        className="
    text-lg md:text-xl
    font-semibold
    max-w-xl
    mb-8
    bg-gradient-to-r from-white via-cyan-100 to-cyan-300
    bg-clip-text text-transparent
    drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]
    hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]
    transition-all duration-500
  "
      >
        Siz bo'lgan eng mashhur joylarni saqlang, boshqaring. Kirish yoki
        ro'yxatdan o'ting va boshlang.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <SignUpButton mode="modal">
          <button
            className="
    relative px-6 py-3 rounded-lg font-medium
    text-white
    bg-archazor
    border-2 border-cyan-300
    transition-all duration-300
    hover:bg-cyan-400
    hover:text-black
    hover:border-cyan-200
    hover:shadow-[0_0_10px_rgba(34,211,238,0.8),0_0_30px_rgba(34,211,238,0.5),inset_0_0_10px_rgba(255,255,255,0.3)]
    hover:scale-105
  "
          >
            Boshlash
          </button>
        </SignUpButton>
        <SignInButton mode="modal">
          <button
            className="
    px-6 py-3 rounded-lg font-medium
    text-white
    bg-archazor
    border-2 border-cyan-300
    transition-all duration-300
    hover:bg-cyan-400
    hover:text-black
    hover:border-cyan-200
    hover:shadow-[0_0_10px_rgba(34,211,238,0.8),0_0_30px_rgba(34,211,238,0.5),inset_0_0_10px_rgba(255,255,255,0.3)]
    hover:scale-105
  "
          >
            Kirish
          </button>
        </SignInButton>
      </div>
    </div>
  );
}

export default Home;
