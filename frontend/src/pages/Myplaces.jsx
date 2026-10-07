import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
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
  "w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/70";

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
          prev.map((p) => (p.id === editingId ? res.data.data : p))
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
          : e || "Saqlashda xatolik"
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
    <div className="max-w-7xl mx-auto px-4 pb-16 text-white">
      {/* Sarlavha */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-12 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold">
            Mening{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
              joylarim
            </span>
          </h1>
          <p className="text-white/70 mt-2">
            {loading ? "Yuklanmoqda..." : `Jami ${places.length} ta joy`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-6 py-3 rounded-full font-semibold bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/30 hover:bg-cyan-300 transition"
        >
          ➕ Yangi joy qo'shish
        </button>
      </div>

      {error && <p className="text-center text-red-300 py-4">{error}</p>}

      {/* Bo'sh holat */}
      {!loading && !error && places.length === 0 && (
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-12 text-center">
          <p className="text-5xl mb-4">🏝️</p>
          <p className="text-white/80 mb-6">Hali joy qo'shmagansiz.</p>
          <button
            onClick={openCreate}
            className="px-6 py-3 rounded-full font-semibold bg-cyan-400 text-slate-900 hover:bg-cyan-300 transition"
          >
            Birinchi joyni qo'shish
          </button>
        </div>
      )}

      {/* Kartalar */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <article
            key={place.id}
            className="group rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:-translate-y-1 hover:border-cyan-300/50 transition-all"
          >
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-cyan-900/60 to-indigo-900/60">
              {place.imageUrl && (
                <img
                  src={place.imageUrl}
                  alt={place.title}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur border border-white/20">
                🌍 {place.davlat}
              </span>
              {place.rate != null && (
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold bg-yellow-400 text-slate-900">
                  ⭐ {place.rate}
                </span>
              )}
              <h2 className="absolute bottom-4 left-5 right-5 text-2xl font-bold">
                {place.title}
              </h2>
            </div>

            <div className="p-5">
              {place.name && (
                <p className="text-white/60 text-sm">{place.name}</p>
              )}
              {place.location && (
                <p className="text-cyan-300 text-sm font-medium mt-1">
                  📍 {place.location}
                </p>
              )}
              {place.description && (
                <p className="mt-3 text-white/80 text-sm line-clamp-3">
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

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => openEdit(place)}
                  className="flex-1 py-2 rounded-full text-sm font-medium bg-white/10 border border-white/20 hover:bg-white/20 transition"
                >
                  ✏️ Tahrirlash
                </button>
                <button
                  onClick={() => setDeleteTarget(place)}
                  className="flex-1 py-2 rounded-full text-sm font-medium bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/40 transition"
                >
                  🗑 O'chirish
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Forma (modal) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900/95 border border-white/20 p-6 sm:p-8 shadow-2xl space-y-4"
          >
            <h2 className="text-2xl font-bold">
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

            {formError && <p className="text-red-300 text-sm">{formError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-full font-semibold bg-cyan-400 text-slate-900 hover:bg-cyan-300 disabled:opacity-60 transition"
              >
                {saving ? "Saqlanmoqda..." : editingId ? "Saqlash" : "Qo'shish"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* O'chirishni tasdiqlash */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-slate-900/95 border border-white/20 p-6 text-center shadow-2xl"
          >
            <p className="text-4xl mb-3">🗑</p>
            <h3 className="text-xl font-bold">O'chirishni tasdiqlang</h3>
            <p className="text-white/70 mt-2">
              "{deleteTarget.title}" butunlay o'chiriladi.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-full font-semibold bg-red-500 hover:bg-red-400 disabled:opacity-60 transition"
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
