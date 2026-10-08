import { SignInButton, SignUpButton } from "@clerk/react";

const btn =
  "w-full rounded-lg border-2 border-cyan-300 bg-archazor px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:border-cyan-200 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_10px_rgba(34,211,238,0.8),0_0_30px_rgba(34,211,238,0.5),inset_0_0_10px_rgba(255,255,255,0.3)] sm:w-auto";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center sm:py-24">
      <h1 className="mb-6 break-words bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-3xl font-extrabold text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-500 hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.9)] sm:text-4xl md:text-5xl lg:text-6xl">
        Welcome to famous places✨
      </h1>
      <p className="mb-8 max-w-xl bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-base font-semibold text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-500 hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] sm:text-lg md:text-xl">
        Siz bo'lgan eng mashhur joylarni saqlang, boshqaring. Kirish yoki
        ro'yxatdan o'ting va boshlang.
      </p>
      <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
        <SignUpButton mode="modal">
          <button className={btn}>Boshlash</button>
        </SignUpButton>
        <SignInButton mode="modal">
          <button className={btn}>Kirish</button>
        </SignInButton>
      </div>
    </div>
  );
}

export default Home;
