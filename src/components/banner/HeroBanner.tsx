import './heroBanner.css';

import React, { useEffect } from 'react';

import { useNavigate } from "react-router-dom";

const testEditVideos = [
  "/test/aot.mp4",
  "/test/jjk.mp4",
  "/test/test.mp4",
  "/test/vinland_saga.mp4",
  "/test/naruto.mp4",
  "/test/rezero.mp4",
  "/test/rezero2.mp4",
  "/test/tg.mp4",
  "/test/tm.mp4",
  "/test/tm2.mp4",
];

const bannerAnime = {
  mal_id: 40748,
  title: "Jujutsu Kaisen",
  title_english: "Jujutsu Kaisen",
  images: {
    jpg: {
      image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
      large_image_url: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg"
    }
  },
  score: 8.8,
  synopsis: "Lanatlangan olam, Jujutsu Kaisen, birinchi kurs talabasi Yuji Itadori o'zining kuchli ruhiy qobiliyatlari bilan tanilgan. U o'z do'stlarini himoya qilish uchun kuchli ruhlarni yengishga tayyor.",
};

export const HeroBanner = () => {
  const navigate = useNavigate();

  const [muted, setMuted] = React.useState(true);
  const [volume, setVolume] = React.useState(0.5);
  const [volumeVisible, setVolumeVisible] = React.useState(false);
  const [prevFlash, setPrevFlash] = React.useState(false);
  const [nextFlash, setNextFlash] = React.useState(false);
  const [currentVideo, setCurrentVideo] = React.useState(0);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const volumeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  // Хранит громкость выбранную юзером — чтобы знать до какого значения возвращать
  const targetVolumeRef = React.useRef(0.5);
  // Хранит id текущей анимации fade чтобы отменять предыдущую
  const fadeAnimRef = React.useRef<number>(0);

  // ── Плавное изменение громкости через requestAnimationFrame ──
  const fadeVolume = React.useCallback((targetVol: number) => {
    cancelAnimationFrame(fadeAnimRef.current);

    const video = videoRef.current;
    if (!video) return;

    // Если нарастаем — снимаем мут и возобновляем воспроизведение
    if (targetVol > 0 && video.paused) {
      video.muted = false;
      video.play().catch(() => {});
    }

    const step = () => {
      const vid = videoRef.current;
      if (!vid) return;

      const current = vid.volume;
      const diff = targetVol - current;

      // Разница меньше порога — завершаем
      if (Math.abs(diff) < 0.008) {
        vid.volume = targetVol;
        if (targetVol === 0) vid.pause();
        return;
      }

      // Экспоненциальное затухание — плавно и приятно на слух
      vid.volume = Math.min(1, Math.max(0, current + diff * 0.08));
      fadeAnimRef.current = requestAnimationFrame(step);
    };

    fadeAnimRef.current = requestAnimationFrame(step);
  }, []);

  // ── IntersectionObserver: плавный fade при скролле ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;

        if (entry.isIntersecting) {
          // Баннер появился — нарастаем до громкости юзера (если не замьючен)
          if (!muted) {
            videoRef.current.muted = false;
            fadeVolume(targetVolumeRef.current);
          }
        } else {
          // Баннер ушёл — плавно затухаем до 0
          fadeVolume(0);
        }
      },
      { threshold: [0, 0.3] }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(fadeAnimRef.current);
    };
  }, [muted, fadeVolume]);

  // ── При смене видео — перезагружаем и запускаем ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [currentVideo]);

  // ── Переключение мута ──
  const toggleMute = () => {
    setMuted(prev => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
        if (!next) fadeVolume(targetVolumeRef.current);
      }
      return next;
    });
  };

  // ── Ползунок громкости ──
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    targetVolumeRef.current = newVolume; // сохраняем выбор юзера
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      const shouldMute = newVolume === 0;
      setMuted(shouldMute);
      videoRef.current.muted = shouldMute;
    }
  };

  // ── Показ/скрытие ползунка ──
  const showVolume = () => {
    if (volumeTimerRef.current) clearTimeout(volumeTimerRef.current);
    setVolumeVisible(true);
  };
  const hideVolume = () => {
    volumeTimerRef.current = setTimeout(() => setVolumeVisible(false), 400);
  };

  // ── Стрелки карусели ──
  const handlePrev = () => {
    setPrevFlash(true);
    setTimeout(() => setPrevFlash(false), 450);
    setCurrentVideo(prev => (prev === 0 ? testEditVideos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setNextFlash(true);
    setTimeout(() => setNextFlash(false), 450);
    setCurrentVideo(prev => (prev + 1) % testEditVideos.length);
  };

  const volumeIcon = muted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊';

  return (
    <>
      <style>{`
        .volume-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 3px;
          border-radius: 999px;
          cursor: pointer;
          outline: none;
          background: transparent;
        }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 4px rgba(0,0,0,0.4);
          transition: transform 0.15s;
        }
        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        @keyframes arrowFlash {
          0%   { text-shadow: none; color: rgba(255,255,255,0.55); }
          20%  {
            color: #fff;
            text-shadow:
              0 0 8px  rgba(255,255,255,1),
              0 0 22px rgba(255,255,255,0.80),
              0 0 50px rgba(255,255,255,0.45),
              0 0 90px rgba(255,255,255,0.20);
          }
          100% { text-shadow: none; color: rgba(255,255,255,0.55); }
        }
        .arrow-flash {
          animation: arrowFlash 0.45s ease-out forwards;
        }
      `}</style>

      <div
        ref={sectionRef}
        className="relative grid grid-cols-1 auto-rows-fr min-h-48 sm:min-h-56 md:min-h-64 lg:min-h-72 xl:min-h-80 2xl:min-h-96 max-h-48 sm:max-h-56 md:max-h-64 lg:max-h-72 xl:max-h-80 2xl:max-h-96 rounded-xl sm:rounded-(--r-lg) lg:rounded-3xl overflow-hidden mb-6 sm:mb-8 md:mb-10 lg:mb-12"
      >

        {/* ── Видео фон ── */}
        <div className="absolute inset-0 z-(--z-base)">
          <video
            ref={videoRef}
            src={testEditVideos[currentVideo]}
            autoPlay
            muted={muted}
            loop
            playsInline
            className="w-full h-full object-cover transform scale-100 sm:scale-105 lg:scale-110 transition-transform duration-500"
          />
          {/* <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/50 to-black/20 sm:from-black/80 sm:via-black/40 sm:to-transparent" /> */}
        </div>

        {/* ── Стрелка НАЗАД ── */}
        <button
          onClick={handlePrev}
          aria-label="Предыдущее видео"
          className={prevFlash ? 'arrow-flash' : ''}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30,
            width: '44px',
            height: '72px',
            borderRadius: '0 56px 56px 0',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.55)',
            fontSize: '30px',
            lineHeight: 1,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
            transition: 'color 0.2s, text-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.textShadow =
              '0 0 10px rgba(255,255,255,0.85), 0 0 30px rgba(255,255,255,0.40), 0 0 60px rgba(255,255,255,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            e.currentTarget.style.textShadow = 'none';
          }}
        >
          ‹
        </button>

        {/* ── Стрелка ВПЕРЁД ── */}
        <button
          onClick={handleNext}
          aria-label="Следующее видео"
          className={nextFlash ? 'arrow-flash' : ''}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30,
            width: '44px',
            height: '72px',
            borderRadius: '56px 0 0 56px',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.55)',
            fontSize: '30px',
            lineHeight: 1,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
            transition: 'color 0.2s, text-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.textShadow =
              '0 0 10px rgba(255,255,255,0.85), 0 0 30px rgba(255,255,255,0.40), 0 0 60px rgba(255,255,255,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            e.currentTarget.style.textShadow = 'none';
          }}
        >
          ›
        </button>

        {/* ── Кнопка звука + горизонтальный ползунок (сверху справа) ── */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row-reverse',
            gap: '8px',
          }}
          onMouseEnter={showVolume}
          onMouseLeave={hideVolume}
        >
          <button
            onClick={toggleMute}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.50)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.70)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.50)')}
          >
            {volumeIcon}
          </button>

          {/* Ползунок — выезжает влево при наведении */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.50)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '999px',
              height: '32px',
              overflow: 'hidden',
              width: volumeVisible ? '110px' : '0px',
              opacity: volumeVisible ? 1 : 0,
              paddingLeft: volumeVisible ? '12px' : '0px',
              paddingRight: volumeVisible ? '12px' : '0px',
              transition: 'width 0.30s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.30s',
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              style={{
                width: '86px',
                background: `linear-gradient(to right,
                  rgba(255,255,255,0.90) ${volume * 100}%,
                  rgba(255,255,255,0.22) ${volume * 100}%
                )`,
              }}
            />
          </div>
        </div>

        {/* ── Контент (текст + кнопка Ko'rish) ── */}
        <div className="relative z-(--z-content) grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-6 md:gap-8 items-end p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="space-y-2 sm:space-y-3 md:space-y-4 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white leading-tight break-words">
              {bannerAnime.title_english || bannerAnime.title}
            </h1>
            <p className="text-gray-200 text-xs sm:text-sm md:text-base lg:text-lg line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {bannerAnime.synopsis}
            </p>
          </div>

          <div className="flex justify-start sm:justify-end">
            <button
              className=" cursor-pointer inline-flex items-center justify-center bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto shadow-lg hover:shadow-xl"
              onClick={() => navigate(`/anime/${bannerAnime.mal_id}`)}
            >
              <span className="mr-2">▶</span>
              <span>Ko'rish</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
};