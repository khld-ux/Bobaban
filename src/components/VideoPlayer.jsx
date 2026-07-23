import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Settings } from 'lucide-react';

export const VideoPlayer = ({ videoId, onStateChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const playerRef = useRef(null);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (!window.YT) {
      document.body.appendChild(tag);
    }
  }, [videoId]);

  const onPlayerReady = (event) => {
    event.target.setVolume(volume * 100);
  };

  const onPlayerStateChange = (event) => {
    const isPlayingNow = event.data === window.YT?.PlayerState?.PLAYING;
    setIsPlaying(isPlayingNow);
    if (onStateChange) {
      onStateChange({
        isPlaying: isPlayingNow,
        currentTime: event.target.getCurrentTime(),
      });
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume * 100);
    }
  };

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl">
      <div id="youtube-player" className="w-full aspect-video"></div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 flex items-center gap-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={togglePlayPause}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>

        <div className="flex items-center gap-2 flex-1">
          <Volume2 className="w-4 h-4 text-white" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <Settings className="w-4 h-4 text-white cursor-pointer" />
      </div>
    </div>
  );
};
