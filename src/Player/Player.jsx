import pause from '../assets/images/pause.svg'
import play from '../assets/images/play.svg'
import next from '../assets/images/next.svg'
import prev from '../assets/images/prev.svg'
import { useEffect, useState, useRef } from 'react';
import { songsData } from './Songs.js'

export function Player() {
  const [songs, setSongs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handlePlayClick = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleClickPrevious = () => {
    setSongs((currentSong) =>
      currentSong === 0 ? songsData.length - 1 : currentSong - 1
    );
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const handleClickNext = () => {
    setSongs((currentSong) =>
      currentSong < songsData.length - 1 ? currentSong + 1 : 0
    );
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const handleTimeSeeking = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(audioRef.current.currentTime);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('durationchange', () => {
        setDuration(audioRef.current.duration);
      });
    }
  }, []);

  return (
    /* Global container */
    <div className='container w-100 flex justify-center flex-col align-middle m-3'>

    <div>
      <audio
        ref={audioRef}
        src={songsData[songs].src}
        controls={false}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={() => setDuration(audioRef.current.duration)}
        autoPlay
      />
      </div>

      <h1 className='text-4xl justify-center align-middle text-center mt-10'> Rikudev Music Player </h1>

      {/* Now playing & Buttons */}
      <div className='container flex flex-col justify-center align-middle gap-3 mt-10'>
        <div>
          <h1 className="text-2xl justify-center flex align-middle text-center">Now Playing: {songsData[songs].title} - {songsData[songs].artist}</h1>
        </div>
        <div className='flex justify-center align-middle gap-10 mt-6'>
          <img onClick={handleClickPrevious} src={prev} alt="prev" />
          <img onClick={handlePlayClick} src={isPlaying ? pause : play} alt="" />
          <img onClick={handleClickNext} src={next} alt="next" />
        </div>
      </div>

  {/* Status bar & timers */}
      <div className='flex justify-center align-middle mt-7 gap-1'>
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleTimeSeeking}
        />
        <span>{formatTime(duration)}</span>
      </div>

{/* Playlist title & songs */}
      <div className='flex justify-center align-middle text-center flex-col gap- mt-10'>
        <div>
          <h2 className="text-2xl uppercase ">PlayList</h2>
        </div>
        <div className='flex justify-center align-middle text-left mt-5'>
          <ul>
            {songsData.map((song, index) => (
              <li className=' hover:opacity-50 cursor-pointer'
                key={index}
                onClick={() => {
                  setSongs(index);
                  setIsPlaying(!isPlaying);
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                }}
              >
                {song.title} - {song.artist}
              </li>
            ))}
          </ul>
        </div>
      </div>
    
    </div>
  );
}
