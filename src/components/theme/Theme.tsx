import { useEffect, useState } from "react";
// import "./theme.css";

const Theme = () => {
  const [theme, setTheme] = useState("default");

  // Вызывается один раз при монтировании компонента
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme) {
      if (savedTheme === "default") {
        // Если сохранённая тема "default", используем системные настройки
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme("default");
        document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
      } else {
        // Если сохранённая тема конкретная
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    } else {
      // Если нет сохранённой темы, используем системные настройки
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme("default");
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
  }, []);

  // Обновляем атрибут при изменении theme
  useEffect(() => {
    if (theme === "default") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  // Слушатель изменений системной темы
  useEffect(() => {
    if (theme === "default") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const themes = [
    { value: "default", label: "Odatiy"},
    { value: "light", label: "Yorug'"},
    { value: "dark", label: "Qora"},
    { value: "blue", label: "Ko'k"},
    { value: "green", label: "Yashil"},
    { value: "purple", label: "Binafsha"},
  ];

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold mb-3">
        Sayt mavzusi
      </h3>
      
      {/* Вариант 1: Dropdown */}
      <select
        value={theme}
        onChange={(e) => {
          const selectedTheme = e.target.value;
          setTheme(selectedTheme);
          localStorage.setItem("theme", selectedTheme);
        }}
        className="w-full px-3 py-2 text-sm rounded-lg bg-transparent"
        style={{
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-color)'
        }}
      >
        {themes.map((t) => (
          <option
            className="py-2 bg-transparent"
            key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      {/* Вариант 2: Сетка кнопок (раскомментируйте для использования) */}
      {/*
      <div className="grid grid-cols-2 gap-2 mt-3">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setTheme(t.value);
              localStorage.setItem("theme", t.value);
            }}
            className={`p-2 text-xs rounded-lg border transition-all ${
              theme === t.value ? 'ring-2' : ''
            }`}
            style={{
              backgroundColor: theme === t.value ? 'var(--text-accent)' : 'var(--bg-secondary)',
              color: theme === t.value ? 'var(--bg-primary)' : 'var(--text-primary)',
              borderColor: 'var(--border-color)',
              ringColor: 'var(--text-accent)'
            }}
          >
            <div className="flex items-center justify-center gap-1">
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </div>
          </button>
        ))}
      </div>
      */}
    </div>
  );
};

export default Theme;