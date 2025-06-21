import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/forest/index.css';
import 'videojs-http-source-selector';

// Для опенинга и эндинга
const skipIntro = 90; // секунд
const skipOutro = 60; // секунд с конца

interface VideoPlayerProps {
  options: videojs.PlayerOptions;
  onReady?: (player: videojs.Player) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ options, onReady }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<videojs.Player | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current?.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, {
        ...options,
        controlBar: {
          ...options.controlBar,
          volumePanel: { inline: false },
          children: [
            'playToggle',
            'progressControl',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'playbackRateMenuButton',
            'chaptersButton',
            'subtitlesButton',
            'audioTrackButton',
            'fullscreenToggle'
          ]
        }
      }, () => {
        player.httpSourceSelector?.({ default: 'auto' });
        player.controlBar.addChild('QualitySelector');
        if (onReady) onReady(player);
      });

      // Добавим кнопку "Пропустить опенинг"
      const skipIntroBtn = player.controlBar.addChild('button', {});
      skipIntroBtn.addClass('vjs-skip-intro-button');
      skipIntroBtn.controlText('Skip Opening');
      skipIntroBtn.el().innerHTML = '⏩ OP';
      skipIntroBtn.on('click', () => {
        const current = player.currentTime();
        player.currentTime(current + skipIntro);
      });

      // Добавим кнопку "Пропустить эндинг"
      const skipOutroBtn = player.controlBar.addChild('button', {});
      skipOutroBtn.addClass('vjs-skip-outro-button');
      skipOutroBtn.controlText('Skip Ending');
      skipOutroBtn.el().innerHTML = '⏭️ ED';
      skipOutroBtn.on('click', () => {
        const duration = player.duration();
        player.currentTime(duration - skipOutro);
      });
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, onReady]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;