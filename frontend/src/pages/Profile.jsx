import { useClerk } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

function Profile() {
  const { user, isLoaded, displayName, email, avatar } = useCurrentUser();
  const { openUserProfile, signOut } = useClerk();
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="animate-pulse font-semibold text-white">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!user) return null;

  const chiqish = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="px-4 py-6 sm:py-12">
      <div className="container mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-cyan-300/30 bg-black/40 shadow-[0_0_40px_rgba(34,211,238,0.15)] backdrop-blur-xl">
          <div className="relative h-28 bg-gradient-to-r from-cyan-500/80 via-blue-500/70 to-violet-600/80 sm:h-36">
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute right-6 top-4 h-20 w-20 rounded-full bg-cyan-300/30 blur-3xl sm:right-8 sm:h-24 sm:w-24" />
            <div className="absolute bottom-0 left-6 h-24 w-24 rounded-full bg-violet-400/30 blur-3xl sm:left-8 sm:h-28 sm:w-28" />
          </div>

          <div className="relative -mt-14 mb-6 px-4 sm:-mt-16 sm:mb-8 sm:px-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-500 p-1 shadow-[0_0_25px_rgba(34,211,238,0.7)]">
                <img
                  src={avatar}
                  alt={displayName}
                  className="h-24 w-24 rounded-full border-4 border-black/70 object-cover sm:h-32 sm:w-32"
                />
              </div>

              <h1 className="mt-4 max-w-full break-words bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-center text-2xl font-black text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] sm:mt-5 sm:text-3xl">
                {displayName}
              </h1>

              <p className="mt-2 max-w-full break-all text-center text-sm font-medium text-white/70 sm:text-base">
                {email}
              </p>

              <span className="mt-4 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-1.5 text-sm font-semibold text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                ✦ Foydalanuvchi
              </span>
            </div>
          </div>

          <div className="space-y-3 border-t border-white/10 px-4 py-5 sm:space-y-4 sm:px-6 sm:py-6">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md transition-all duration-300 hover:border-cyan-300/40 sm:py-4">
              <span className="shrink-0 text-sm text-white/60">
                Foydalanuvchi ID
              </span>
              <span className="min-w-0 truncate font-mono text-xs text-cyan-300">
                {user.id}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md transition-all duration-300 hover:border-cyan-300/40 sm:py-4">
              <span className="shrink-0 text-sm text-white/60">
                Ro'yxatdan o'tgan
              </span>
              <span className="text-sm font-semibold text-cyan-300 sm:text-base">
                {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-5 sm:flex-row sm:gap-4 sm:px-6 sm:py-6">
            <button
              onClick={() => openUserProfile()}
              className="flex-1 rounded-xl border-2 border-cyan-300 bg-archazor py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-cyan-200 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_10px_rgba(34,211,238,0.8),0_0_30px_rgba(34,211,238,0.5)]"
            >
              ⚙ Hisobni sozlash
            </button>

            <button
              onClick={chiqish}
              className="flex-1 rounded-xl border-2 border-pink-300/70 bg-black/30 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-pink-300 hover:bg-pink-500 hover:shadow-[0_0_10px_rgba(236,72,153,0.8),0_0_30px_rgba(236,72,153,0.5)]"
            >
              Chiqish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
