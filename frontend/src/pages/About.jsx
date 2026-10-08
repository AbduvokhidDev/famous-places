import { Link } from "react-router-dom";

const links = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "Telegram", href: "https://t.me/" },
];

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 text-white sm:pb-24">
      <section className="pb-12 pt-10 sm:pb-16 sm:pt-20">
        <p className="text-xs uppercase tracking-widest text-cyan-300 sm:text-sm">
          Biz haqimizda
        </p>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
          Sayohat xotiralari uchun
          <br />
          <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
            sodda va chiroyli makon
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          Famous Places dunyoning mashhur joylarini kashf qilish va o'zingiz
          borgan yoki bormoqchi bo'lgan manzillarni bir joyda saqlash uchun
          yaratilgan.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/famousplaces"
            className="rounded-full bg-cyan-400 px-6 py-3 text-center font-semibold text-slate-900 transition hover:bg-cyan-300"
          >
            Joylarni ko'rish
          </Link>
          <Link
            to="/myplaces"
            className="rounded-full border border-white/25 px-6 py-3 text-center transition hover:bg-white/10"
          >
            Joy qo'shish
          </Link>
        </div>
      </section>

      <section className="grid gap-px overflow-hidden rounded-3xl border border-white/15 bg-white/15 sm:grid-cols-3">
        {[
          ["Reyting", "Har bir joyga baho"],
          ["Shaxsiy", "Faqat o'zingiz tahrirlaysiz"],
          ["Ochiq", "Mashhur joylar hamma uchun"],
        ].map(([title, text]) => (
          <div
            key={title}
            className="bg-slate-950/80 p-6 backdrop-blur-md sm:p-8"
          >
            <h3 className="text-lg font-bold sm:text-xl">{title}</h3>
            <p className="mt-2 text-sm text-white/60">{text}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-[1fr_2fr] sm:gap-8">
        <h2 className="text-xl font-bold sm:text-2xl">Nega yaratdik</h2>
        <p className="leading-relaxed text-white/70">
          Bu yerga o'zingizning hikoyangizni yozing: loyiha g'oyasi qayerdan
          kelgan, sizni nima ilhomlantirgan va kelajakda nimalarni
          qo'shmoqchisiz. Shaxsiy va aniq matn har qanday umumiy gapdan
          yaxshiroq.
        </p>
      </section>

      <section className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-white/60">Muallif: Abduvohid</p>
        <div className="flex gap-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-300 hover:underline"
            >
              {l.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
