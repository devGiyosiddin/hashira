import { useEffect, useState } from "react";

const Theme = () => {
  const [theme, setTheme] = useState("default");

  // Вызывается один раз при монтировании компонента
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme) {
      // Agar saqlangan mavzu mavjud bo'lsa
      if (savedTheme === "default") {
        // Agar mavzu "default", tizim sozlamalarini tekshiramiz 
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        if (prefersDark) {
          setTheme("default");
          document.documentElement.setAttribute("data-theme", "dark");
        } else {
          setTheme("default");
          document.documentElement.setAttribute("data-theme", "light");
        }
      } else {
        // Если сохранённая тема "dark" или "light"
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    } else {
      // Если нет сохранённой темы, используем системные настройки
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      setTheme("default");
      if (prefersDark) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
  }, []);

  // Обновляем атрибут при изменении theme
  useEffect(() => {
    if (theme === "default") {
      // При выборе "default" определяем тему по системным настройкам
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      // При выборе конкретной темы используем её
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const themes = [
    { value: "default", label: "По умолчанию" },
    { value: "dark", label: "Темная" },
    { value: "light", label: "Светлая" },
  ];

  return (
    <div className="px-4 py-4 border-t border-zinc-700/50">
      <h3 className="text-zinc-400 text-sm font-semibold mb-3">Тема сайта</h3>
      <select
        value={theme}
        onChange={(e) => {
          const selectedTheme = e.target.value;
          setTheme(selectedTheme);
          localStorage.setItem("theme", selectedTheme);
        }}
        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm"
      >
        {themes.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Theme;