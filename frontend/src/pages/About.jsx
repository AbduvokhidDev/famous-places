import { Link } from "react-router-dom";

const links = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "Telegram", href: "https://t.me/" },
];

function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-24 text-white">
      <section className="pt-20 pb-16">
        <p className="text-cyan-300 text-sm tracking-widest uppercase">
          Biz haqimizda
        </p>
        <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight">
          Sayohat xotiralari uchun
          <br />
          <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
            sodda va chiroyli makon
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/70 leading-relaxed">
          Famous Places dunyoning mashhur joylarini kashf qilish va o'zingiz
          borgan yoki bormoqchi bo'lgan manzillarni bir joyda saqlash uchun
          yaratilgan.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            to="/famousplaces"
            className="px-6 py-3 rounded-full font-semibold bg-cyan-400 text-slate-900 hover:bg-cyan-300 transition"
          >
            Joylarni ko'rish
          </Link>
          <Link
            to="/myplaces"
            className="px-6 py-3 rounded-full border border-white/25 hover:bg-white/10 transition"
          >
            Joy qo'shish
          </Link>
        </div>
      </section>

      <section className="grid gap-px sm:grid-cols-3 rounded-3xl overflow-hidden bg-white/15 border border-white/15">
        {[
          ["Reyting", "Har bir joyga baho"],
          ["Shaxsiy", "Faqat o'zingiz tahrirlaysiz"],
          ["Ochiq", "Mashhur joylar hamma uchun"],
        ].map(([title, text]) => (
          <div key={title} className="bg-slate-950/80 backdrop-blur-md p-8">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="mt-2 text-sm text-white/60">{text}</p>
          </div>
        ))}
      </section>

      <section className="mt-20 grid gap-8 sm:grid-cols-[1fr_2fr]">
        <h2 className="text-2xl font-bold">Nega yaratdik</h2>
        <p className="text-white/70 leading-relaxed">
          Bu yerga o'zingizning hikoyangizni yozing: loyiha g'oyasi qayerdan
          kelgan, sizni nima ilhomlantirgan va kelajakda nimalarni
          qo'shmoqchisiz. Shaxsiy va aniq matn har qanday umumiy gapdan
          yaxshiroq.
        </p>
      </section>

      <section className="mt-16 pt-8 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
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
