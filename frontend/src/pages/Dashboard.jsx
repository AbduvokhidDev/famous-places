import { useAuth } from "@clerk/react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import useCurrentUser from "../hooks/useCurrentUser";

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md sm:p-6">
      <div className="text-2xl sm:text-3xl">{icon}</div>
      <p className="mt-2 text-2xl font-extrabold text-white sm:mt-3 sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs text-white/70 sm:text-sm">{label}</p>
    </div>
  );
}

function ActionButton({ to, icon, children, primary }) {
  return (
    <Link
      to={to}
      className={`rounded-full border px-4 py-2.5 text-center text-sm font-semibold transition sm:px-5 sm:py-3 sm:text-base ${
        primary
          ? "border-cyan-300 bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/30 hover:bg-cyan-300"
          : "border-white/20 bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {icon} {children}
    </Link>
  );
}

function Dashboard() {
  const { user, isLoaded, displayName, email, avatar } = useCurrentUser();
  const { getToken } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await getToken();
        const res = await api.get("/api/places", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaces(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, getToken]);

  const stats = useMemo(() => {
    const rated = places.filter((p) => p.rate != null);
    const avg = rated.length
      ? (rated.reduce((s, p) => s + p.rate, 0) / rated.length).toFixed(1)
      : "-";
    const countries = new Set(places.map((p) => p.davlat)).size;
    return { total: places.length, avg, countries };
  }, [places]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-white">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 text-white sm:py-10">
      <div className="mb-8 flex items-center gap-3 sm:mb-10 sm:gap-4">
        <img
          src={avatar}
          alt={displayName}
          className="h-14 w-14 shrink-0 rounded-full border-2 border-cyan-300 shadow-lg sm:h-20 sm:w-20"
        />
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-extrabold sm:text-4xl">
            Salom,{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
              {displayName}
            </span>
            !
          </h1>
          <p className="mt-1 truncate text-sm text-white/70 sm:text-base">
            {email}
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3 sm:mb-10 sm:gap-6">
        <StatCard
          icon="📍"
          label="Mening joylarim"
          value={loading ? "..." : stats.total}
        />
        <StatCard
          icon="⭐"
          label="O'rtacha reyting"
          value={loading ? "..." : stats.avg}
        />
        <StatCard
          icon="🌍"
          label="Davlatlar"
          value={loading ? "..." : stats.countries}
        />
      </div>

      <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:flex-wrap">
        <ActionButton to="/myplaces" icon="➕" primary>
          Yangi joy qo'shish
        </ActionButton>
        <ActionButton to="/famousplaces" icon="🌍">
          Mashhur joylar
        </ActionButton>
        <ActionButton to="/profile" icon="👤">
          Profil
        </ActionButton>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold sm:text-2xl">
          So'nggi qo'shilgan joylar
        </h2>
        <Link
          to="/myplaces"
          className="shrink-0 text-sm text-cyan-300 hover:underline"
        >
          Hammasi →
        </Link>
      </div>

      {!loading && places.length === 0 ? (
        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-center text-white/80 backdrop-blur-md sm:p-8">
          Hali joy qo'shmagansiz. Birinchi joyingizni qo'shing! 🏝️
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {places.slice(0, 3).map((place) => (
            <article
              key={place.id}
              className="group overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:border-cyan-300/50"
            >
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-cyan-900/60 to-indigo-900/60">
                {place.imageUrl && (
                  <img
                    src={place.imageUrl}
                    alt={place.title}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h3 className="absolute bottom-3 left-4 right-4 text-lg font-bold">
                  {place.title}
                </h3>
                {place.rate != null && (
                  <span className="absolute right-3 top-3 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">
                    ⭐ {place.rate}
                  </span>
                )}
              </div>
              <p className="p-4 text-sm text-cyan-300">
                📍 {place.location ? `${place.location}, ` : ""}
                {place.davlat}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
