import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import useCurrentUser from "../hooks/useCurrentUser";

function PlaceImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-cyan-900/60 to-indigo-900/60 flex items-center justify-center text-5xl">
        🏝️
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 animate-pulse">
      <div className="h-64 bg-white/10" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-2/3 bg-white/20 rounded" />
        <div className="h-3 w-full bg-white/10 rounded" />
        <div className="h-3 w-4/5 bg-white/10 rounded" />
      </div>
    </div>
  );
}

function FamousPlaces() {
  const { isLoaded } = useCurrentUser();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("Hammasi");

  useEffect(() => {
    api
      .get("/api/places/famous")
      .then((res) => setPlaces(res.data.data))
      .catch((err) => setError(err.response?.data?.error || "Server xatosi"))
      .finally(() => setLoading(false));
  }, []);

  const countries = useMemo(
    () => ["Hammasi", ...new Set(places.map((p) => p.davlat).filter(Boolean))],
    [places],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return places.filter((p) => {
      const matchCountry = country === "Hammasi" || p.davlat === country;
      const matchSearch =
        !q ||
        `${p.title} ${p.location ?? ""} ${p.davlat}`.toLowerCase().includes(q);
      return matchCountry && matchSearch;
    });
  }, [places, search, country]);

  const busy = loading || !isLoaded;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      {/* Sarlavha */}
      <div className="text-center pt-12 pb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          Mashhur{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
            joylar
          </span>
        </h1>
        <p className="mt-3 text-white/80 text-lg">
          {busy
            ? "Yuklanmoqda..."
            : `Dunyoning ${places.length} ta ajoyib maskani`}
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-10 space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Joy, shahar yoki davlat qidiring..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                country === c
                  ? "bg-cyan-400 text-slate-900 border-cyan-300 shadow-lg shadow-cyan-500/30"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Holatlar */}
      {error && <p className="text-center text-red-300 py-10">{error}</p>}

      {busy && !error && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!busy && !error && filtered.length === 0 && (
        <p className="text-center text-white/80 py-10">Joylar topilmadi 😕</p>
      )}

      {/* Kartalar */}
      {!busy && !error && filtered.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((place) => (
            <article
              key={place.id}
              className="group rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 hover:border-cyan-300/50 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <PlaceImage src={place.imageUrl} alt={place.title} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur text-white border border-white/20">
                  🌍 {place.davlat}
                </span>

                {place.rate != null && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold bg-yellow-400 text-slate-900 shadow-lg">
                    ⭐ {place.rate}
                  </span>
                )}

                <h2 className="absolute bottom-4 left-5 right-5 text-2xl font-bold text-white drop-shadow-lg">
                  {place.title}
                </h2>
              </div>

              <div className="p-5 text-white">
                {place.location && (
                  <p className="text-cyan-300 text-sm font-medium">
                    📍 {place.location}
                  </p>
                )}

                {place.description && (
                  <p className="mt-3 text-white/80 text-sm leading-relaxed line-clamp-3">
                    {place.description}
                  </p>
                )}

                {(place.whichLanguage || place.kimBilanBorishKerak) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {place.whichLanguage && (
                      <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20">
                        🗣 {place.whichLanguage}
                      </span>
                    )}
                    {place.kimBilanBorishKerak && (
                      <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20">
                        👥 {place.kimBilanBorishKerak}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default FamousPlaces;
