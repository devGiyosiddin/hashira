import { useEffect, useState } from "react";

// ─── Palette & base styles injected via a <style> tag ───────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0b0c10;
    --surface:   #13151c;
    --surface2:  #1c1f2b;
    --border:    #2a2d3a;
    --accent:    #e8ff47;
    --accent2:   #47ffe8;
    --text:      #e8eaf2;
    --muted:     #6b6f85;
    --danger:    #ff4757;
    --radius:    10px;
    --font-head: 'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  .ap-root {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-head);
    min-height: 100vh;
    padding: 0 0 80px;
  }

  /* ── Header ── */
  .ap-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 20px 40px;
    display: flex;
    align-items: center;
    gap: 16px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .ap-header h1 {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--accent);
  }
  .ap-badge {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 100px;
  }
  .ap-header-actions { margin-left: auto; display: flex; gap: 10px; }

  /* ── Layout ── */
  .ap-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 0;
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px 40px;
    gap: 32px;
  }

  /* ── Sidebar nav ── */
  .ap-nav {
    position: sticky;
    top: 80px;
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .ap-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 14px;
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    border: none;
    background: transparent;
    text-align: left;
    transition: all 0.15s;
    font-family: var(--font-head);
  }
  .ap-nav-item:hover { background: var(--surface2); color: var(--text); }
  .ap-nav-item.active { background: var(--surface2); color: var(--accent); border-left: 2px solid var(--accent); }
  .ap-nav-item .icon { font-size: 15px; width: 18px; text-align: center; }

  /* ── Form area ── */
  .ap-form { display: flex; flex-direction: column; gap: 28px; }

  /* ── Section ── */
  .ap-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
  }
  .ap-section-header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ap-section-header h2 {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.3px;
  }
  .ap-section-icon { font-size: 16px; }
  .ap-section-body { padding: 24px; }

  /* ── Grid helpers ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .col-span-2 { grid-column: span 2; }

  /* ── Field ── */
  .ap-field { display: flex; flex-direction: column; gap: 7px; }
  .ap-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--muted);
  }
  .ap-input, .ap-select, .ap-textarea {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 13px;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
  }
  .ap-input:focus, .ap-select:focus, .ap-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(232,255,71,0.08);
  }
  .ap-input[readonly] { color: var(--muted); cursor: not-allowed; }
  .ap-textarea { resize: vertical; min-height: 90px; }
  .ap-select option { background: var(--surface2); }

  /* ── Radio group ── */
  .ap-radio-group { display: flex; gap: 12px; flex-wrap: wrap; }
  .ap-radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.15s;
  }
  .ap-radio-label:has(input:checked) {
    border-color: var(--accent);
    background: rgba(232,255,71,0.07);
    color: var(--accent);
  }
  .ap-radio-label input { accent-color: var(--accent); }

  /* ── Checkbox ── */
  .ap-checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: all 0.15s;
    user-select: none;
  }
  .ap-checkbox-label:has(input:checked) {
    border-color: var(--accent2);
    background: rgba(71,255,232,0.07);
    color: var(--accent2);
  }
  .ap-checkbox-label input { accent-color: var(--accent2); width: 16px; height: 16px; }

  /* ── Image preview ── */
  .ap-preview {
    margin-top: 10px;
    border-radius: var(--radius);
    overflow: hidden;
    border: 1px solid var(--border);
    background: var(--surface2);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160px;
  }
  .ap-preview img { width: 100%; height: 100%; object-fit: cover; }
  .ap-preview-empty {
    color: var(--muted);
    font-size: 12px;
    font-family: var(--font-mono);
  }

  /* ── Dynamic list ── */
  .ap-dynamic-list { display: flex; flex-direction: column; gap: 10px; }
  .ap-dynamic-row {
    display: flex;
    gap: 10px;
    align-items: center;
    animation: slideIn 0.2s ease;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ap-dynamic-row .ap-input { flex: 1; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border-radius: var(--radius);
    font-family: var(--font-head);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
    letter-spacing: 0.3px;
  }
  .btn-accent {
    background: var(--accent);
    color: #0b0c10;
  }
  .btn-accent:hover { background: #d4ea3a; transform: translateY(-1px); }
  .btn-ghost {
    background: var(--surface2);
    color: var(--text);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger {
    background: transparent;
    color: var(--danger);
    border: 1px solid transparent;
    padding: 8px;
    border-radius: 8px;
  }
  .btn-danger:hover { background: rgba(255,71,87,0.12); border-color: var(--danger); }
  .btn-add {
    background: transparent;
    color: var(--accent2);
    border: 1px dashed var(--accent2);
    font-size: 12px;
    padding: 8px 16px;
  }
  .btn-add:hover { background: rgba(71,255,232,0.07); }
  .btn-sm { padding: 7px 14px; font-size: 12px; }

  /* ── Tags input helper ── */
  .ap-hint {
    font-size: 11px;
    color: var(--muted);
    font-family: var(--font-mono);
    margin-top: 4px;
  }

  /* ── Stats row ── */
  .ap-stats-row { display: flex; gap: 0; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .ap-stat-item {
    flex: 1;
    padding: 16px;
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ap-stat-item:last-child { border-right: none; }
  .ap-stat-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }

  /* ── Divider ── */
  .ap-divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }

  /* ── Scroll to section ── */
  .section-anchor { scroll-margin-top: 100px; }
`;

// ─── tiny helpers ─────────────────────────────────────────────────────────────
const Field = ({ label, children, className = "" }) => (
  <div className={`ap-field ${className}`}>
    {label && <label className="ap-label">{label}</label>}
    {children}
  </div>
);

const Input = (props) => <input className="ap-input" {...props} />;
const Select = ({ children, ...props }) => (
  <select className="ap-select" {...props}>{children}</select>
);
const Textarea = (props) => <textarea className="ap-textarea" {...props} />;

const Section = ({ id, icon, title, children }) => (
  <div className="ap-section section-anchor" id={id}>
    <div className="ap-section-header">
      <span className="ap-section-icon">{icon}</span>
      <h2>{title}</h2>
    </div>
    <div className="ap-section-body">{children}</div>
  </div>
);

const ImagePreview = ({ url, height = 160 }) => (
  <div className="ap-preview" style={{ height }}>
    {url
      ? <img src={url} alt="preview" onError={(e) => e.target.style.display = "none"} />
      : <span className="ap-preview-empty">No image</span>
    }
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function AnimeAdminPanel() {
  const now = new Date().toISOString().slice(0, 16);

  const [form, setForm] = useState({
    id: "",
    title_original: "",
    title_english: "",
    yaponcha_nomi: "",
    slug: "",
    type: "TV",
    status: "ongoing",
    year: new Date().getFullYear(),
    season: "spring",
    episodes: "",
    duration: "24 мин.",
    format: "serie",
    yosh_chegarasi: "0",
    short_synopsis: "",
    synopsis: "",
    genres: "",
    studios: "",
    score: "",
    rank: "",
    popularity: "",
    banner_url: "",
    poster_url: "",
    trailer_url: "",
    views_count: "",
    comments_count: "",
    is_featured: false,
    is_published: false,
    aired_from: "",
    aired_to: "",
    created_at: now,
    updated_at: now,
  });

  const [relatedAnime, setRelatedAnime] = useState([{ title: "", slug: "" }]);
  const [translations, setTranslations] = useState([{ code: "", title: "" }]);
  const [activeSection, setActiveSection] = useState("info");

  const set = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val, updated_at: new Date().toISOString().slice(0, 16) }));
  };

  // auto-generate slug from original title
  useEffect(() => {
    if (form.title_original) {
      const slug = form.title_original
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setForm((f) => ({ ...f, slug }));
    }
  }, [form.title_original]);

  const addRelated = () => setRelatedAnime((r) => [...r, { title: "", slug: "" }]);
  const removeRelated = (i) => setRelatedAnime((r) => r.filter((_, idx) => idx !== i));
  const setRelated = (i, key) => (e) =>
    setRelatedAnime((r) => r.map((item, idx) => idx === i ? { ...item, [key]: e.target.value } : item));

  const addTranslation = () => setTranslations((t) => [...t, { code: "", title: "" }]);
  const removeTranslation = (i) => setTranslations((t) => t.filter((_, idx) => idx !== i));
  const setTranslation = (i, key) => (e) =>
    setTranslations((t) => t.map((item, idx) => idx === i ? { ...item, [key]: e.target.value } : item));

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, relatedAnime, translations };
    console.log("SUBMIT →", payload);
    alert("Данные готовы. Смотри console.log.");
  };

  const NAV = [
    { id: "info",        icon: "🎬", label: "Основное"    },
    { id: "synopsis",    icon: "📖", label: "Синопсис"    },
    { id: "genres",      icon: "💮", label: "Жанры"       },
    { id: "ratings",     icon: "📊", label: "Рейтинги"    },
    { id: "dates",       icon: "🕰️", label: "Даты"        },
    { id: "media",       icon: "🖼️", label: "Медиа"       },
    { id: "stats",       icon: "🌐", label: "Статистика"  },
    { id: "meta",        icon: "🧩", label: "Мета"        },
    { id: "related",     icon: "🧭", label: "Связанные"   },
    { id: "translations",icon: "🌍", label: "Переводы"    },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="ap-root">

        {/* Header */}
        <div className="ap-header">
          <h1>ANIME ADMIN</h1>
          <span className="ap-badge">PANEL v1.0</span>
          <div className="ap-header-actions">
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => window.location.reload()}>
              ↺ Сбросить
            </button>
            <button className="btn btn-accent btn-sm" type="button" onClick={handleSubmit}>
              ✓ Сохранить
            </button>
          </div>
        </div>

        <div className="ap-layout">

          {/* Sidebar */}
          <nav className="ap-nav">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`ap-nav-item ${activeSection === n.id ? "active" : ""}`}
                onClick={() => scrollTo(n.id)}
                type="button"
              >
                <span className="icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>

          {/* Form */}
          <form className="ap-form" onSubmit={handleSubmit}>

            {/* ── ОСНОВНАЯ ИНФОРМАЦИЯ ── */}
            <Section id="info" icon="🎬" title="Основная информация">
              <div className="grid-2">
                <Field label="ID (readonly)">
                  <Input type="number" value={form.id} readOnly placeholder="Авто" />
                </Field>
                <Field label="Slug">
                  <Input type="text" value={form.slug} onChange={set("slug")} placeholder="auto-generated" />
                </Field>

                <Field label="Оригинальное название">
                  <Input type="text" value={form.title_original} onChange={set("title_original")} required placeholder="Shingeki no Kyojin" />
                </Field>
                <Field label="Английское название">
                  <Input type="text" value={form.title_english} onChange={set("title_english")} placeholder="Attack on Titan" />
                </Field>

                <Field label="Японское название (yaponcha_nomi)">
                  <Input type="text" value={form.yaponcha_nomi} onChange={set("yaponcha_nomi")} placeholder="進撃の巨人" />
                </Field>
                <Field label="Год выпуска">
                  <Input type="number" value={form.year} onChange={set("year")} min="1950" max="2100" />
                </Field>

                <Field label="Тип">
                  <Select value={form.type} onChange={set("type")}>
                    {["TV","Movie","OVA","ONA","Special"].map(v => <option key={v}>{v}</option>)}
                  </Select>
                </Field>
                <Field label="Статус">
                  <Select value={form.status} onChange={set("status")}>
                    <option value="ongoing">Ongoing</option>
                    <option value="finished">Finished</option>
                    <option value="upcoming">Upcoming</option>
                  </Select>
                </Field>

                <Field label="Сезон">
                  <Select value={form.season} onChange={set("season")}>
                    {["winter","spring","summer","fall"].map(v => <option key={v}>{v}</option>)}
                  </Select>
                </Field>
                <Field label="Эпизодов">
                  <Input type="number" value={form.episodes} onChange={set("episodes")} min="0" placeholder="12" />
                </Field>

                <Field label="Длительность серии">
                  <Input type="text" value={form.duration} onChange={set("duration")} placeholder="24 мин." />
                </Field>
                <Field label="Возрастной рейтинг">
                  <Select value={form.yosh_chegarasi} onChange={set("yosh_chegarasi")}>
                    {["0","12","16","18"].map(v => <option key={v} value={v}>{v}+</option>)}
                  </Select>
                </Field>

                <Field label="Формат (movie / serie)" className="col-span-2">
                  <div className="ap-radio-group">
                    {["movie","serie"].map(v => (
                      <label key={v} className="ap-radio-label">
                        <input type="radio" name="format" value={v} checked={form.format === v} onChange={set("format")} />
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
            </Section>

            {/* ── СИНОПСИС ── */}
            <Section id="synopsis" icon="📖" title="Синопсис">
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Field label="Краткий синопсис (short_synopsis)">
                  <Textarea
                    rows={3}
                    value={form.short_synopsis}
                    onChange={set("short_synopsis")}
                    placeholder="Короткое описание для превью..."
                  />
                </Field>
                <Field label="Полный сюжет (synopsis)">
                  <Textarea
                    rows={8}
                    value={form.synopsis}
                    onChange={set("synopsis")}
                    placeholder="Полное описание аниме..."
                  />
                </Field>
              </div>
            </Section>

            {/* ── ЖАНРЫ И СТУДИИ ── */}
            <Section id="genres" icon="💮" title="Жанры и Студии">
              <div className="grid-2">
                <Field label="Жанры">
                  <Input type="text" value={form.genres} onChange={set("genres")} placeholder="Action, Drama, Romance" />
                  <span className="ap-hint">через запятую</span>
                </Field>
                <Field label="Студии">
                  <Input type="text" value={form.studios} onChange={set("studios")} placeholder="MAPPA, Bones" />
                  <span className="ap-hint">через запятую</span>
                </Field>
              </div>
            </Section>

            {/* ── РЕЙТИНГИ ── */}
            <Section id="ratings" icon="📊" title="Рейтинги">
              <div className="grid-3">
                <Field label="⭐ Оценка (score)">
                  <Input type="number" step="0.01" min="0" max="10" value={form.score} onChange={set("score")} placeholder="8.54" />
                </Field>
                <Field label="🏅 Ранг (rank)">
                  <Input type="number" min="1" value={form.rank} onChange={set("rank")} placeholder="1" />
                </Field>
                <Field label="🔥 Популярность (popularity)">
                  <Input type="number" min="0" value={form.popularity} onChange={set("popularity")} placeholder="1" />
                </Field>
              </div>
            </Section>

            {/* ── ДАТЫ ── */}
            <Section id="dates" icon="🕰️" title="Даты">
              <div className="grid-2">
                <Field label="Начало показа (chiqqan / aired_from)">
                  <Input type="date" value={form.aired_from} onChange={set("aired_from")} />
                </Field>
                <Field label="Конец показа (tugagan / aired_to)">
                  <Input type="date" value={form.aired_to} onChange={set("aired_to")} />
                </Field>
                <Field label="Создано (created_at)">
                  <Input type="datetime-local" value={form.created_at} readOnly />
                </Field>
                <Field label="Обновлено (updated_at)">
                  <Input type="datetime-local" value={form.updated_at} readOnly />
                </Field>
              </div>
            </Section>

            {/* ── МЕДИА ── */}
            <Section id="media" icon="🖼️" title="Медиа">
              <div className="grid-2">
                <Field label="Баннер URL">
                  <Input type="url" value={form.banner_url} onChange={set("banner_url")} placeholder="https://..." />
                  <ImagePreview url={form.banner_url} height={140} />
                </Field>
                <Field label="Постер URL">
                  <Input type="url" value={form.poster_url} onChange={set("poster_url")} placeholder="https://..." />
                  <ImagePreview url={form.poster_url} height={140} />
                </Field>
                <Field label="Трейлер URL" className="col-span-2">
                  <Input type="url" value={form.trailer_url} onChange={set("trailer_url")} placeholder="https://youtube.com/watch?v=..." />
                </Field>
              </div>
            </Section>

            {/* ── СТАТИСТИКА ── */}
            <Section id="stats" icon="🌐" title="Статистика">
              <div className="ap-stats-row">
                <div className="ap-stat-item">
                  <span className="ap-stat-label">👁️ Просмотров</span>
                  <Input type="number" min="0" value={form.views_count} onChange={set("views_count")} placeholder="0" style={{ border: "none", padding: "4px 0", background: "transparent" }} />
                </div>
                <div className="ap-stat-item">
                  <span className="ap-stat-label">💬 Комментариев</span>
                  <Input type="number" min="0" value={form.comments_count} onChange={set("comments_count")} placeholder="0" style={{ border: "none", padding: "4px 0", background: "transparent" }} />
                </div>
              </div>
            </Section>

            {/* ── МЕТА ── */}
            <Section id="meta" icon="🧩" title="Публикация и Мета">
              <div className="ap-radio-group">
                <label className="ap-checkbox-label">
                  <input type="checkbox" checked={form.is_featured} onChange={set("is_featured")} />
                  🧷 Избранное
                </label>
                <label className="ap-checkbox-label">
                  <input type="checkbox" checked={form.is_published} onChange={set("is_published")} />
                  🚩 Опубликовано
                </label>
              </div>
            </Section>

            {/* ── СВЯЗАННЫЕ ТАЙТЛЫ ── */}
            <Section id="related" icon="🧭" title="Связанные тайтлы">
              <div className="ap-dynamic-list">
                {relatedAnime.map((item, i) => (
                  <div key={i} className="ap-dynamic-row">
                    <Input
                      type="text"
                      value={item.title}
                      onChange={setRelated(i, "title")}
                      placeholder="Название"
                    />
                    <Input
                      type="text"
                      value={item.slug}
                      onChange={setRelated(i, "slug")}
                      placeholder="slug"
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeRelated(i)}
                      disabled={relatedAnime.length === 1}
                    >✕</button>
                  </div>
                ))}
              </div>
              <br />
              <button type="button" className="btn btn-add" onClick={addRelated}>
                + Добавить тайтл
              </button>
            </Section>

            {/* ── ПЕРЕВОДЫ ── */}
            <Section id="translations" icon="🌍" title="Переводы">
              <div className="ap-dynamic-list">
                {translations.map((item, i) => (
                  <div key={i} className="ap-dynamic-row">
                    <Input
                      type="text"
                      value={item.code}
                      onChange={setTranslation(i, "code")}
                      placeholder="Код (ru, en, uz...)"
                      style={{ maxWidth: 140 }}
                    />
                    <Input
                      type="text"
                      value={item.title}
                      onChange={setTranslation(i, "title")}
                      placeholder="Название на этом языке"
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeTranslation(i)}
                      disabled={translations.length === 1}
                    >✕</button>
                  </div>
                ))}
              </div>
              <br />
              <button type="button" className="btn btn-add" onClick={addTranslation}>
                + Добавить перевод
              </button>
            </Section>

            {/* ── Submit ── */}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-ghost" onClick={() => window.location.reload()}>
                ↺ Сбросить форму
              </button>
              <button type="submit" className="btn btn-accent">
                ✓ Сохранить аниме
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}