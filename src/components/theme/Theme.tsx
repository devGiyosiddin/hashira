import "./theme.css";

import { useCallback, useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// FONT OPTIONS
// ─────────────────────────────────────────────────────────────────────────────
const FONT_OPTIONS = [
  { id: "syne",     label: "Syne",           stack: "'Syne', sans-serif",            sample: "Aa" },
  { id: "fraunces", label: "Fraunces",        stack: "'Fraunces', serif",             sample: "Aa" },
  { id: "dm",       label: "DM Sans",         stack: "'DM Sans', sans-serif",         sample: "Aa" },
  { id: "mono",     label: "JetBrains Mono",  stack: "'JetBrains Mono', monospace",   sample: "Aa" },
  { id: "share",    label: "Share Tech Mono", stack: "'Share Tech Mono', monospace",  sample: "Aa" },
  { id: "crimson",  label: "Crimson Pro",     stack: "'Crimson Pro', serif",          sample: "Aa" },
];

const RADIUS_OPTIONS = [
  { id: "none",    label: "None",    sm: "0px",  md: "0px",  lg: "0px",  full: "0px"   },
  { id: "sharp",   label: "Sharp",   sm: "2px",  md: "4px",  lg: "6px",  full: "6px"   },
  { id: "default", label: "Default", sm: "6px",  md: "10px", lg: "16px", full: "100px" },
  { id: "soft",    label: "Soft",    sm: "10px", md: "16px", lg: "24px", full: "100px" },
  { id: "round",   label: "Round",   sm: "16px", md: "24px", lg: "32px", full: "100px" },
];

const ACCENT_PRESETS = [
  "#e8ff47","#47ffe8","#ff47e8","#00d4ff","#ff6b35",
  "#e0457a","#00ff41","#ffd23f","#4361ee","#f72585",
  "#76ff03","#ff3366","#00b3ff","#ffaa00","#a78bfa",
];

// ─────────────────────────────────────────────────────────────────────────────
// PRESET THEMES
// ─────────────────────────────────────────────────────────────────────────────
const THEMES = {
  void: {
    id:"void", label:"VOID", emoji:"⚡", description:"Kislotali minimalizm", dark:true,
    accent:"#e8ff47", accent2:"#47ffe8", accent3:"#ff47e8",
    vars:{"--bg":"#0b0c10","--surface":"#13151c","--surface2":"#1c1f2b","--border":"#2a2d3a","--text":"#e8eaf2","--muted":"#6b6f85","--danger":"#ff4757","--success":"#47ff8a"},
  },
  sakura: {
    id:"sakura", label:"SAKURA", emoji:"🌸", description:"Yapon nozikligi", dark:false,
    accent:"#e0457a", accent2:"#9b59b6", accent3:"#f39c12",
    vars:{"--bg":"#fdf6f9","--surface":"#ffffff","--surface2":"#fde8f0","--border":"#f0d0de","--text":"#2d1b25","--muted":"#a07090","--danger":"#c0392b","--success":"#27ae60"},
  },
  abyss: {
    id:"abyss", label:"ABYSS", emoji:"🌊", description:"Neon to'q ko'k", dark:true,
    accent:"#00d4ff", accent2:"#0066ff", accent3:"#7c3aed",
    vars:{"--bg":"#030d1a","--surface":"#051428","--surface2":"#0a1f38","--border":"#0d3060","--text":"#cce8ff","--muted":"#4a7aa0","--danger":"#ff3366","--success":"#00ffaa"},
  },
  ember: {
    id:"ember", label:"EMBER", emoji:"🔥", description:"Issiq ko'mir va olov", dark:true,
    accent:"#ff6b35", accent2:"#ffd23f", accent3:"#ff3366",
    vars:{"--bg":"#0f0a06","--surface":"#1a1008","--surface2":"#261810","--border":"#3d2410","--text":"#f5e6d0","--muted":"#8a6040","--danger":"#ff1744","--success":"#76ff03"},
  },
  ghost: {
    id:"ghost", label:"GHOST", emoji:"👻", description:"Sovuq minimalizm", dark:false,
    accent:"#4361ee", accent2:"#f72585", accent3:"#4cc9f0",
    vars:{"--bg":"#f8f9fc","--surface":"#ffffff","--surface2":"#eef0f6","--border":"#d8dce8","--text":"#0d0e1a","--muted":"#7b80a0","--danger":"#e63946","--success":"#2dc653"},
  },
  matrix: {
    id:"matrix", label:"MATRIX", emoji:"💻", description:"Hacker terminal", dark:true,
    accent:"#00ff41", accent2:"#00b3ff", accent3:"#ff0040",
    vars:{"--bg":"#000300","--surface":"#020a02","--surface2":"#041204","--border":"#0a2e0a","--text":"#a0ffb0","--muted":"#2a6b2a","--danger":"#ff0040","--success":"#00ff41"},
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace("#","");
  return `${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)}`;
}
function buildShadows(accent) {
  const rgb = hexToRgb(accent);
  return {
    card:  `0 4px 24px rgba(${rgb}, 0.08)`,
    glow:  `0 0 24px rgba(${rgb}, 0.35)`,
    focus: `0 0 0 3px rgba(${rgb}, 0.20)`,
    hover: `0 8px 40px rgba(${rgb}, 0.18)`,
  };
}
function applyAll(themeId, accent, radiusId, fontId) {
  const t = THEMES[themeId]; if (!t) return;
  const a  = accent || t.accent;
  const r  = RADIUS_OPTIONS.find(x => x.id === radiusId) || RADIUS_OPTIONS[2];
  const f  = FONT_OPTIONS.find(x => x.id === fontId)   || FONT_OPTIONS[0];
  const sh = buildShadows(a);
  const root = document.documentElement;
  Object.entries(t.vars).forEach(([k,v]) => root.style.setProperty(k,v));
  root.style.setProperty("--accent",       a);
  root.style.setProperty("--accent2",      t.accent2);
  root.style.setProperty("--accent3",      t.accent3);
  root.style.setProperty("--font-head",    f.stack);
  root.style.setProperty("--font-mono",    "'JetBrains Mono', monospace");
  root.style.setProperty("--r-sm",         r.sm);
  root.style.setProperty("--r-md",         r.md);
  root.style.setProperty("--r-lg",         r.lg);
  root.style.setProperty("--r-full",       r.full);
  root.style.setProperty("--shadow-card",  sh.card);
  root.style.setProperty("--shadow-glow",  sh.glow);
  root.style.setProperty("--shadow-focus", sh.focus);
  root.style.setProperty("--shadow-hover", sh.hover);
  root.style.setProperty("--gradient",     `linear-gradient(135deg, ${a} 0%, ${t.accent2} 100%)`);
  document.documentElement.setAttribute("data-theme", t.dark ? "dark" : "light");
}
function loadConfig() { try { const r = localStorage.getItem("theme-studio"); return r ? JSON.parse(r) : null; } catch { return null; } }
function saveConfig(c) { try { localStorage.setItem("theme-studio", JSON.stringify(c)); } catch {} }

// ─────────────────────────────────────────────────────────────────────────────
// MINI PREVIEW CARD (renders with inline styles — no CSS vars)
// ─────────────────────────────────────────────────────────────────────────────
function MiniPrev({ t, accent }) {
  const v = t.vars;
  const a = accent || t.accent;
  return (
    <div className="ts-tc-prev" style={{ background: v["--bg"] }}>
      <div className="ts-tc-bar" style={{ background: v["--surface"] }}>
        <div className="ts-tc-dot" style={{ background: a }} />
        <div className="ts-tc-dot" style={{ background: t.accent2 }} />
        <div className="ts-tc-dot" style={{ background: t.accent3 }} />
      </div>
      <div className="ts-tc-line" style={{ background: v["--surface2"], width:"72%" }} />
      <div className="ts-tc-line" style={{ background: a, width:"45%", opacity:.95 }} />
      <div className="ts-tc-line" style={{ background: v["--surface2"], width:"88%" }} />
      <div className="ts-tc-glow" style={{ background: a }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDIO MODAL
// ─────────────────────────────────────────────────────────────────────────────
function Studio({ init, onApply, onClose }) {
  const [themeId,  setThemeId]  = useState(init.themeId  || "void");
  const [accent,   setAccent]   = useState(init.accent   || "");
  const [hexInput, setHexInput] = useState(init.accent   || "");
  const [radiusId, setRadiusId] = useState(init.radiusId || "default");
  const [fontId,   setFontId]   = useState(init.fontId   || "syne");
  const [tab,      setTab]      = useState("customize");
  const [copied,   setCopied]   = useState(null);
  const theme   = THEMES[themeId];
  const curAcc  = accent || theme.accent;
  const radius  = RADIUS_OPTIONS.find(r => r.id === radiusId) || RADIUS_OPTIONS[2];
  const font    = FONT_OPTIONS.find(f => f.id === fontId)   || FONT_OPTIONS[0];
  const shadows = buildShadows(curAcc);

  // Live preview while modal is open
  useEffect(() => { applyAll(themeId, accent, radiusId, fontId); }, [themeId, accent, radiusId, fontId]);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleHex = (val) => {
    setHexInput(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) setAccent(val);
  };

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1600);
  };

  // Build all vars
  const allVars = {
    ...theme.vars,
    "--accent":       curAcc,
    "--accent2":      theme.accent2,
    "--accent3":      theme.accent3,
    "--font-head":    font.stack,
    "--font-mono":    "'JetBrains Mono', monospace",
    "--r-sm":         radius.sm,
    "--r-md":         radius.md,
    "--r-lg":         radius.lg,
    "--r-full":       radius.full,
    "--shadow-card":  shadows.card,
    "--shadow-glow":  shadows.glow,
    "--shadow-focus": shadows.focus,
    "--shadow-hover": shadows.hover,
    "--gradient":     `linear-gradient(135deg, ${curAcc} 0%, ${theme.accent2} 100%)`,
  };

  const colorKeys   = ["--bg","--surface","--surface2","--border","--accent","--accent2","--accent3","--text","--muted","--danger","--success"];
  const cssOutput   = `:root {\n${Object.entries(allVars).map(([k,v])=>`  ${k}: ${v};`).join("\n")}\n}`;
  const jsonOutput  = JSON.stringify({ themeId, accent: curAcc, radiusId, fontId, vars: allVars }, null, 2);

  function badge(k) {
    if (colorKeys.includes(k)) return "rang";
    if (k.includes("font"))   return "shrift";
    if (k.includes("-r-"))    return "radius";
    if (k.includes("shadow")) return "soya";
    if (k.includes("gradient")) return "gradient";
    return "";
  }
  function isColorVal(v) { return /^#[0-9a-fA-F]{3,8}$/.test(v); }

  const TABS = [
    { id:"customize", icon:"✦", label:"SOZLASH"   },
    { id:"tokens",    icon:"◈", label:"TOKENLAR"  },
    { id:"inspector", icon:"⌖", label:"INSPEKTOR" },
    { id:"export",    icon:"↗", label:"EKSPORT"   },
  ];

  return (
    <div className="ts ts-ov" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ts-dlg">

        {/* Header */}
        <div className="ts-dh">
          <div>
            <h1>THEME <em>STUDIO</em></h1>
            <p>Mavzu tanlash · Rang, radius, shrift · Eksport</p>
          </div>
          <div className="ts-dh-sp" />
          <button className="ts-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="ts-body">

          {/* ── LEFT: theme cards ── */}
          <div className="ts-left">
            <div className="sl">MAVZU TANLASH</div>
            <div className="ts-tgrid">
              {Object.values(THEMES).map((t) => (
                <div
                  key={t.id}
                  className={`ts-tc ${themeId === t.id ? "sel" : ""}`}
                  onClick={() => { setThemeId(t.id); setAccent(""); setHexInput(""); }}
                >
                  {themeId === t.id && <div className="ts-tc-ck">✓</div>}
                  <MiniPrev t={t} accent={themeId === t.id ? curAcc : undefined} />
                  <div className="ts-tc-inf">
                    <div className="ts-tc-name"><span>{t.emoji}</span><span>{t.label}</span></div>
                    <div className="ts-tc-desc">{t.description}</div>
                    <div className="ts-tc-sw">
                      {[t.vars["--bg"], t.vars["--surface"], t.accent, t.accent2, t.accent3].map((c,i)=>(
                        <div key={i} className="ts-swatch" style={{ background:c }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: tabs ── */}
          <div className="ts-right">

            <div className="ts-tabs">
              {TABS.map(tb => (
                <button key={tb.id} className={`ts-tab ${tab===tb.id?"on":""}`} onClick={() => setTab(tb.id)}>
                  {tb.icon} {tb.label}
                </button>
              ))}
            </div>

            {/* ── CUSTOMIZE ── */}
            {tab === "customize" && (
              <div className="ts-pane">

                {/* Accent */}
                <div className="ts-f">
                  <div className="ts-fl">ASOSIY RANG <span>{curAcc}</span></div>
                  <div className="ts-aps">
                    {ACCENT_PRESETS.map(c => (
                      <div
                        key={c} className={`ts-ap ${curAcc===c?"sel":""}`}
                        style={{ background:c }}
                        onClick={() => { setAccent(c); setHexInput(c); }}
                        title={c}
                      />
                    ))}
                  </div>
                  <div className="ts-cr">
                    <input type="color" className="ts-ci" value={curAcc}
                      onChange={(e) => { setAccent(e.target.value); setHexInput(e.target.value); }} />
                    <input className="ts-ch" value={hexInput} maxLength={7}
                      onChange={(e) => handleHex(e.target.value)} placeholder="#e8ff47" />
                    <button className="ts-cpbtn" style={{ marginTop:0 }} onClick={() => copy(curAcc)}>
                      {copied===curAcc ? "✓" : "📋"}
                    </button>
                  </div>
                </div>

                <hr className="ts-div" />

                {/* Radius */}
                <div className="ts-f">
                  <div className="ts-fl">BORDER RADIUS <span>{radius.md}</span></div>
                  <div className="ts-rps">
                    {RADIUS_OPTIONS.map(r => (
                      <button key={r.id} className={`ts-rp ${radiusId===r.id?"sel":""}`} onClick={() => setRadiusId(r.id)}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                  <div className="ts-rprev">
                    {["sm","md","lg"].map(k => (
                      <div key={k} className="ts-rbox" style={{ borderRadius: radius[k] }}>
                        <span>{k}<br/>{radius[k]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="ts-div" />

                {/* Font */}
                <div className="ts-f">
                  <div className="ts-fl">SHRIFT</div>
                  <div className="ts-fonts">
                    {FONT_OPTIONS.map(f => (
                      <div key={f.id} className={`ts-fo ${fontId===f.id?"sel":""}`} onClick={() => setFontId(f.id)}>
                        <div className="ts-fo-sa" style={{ fontFamily: f.stack }}>{f.sample}</div>
                        <div>
                          <div style={{ fontFamily: f.stack, fontSize:13, fontWeight:600, color:"var(--text,#e8eaf2)" }}>{f.label}</div>
                          <div className="ts-fo-nm">{f.stack.split(",")[0].replace(/'/g,"")}</div>
                        </div>
                        {fontId===f.id && <span className="ts-fo-ck">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ── TOKENS ── */}
            {tab === "tokens" && (
              <div className="ts-pane">

                <div style={{ marginBottom:16 }}>
                  <div className="sl">🎨 RANG TOKENLARI</div>
                  <div className="ts-toks">
                    {colorKeys.map(k => (
                      <div key={k} className="ts-tok" onClick={() => copy(allVars[k])}>
                        <div className="ts-tok-dot" style={{ background: allVars[k] }} />
                        <span className="ts-tok-nm">{k}</span>
                        <span className={copied===allVars[k]?"ts-tok-ok":"ts-tok-vl"}>
                          {copied===allVars[k]?"✓ nusxalandi":allVars[k]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom:16 }}>
                  <div className="sl">🌑 SOYA TOKENLARI</div>
                  <div className="ts-shbs">
                    {Object.entries(shadows).map(([k,v]) => (
                      <div key={k} className="ts-shb" style={{ boxShadow:v }} onClick={() => copy(v)}>
                        <div className="ts-shb-nm">--shadow-{k}</div>
                        <div className="ts-shb-vl">{copied===v?"✓ nusxalandi":v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="sl">✍️ SHRIFT TOKENLARI</div>
                  <div className="ts-toks">
                    {[["--font-head", font.stack],["--font-mono","'JetBrains Mono', monospace"]].map(([k,v]) => (
                      <div key={k} className="ts-tok" onClick={() => copy(v)}>
                        <div className="ts-tok-dot" style={{ background:"var(--surface)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"var(--accent)", fontFamily:v, fontWeight:700 }}>Aa</div>
                        <span className="ts-tok-nm">{k}</span>
                        <span className={copied===v?"ts-tok-ok":"ts-tok-vl"} style={{ fontFamily:v, fontSize:10 }}>
                          {copied===v?"✓":v.split(",")[0].replace(/'/g,"")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ── INSPECTOR ── */}
            {tab === "inspector" && (
              <div className="ts-pane">
                <div className="sl" style={{ marginBottom:10 }}>
                  BARCHA O'ZGARUVCHILAR — {Object.keys(allVars).length} ta
                </div>
                <div className="ts-ins">
                  {Object.entries(allVars).map(([k,v]) => {
                    const isC = isColorVal(v);
                    const isG = v.startsWith("linear");
                    const b   = badge(k);
                    return (
                      <div key={k} className="ts-ins-r" onClick={() => copy(v)} title={`${k}: ${v}`}>
                        <div className="ts-ins-dot" style={{
                          background: isC ? v : isG ? v : "var(--surface2)",
                          border: isC||isG ? "none" : "2px solid var(--accent)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:9, color:"var(--accent)", fontFamily:"var(--font-mono)", fontWeight:700,
                        }}>
                          {!isC&&!isG&&(k.includes("font")?"Aa":k.includes("-r-")?"◻":k.includes("shadow")?"◐":"")}
                        </div>
                        <div className="ts-ins-info">
                          <div className="ts-ins-var">{k}</div>
                          <div className="ts-ins-val">{copied===v?"✓ nusxalandi":v.length>38?v.slice(0,38)+"…":v}</div>
                        </div>
                        {b && <span className="ts-ins-bdg">{b}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── EXPORT ── */}
            {tab === "export" && (
              <div className="ts-pane ts-exp">

                <div className="ts-exp-sec">
                  <div className="ts-exp-lbl">CSS Variables (:root)</div>
                  <pre>{cssOutput}</pre>
                  <button className="ts-cpbtn" onClick={() => copy(cssOutput)}>
                    {copied===cssOutput ? "✓ Nusxalandi!" : "📋 CSS nusxalash"}
                  </button>
                </div>

                <div className="ts-exp-sec">
                  <div className="ts-exp-lbl">JSON Config</div>
                  <pre className="json">{jsonOutput}</pre>
                  <button className="ts-cpbtn" onClick={() => copy(jsonOutput)}>
                    {copied===jsonOutput ? "✓ Nusxalandi!" : "📋 JSON nusxalash"}
                  </button>
                </div>

                <div className="ts-exp-sec">
                  <div className="ts-exp-lbl">LocalStorage kalit</div>
                  <pre style={{ color:"var(--accent2,#47ffe8)" }}>{"\"theme-studio\""}</pre>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"var(--muted,#6b6f85)", marginTop:6 }}>
                    Sozlamalar avtomatik saqlanadi va qayta yuklanganda tiklanadi.
                  </div>
                </div>

              </div>
            )}

          </div>{/* end ts-right */}
        </div>{/* end ts-body */}

        {/* Footer */}
        <div className="ts-foot">
          <div className="ts-foot-info">
            {theme.emoji} <b>{theme.label}</b> · <b>{curAcc}</b> · <b>{radius.label}</b> · <b>{font.label}</b>
          </div>
          <button className="ts-cancel" onClick={onClose}>Bekor qilish</button>
          <button className="ts-apply" onClick={() => {
            onApply({ themeId, accent: curAcc, radiusId, fontId });
            onClose();
          }}>✓ Qo'llash</button>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN — замена твоего Theme.jsx
// ─────────────────────────────────────────────────────────────────────────────
const Theme = () => {
  const [open,   setOpen]   = useState(false);
  const [config, setConfig] = useState({ themeId:"void", accent:"", radiusId:"default", fontId:"syne" });

  // Mount: load from localStorage
  useEffect(() => {
    const saved = loadConfig();
    if (saved) {
      setConfig(saved);
      applyAll(saved.themeId, saved.accent, saved.radiusId, saved.fontId);
    } else {
      applyAll("void", "", "default", "syne");
    }
    // System theme listener
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const h = () => { const c = loadConfig(); if (!c) applyAll("void","","default","syne"); };
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const handleApply = useCallback((newConfig) => {
    setConfig(newConfig);
    applyAll(newConfig.themeId, newConfig.accent, newConfig.radiusId, newConfig.fontId);
    saveConfig(newConfig);
  }, []);

  const cur      = THEMES[config.themeId] || THEMES.void;
  const dotColor = config.accent || cur.accent;

  return (
    <>

      <div className="ts" style={{ padding:"16px" }}>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, color:"var(--muted,#6b6f85)", letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:9 }}>
          Sayt mavzusi
        </h3>
        <button className="ts-btn" onClick={() => setOpen(true)}>
          <div className="ts-btn-dot" style={{ background: dotColor }} />
          <span className="ts-btn-label">{cur.emoji} {cur.label}</span>
          <span className={`ts-btn-arr ${open?"open":""}`}>▼</span>
        </button>
      </div>

      {open && (
        <Studio
          init={config}
          onApply={handleApply}
          onClose={() => {
            // revert live preview to last saved config if user cancels
            applyAll(config.themeId, config.accent, config.radiusId, config.fontId);
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Theme;