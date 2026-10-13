import { useUser } from "@clerk/react";
import { useCallback, useState } from "react";
import {
  addComment,
  deleteComment,
  getComments,
  syncUser,
} from "../api/comments";

function Item({ c, isReply, isSignedIn, currentUserId, onReply, onRemove }) {
  return (
    <div
      className={`mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 ${
        isReply ? "ml-6" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {c.user?.avatar ? (
          <img
            src={c.user.avatar}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/30 text-xs">
            👤
          </span>
        )}
        <b className="text-sm text-white">{c.user?.name || "Foydalanuvchi"}</b>
        <small className="text-xs text-white/50">
          {new Date(c.createdAt).toLocaleDateString("uz-UZ")}
        </small>
      </div>

      <p className="mt-2 break-words text-sm text-white/80">{c.text}</p>

      <div className="mt-2 flex gap-3 text-xs">
        {isSignedIn && !isReply && (
          <button
            onClick={() => onReply(c.id)}
            className="text-cyan-300 hover:underline"
          >
            Javob berish
          </button>
        )}
        {currentUserId === c.userId && (
          <button
            onClick={() => onRemove(c.id)}
            className="text-red-300 hover:underline"
          >
            O'chirish
          </button>
        )}
      </div>
    </div>
  );
}

export default function CommentSection({ placeId }) {
  const { user, isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setComments(await getComments(placeId));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      setError("");
      await load();
      if (isSignedIn && user) {
        syncUser({
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          avatar: user.imageUrl,
        }).catch(() => {});
      }
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setError("");
      await addComment(placeId, text.trim(), replyTo);
      setText("");
      setReplyTo(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Izohni o'chirasizmi?")) return;
    try {
      await deleteComment(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const roots = comments.filter((c) => !c.parentId);
  const repliesOf = (id) => comments.filter((c) => c.parentId === id);

  return (
    <div className="mt-3">
      <button
        onClick={toggle}
        className="w-full rounded-full border border-white/20 bg-white/10 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
      >
        💬 {open ? "Izohlarni yopish" : "Izohlar"}
      </button>

      {open && (
        <section className="mt-3">
          {isSignedIn ? (
            <form onSubmit={submit} className="space-y-2">
              {replyTo && (
                <p className="text-xs text-cyan-300">
                  Javob yozilmoqda{" "}
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="underline"
                  >
                    bekor qilish
                  </button>
                </p>
              )}
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Izoh yozing..."
                  className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                />
                <button
                  type="submit"
                  className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-300"
                >
                  Yuborish
                </button>
              </div>
            </form>
          ) : (
            <p className="text-center text-sm text-white/70">
              Izoh yozish uchun tizimga kiring.
            </p>
          )}

          {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
          {loading && (
            <p className="mt-3 text-sm text-white/60">Yuklanmoqda...</p>
          )}
          {!loading && roots.length === 0 && (
            <p className="mt-3 text-center text-sm text-white/60">
              Hozircha izoh yo'q.
            </p>
          )}

          {roots.map((c) => (
            <div key={c.id}>
              <Item
                c={c}
                isSignedIn={isSignedIn}
                currentUserId={user?.id}
                onReply={setReplyTo}
                onRemove={remove}
              />
              {repliesOf(c.id).map((r) => (
                <Item
                  key={r.id}
                  c={r}
                  isReply
                  isSignedIn={isSignedIn}
                  currentUserId={user?.id}
                  onReply={setReplyTo}
                  onRemove={remove}
                />
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
