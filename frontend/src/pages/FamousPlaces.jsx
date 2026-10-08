import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import useCurrentUser from "../hooks/useCurrentUser";

function PlaceImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-900/60 to-indigo-900/60 text-5xl">
        🏝️
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md">
      <div className="h-52 bg-white/10 sm:h-64" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 rounded bg-white/20" />
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-4/5 rounded bg-white/10" />
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
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:pb-16">
      <div className="pb-6 pt-8 text-center sm:pb-8 sm:pt-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl">
          Mashhur{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
            joylar
          </span>
        </h1>
        <p className="mt-3 text-base text-white/80 sm:text-lg">
          {busy
            ? "Yuklanmoqda..."
            : `Dunyoning ${places.length} ta ajoyib maskani`}
        </p>
      </div>

      <div className="mx-auto mb-8 max-w-2xl space-y-4 sm:mb-10">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Joy, shahar yoki davlat qidiring..."
            className="w-full rounded-full border border-white/20 bg-white/10 py-3 pl-11 pr-4 text-base text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
          />
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                country === c
                  ? "border-cyan-300 bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/30"
                  : "border-white/20 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="py-10 text-center text-red-300">{error}</p>}

      {busy && !error && (
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!busy && !error && filtered.length === 0 && (
        <p className="py-10 text-center text-white/80">Joylar topilmadi 😕</p>
      )}

      {!busy && !error && filtered.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {filtered.map((place) => (
            <article
              key={place.id}
              className="group overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300/50 hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              <div className="relative h-52 overflow-hidden sm:h-64">
                <PlaceImage src={place.imageUrl} alt={place.title} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <span className="absolute left-3 top-3 max-w-[60%] truncate rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur sm:left-4 sm:top-4">
                  🌍 {place.davlat}
                </span>

                {place.rate != null && (
                  <span className="absolute right-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-slate-900 shadow-lg sm:right-4 sm:top-4">
                    ⭐ {place.rate}
                  </span>
                )}

                <h2 className="absolute bottom-3 left-4 right-4 break-words text-xl font-bold text-white drop-shadow-lg sm:bottom-4 sm:left-5 sm:right-5 sm:text-2xl">
                  {place.title}
                </h2>
              </div>

              <div className="p-4 text-white sm:p-5">
                {place.location && (
                  <p className="text-sm font-medium text-cyan-300">
                    📍 {place.location}
                  </p>
                )}

                {place.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/80">
                    {place.description}
                  </p>
                )}

                {(place.whichLanguage || place.kimBilanBorishKerak) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {place.whichLanguage && (
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                        🗣 {place.whichLanguage}
                      </span>
                    )}
                    {place.kimBilanBorishKerak && (
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
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
