// components/AudioPlayer.jsx
import { useEffect, useRef } from 'react';

const AudioPlayer = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Start at 0 and play
    audio.currentTime = 0;
    audio.volume = 0.3;

    const playAudio = () => {
      audio.play().catch(() => {
        // Autoplay blocked; wait for user interaction
        const clickHandler = () => {
          audio.play();
          document.removeEventListener('click', clickHandler);
        };
        document.addEventListener('click', clickHandler);
      });
    };

    playAudio();
  }, []);

  return (
    <audio ref={audioRef}>
      <source src="/audio.mp3" type="audio/mp3" />
      Your browser does not support the audio tag.
    </audio>
  );
};

export default AudioPlayer;
