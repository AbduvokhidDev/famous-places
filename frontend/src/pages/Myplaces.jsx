import { useAuth } from "@clerk/react";
import { useCallback, useEffect, useState } from "react";
import api from "../api/client";
import useCurrentUser from "../hooks/useCurrentUser";

const EMPTY_FORM = {
  title: "",
  name: "",
  davlat: "",
  location: "",
  rate: "",
  imageUrl: "",
  description: "",
  whichLanguage: "",
  kimBilanBorishKerak: "",
};

const inputClass =
  "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70";

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-sm text-white/80">
        {label} {required && <span className="text-red-300">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function toPayload(form) {
  const clean = (v) => {
    const t = v.trim();
    return t === "" ? null : t;
  };
  return {
    title: form.title.trim(),
    davlat: form.davlat.trim(),
    name: clean(form.name),
    location: clean(form.location),
    description: clean(form.description),
    imageUrl: clean(form.imageUrl),
    whichLanguage: clean(form.whichLanguage),
    kimBilanBorishKerak: clean(form.kimBilanBorishKerak),
    rate: form.rate === "" ? null : Number(form.rate),
  };
}

function Myplaces() {
  const { user, isLoaded } = useCurrentUser();
  const { getToken } = useAuth();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const authConfig = useCallback(async () => {
    const token = await getToken();
    return { headers: { Authorization: `Bearer ${token}` } };
  }, [getToken]);

  const loadPlaces = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/api/places", await authConfig());
      setPlaces(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Joylarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  }, [authConfig]);

  useEffect(() => {
    if (user) loadPlaces();
  }, [user, loadPlaces]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (place) => {
    setEditingId(place.id);
    setForm({
      title: place.title ?? "",
      name: place.name ?? "",
      davlat: place.davlat ?? "",
      location: place.location ?? "",
      rate: place.rate ?? "",
      imageUrl: place.imageUrl ?? "",
      description: place.description ?? "",
      whichLanguage: place.whichLanguage ?? "",
      kimBilanBorishKerak: place.kimBilanBorishKerak ?? "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setModalOpen(false);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.title.trim() || !form.davlat.trim()) {
      setFormError("Nomi va davlat majburiy");
      return;
    }
    if (form.rate !== "" && (Number(form.rate) < 0 || Number(form.rate) > 5)) {
      setFormError("Reyting 0 dan 5 gacha bo'lishi kerak");
      return;
    }

    setSaving(true);
    try {
      const config = await authConfig();
      const payload = toPayload(form);

      if (editingId) {
        const res = await api.put(`/api/places/${editingId}`, payload, config);
        setPlaces((prev) =>
          prev.map((p) => (p.id === editingId ? res.data.data : p)),
        );
      } else {
        const res = await api.post("/api/places", payload, config);
        setPlaces((prev) => [res.data.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      const e = err.response?.data?.error;
      setFormError(
        Array.isArray(e)
          ? e.map((i) => i.message).join(", ")
          : e || "Saqlashda xatolik",
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/places/${deleteTarget.id}`, await authConfig());
      setPlaces((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.error || "O'chirishda xatolik");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-white">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 text-white sm:pb-16">
      <div className="flex flex-col gap-4 pb-6 pt-8 sm:flex-row sm:items-center sm:justify-between sm:pb-8 sm:pt-12">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Mening{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
              joylarim
            </span>
          </h1>
          <p className="mt-2 text-white/70">
            {loading ? "Yuklanmoqda..." : `Jami ${places.length} ta joy`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="w-full rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-300 sm:w-auto"
        >
          ➕ Yangi joy qo'shish
        </button>
      </div>

      {error && <p className="py-4 text-center text-red-300">{error}</p>}

      {!loading && !error && places.length === 0 && (
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-md sm:p-12">
          <p className="mb-4 text-5xl">🏝️</p>
          <p className="mb-6 text-white/80">Hali joy qo'shmagansiz.</p>
          <button
            onClick={openCreate}
            className="w-full rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-300 sm:w-auto"
          >
            Birinchi joyni qo'shish
          </button>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {places.map((place) => (
          <article
            key={place.id}
            className="group overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:border-cyan-300/50"
          >
            <div className="relative h-52 overflow-hidden bg-gradient-to-br from-cyan-900/60 to-indigo-900/60 sm:h-56">
              {place.imageUrl && (
                <img
                  src={place.imageUrl}
                  alt={place.title}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute left-3 top-3 max-w-[60%] truncate rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold backdrop-blur sm:left-4 sm:top-4">
                🌍 {place.davlat}
              </span>
              {place.rate != null && (
                <span className="absolute right-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-slate-900 sm:right-4 sm:top-4">
                  ⭐ {place.rate}
                </span>
              )}
              <h2 className="absolute bottom-3 left-4 right-4 break-words text-xl font-bold sm:bottom-4 sm:left-5 sm:right-5 sm:text-2xl">
                {place.title}
              </h2>
            </div>

            <div className="p-4 sm:p-5">
              {place.name && (
                <p className="text-sm text-white/60">{place.name}</p>
              )}
              {place.location && (
                <p className="mt-1 text-sm font-medium text-cyan-300">
                  📍 {place.location}
                </p>
              )}
              {place.description && (
                <p className="mt-3 line-clamp-3 text-sm text-white/80">
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

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => openEdit(place)}
                  className="flex-1 rounded-full border border-white/20 bg-white/10 py-2.5 text-sm font-medium transition hover:bg-white/20"
                >
                  ✏️ Tahrirlash
                </button>
                <button
                  onClick={() => setDeleteTarget(place)}
                  className="flex-1 rounded-full border border-red-400/40 bg-red-500/20 py-2.5 text-sm font-medium text-red-200 transition hover:bg-red-500/40"
                >
                  🗑 O'chirish
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4"
          onClick={closeModal}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92dvh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-3xl border border-white/20 bg-slate-900/95 p-5 shadow-2xl sm:p-8"
          >
            <h2 className="text-xl font-bold sm:text-2xl">
              {editingId ? "Joyni tahrirlash" : "Yangi joy qo'shish"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nomi" required>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Masalan: Registon maydoni"
                  className={inputClass}
                />
              </Field>
              <Field label="Davlat" required>
                <input
                  name="davlat"
                  value={form.davlat}
                  onChange={handleChange}
                  placeholder="O'zbekiston"
                  className={inputClass}
                />
              </Field>
              <Field label="Manzil / shahar">
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Samarqand"
                  className={inputClass}
                />
              </Field>
              <Field label="Qo'shimcha nom">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
              <Field label="Reyting (0-5)">
                <input
                  type="number"
                  name="rate"
                  min="0"
                  max="5"
                  step="0.1"
                  inputMode="decimal"
                  value={form.rate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
              <Field label="Til">
                <input
                  name="whichLanguage"
                  value={form.whichLanguage}
                  onChange={handleChange}
                  placeholder="uz, en, ru..."
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Kim bilan borish kerak">
              <input
                name="kimBilanBorishKerak"
                value={form.kimBilanBorishKerak}
                onChange={handleChange}
                placeholder="Oila, do'stlar, sayohat guruhi..."
                className={inputClass}
              />
            </Field>

            <Field label="Rasm havolasi (URL)">
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass}
              />
            </Field>

            <Field label="Tavsif">
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            {formError && <p className="text-sm text-red-300">{formError}</p>}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 transition hover:bg-white/20"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-cyan-400 px-6 py-2.5 font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:opacity-60"
              >
                {saving ? "Saqlanmoqda..." : editingId ? "Saqlash" : "Qo'shish"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-white/20 bg-slate-900/95 p-5 text-center shadow-2xl sm:p-6"
          >
            <p className="mb-3 text-4xl">🗑</p>
            <h3 className="text-xl font-bold">O'chirishni tasdiqlang</h3>
            <p className="mt-2 break-words text-white/70">
              "{deleteTarget.title}" butunlay o'chiriladi.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 transition hover:bg-white/20"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 rounded-full bg-red-500 px-4 py-2.5 font-semibold transition hover:bg-red-400 disabled:opacity-60"
              >
                {deleting ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Myplaces;
