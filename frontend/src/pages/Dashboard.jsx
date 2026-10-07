import { useAuth } from "@clerk/react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import useCurrentUser from "../hooks/useCurrentUser";

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-xl">
      <div className="text-3xl">{icon}</div>
      <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
      <p className="text-white/70 text-sm mt-1">{label}</p>
    </div>
  );
}

function ActionButton({ to, icon, children, primary }) {
  return (
    <Link
      to={to}
      className={`px-5 py-3 rounded-full font-semibold border transition ${
        primary
          ? "bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/30 hover:bg-cyan-300"
          : "bg-white/10 text-white border-white/20 hover:bg-white/20"
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
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">
      {/* Salomlashish */}
      <div className="flex items-center gap-4 mb-10">
        <img
          src={avatar}
          alt={displayName}
          className="w-20 h-20 rounded-full border-2 border-cyan-300 shadow-lg"
        />
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Salom,{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
              {displayName}
            </span>
            !
          </h1>
          <p className="text-white/70 mt-1">{email}</p>
        </div>
      </div>

      {/* Statistika */}
      <div className="grid gap-6 sm:grid-cols-3 mb-10">
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

      {/* Tezkor amallar */}
      <div className="flex flex-wrap gap-3 mb-12">
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

      {/* So'nggi joylar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">So'nggi qo'shilgan joylar</h2>
        <Link to="/myplaces" className="text-cyan-300 hover:underline text-sm">
          Hammasini ko'rish →
        </Link>
      </div>

      {!loading && places.length === 0 ? (
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 text-center text-white/80">
          Hali joy qo'shmagansiz. Birinchi joyingizni qo'shing! 🏝️
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.slice(0, 3).map((place) => (
            <article
              key={place.id}
              className="group rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:-translate-y-1 hover:border-cyan-300/50 transition-all"
            >
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-cyan-900/60 to-indigo-900/60">
                {place.imageUrl && (
                  <img
                    src={place.imageUrl}
                    alt={place.title}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h3 className="absolute bottom-3 left-4 right-4 text-lg font-bold">
                  {place.title}
                </h3>
                {place.rate != null && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-400 text-slate-900">
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
