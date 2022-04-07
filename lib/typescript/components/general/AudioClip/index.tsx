import React, {useState, useEffect, useRef} from 'react';
import {
  formatAudioTime,
  decodeAudioStream,
  drawAudioSampleBars,
  setUpCanvas,
  colorNextBarsGrey,
  colorPlaybackBarsWhite,
  generateRandomFrequencies,
} from './services';
import {ReactComponent as PlayIcon} from 'assets/images/icons/playAudioClip.svg';
import {ReactComponent as PauseIcon} from 'assets/images/icons/pauseAudioClip.svg';
import styles from './index.module.scss';

type AudioRenderProps = {
  audioUrl: string;
};

export const AudioClip = ({audioUrl}: AudioRenderProps) => {
  const paths = {
    path0: new Path2D(),
    path1: new Path2D(),
    path2: new Path2D(),
    path3: new Path2D(),
    path4: new Path2D(),
    path5: new Path2D(),
    path6: new Path2D(),
    path7: new Path2D(),
    path8: new Path2D(),
    path9: new Path2D(),
    path10: new Path2D(),
    path11: new Path2D(),
    path12: new Path2D(),
    path13: new Path2D(),
    path14: new Path2D(),
    path15: new Path2D(),
    path16: new Path2D(),
    path17: new Path2D(),
    path18: new Path2D(),
    path19: new Path2D(),
  };

  const [barsSamplesPaths] = useState(paths);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [formattedDuration, setFormattedDuration] = useState('00:00');
  const [currentTime, setCurrentTime] = useState(0);
  const [canvasContext, setCanvasContext] = useState<null | CanvasRenderingContext2D>(null);
  const [error, setError] = useState(false);

  const canvas = useRef(null);
  const audioElement = useRef(null);

  const totalBars = 20;

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;
    const context: CanvasRenderingContext2D = canvas.current.getContext('2d');

    const visualizeAudio = async (canvasContext: CanvasRenderingContext2D) => {
      const fetchRequestData = await decodeAudioStream(audioUrl, abortController);
      let audioFrequencies;

      if (Array.isArray(fetchRequestData)) {
        audioFrequencies = fetchRequestData;
      } else {
        audioFrequencies = generateRandomFrequencies();
      }

      drawAudioSampleBars(audioFrequencies, canvasContext, canvas, barsSamplesPaths, setCanvasContext);
    };

    if (isMounted) {
      setUpCanvas(context, canvas);
      visualizeAudio(context);
    }

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const getCurrentDuration = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const updatedCurrentTime = e.currentTarget.currentTime;
    let audioDuration = e.currentTarget.duration;

    if (audioDuration === Infinity) audioDuration = duration;

    const percentForCurrTimeAndDuration = Math.round((updatedCurrentTime / audioDuration) * 100);
    const step = Math.round(totalBars * (percentForCurrTimeAndDuration / 100));

    if (updatedCurrentTime === audioDuration) setIsPlaying(false);

    setCurrentTime(Number(updatedCurrentTime.toFixed(2)));
    colorNextBarsGrey(count, step, canvasContext, barsSamplesPaths, setCount);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    audioElement.current.pause();
  };

  const startAudio = () => {
    if (audioElement.current.currentTime === audioElement.current.duration) {
      colorPlaybackBarsWhite(19, 0, canvasContext, barsSamplesPaths, setCount);
    }

    const playPromise = audioElement.current.play();

    if (playPromise) {
      playPromise
        .then(() => {
          audioElement.current.play();
          setIsPlaying(true);
        })
        .catch(() => {
          setError(true);
        });
    }
  };

  const toggleAudio = () => {
    !isPlaying ? startAudio() : pauseAudio();
  };

  const navigateAudioTrack = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isPlaying) return;

    const rect = canvas.current.getBoundingClientRect();
    const audio = audioElement.current;

    const offsetX = Math.round(e.clientX - rect.left);
    const updatedPercentage = Math.ceil((offsetX / canvas.current.clientWidth) * 100);

    const currentTime = audio.duration * (offsetX / canvas.current.clientWidth);
    const updatedCount = Math.ceil(totalBars * (updatedPercentage / 100));

    const updatedTime = duration * (offsetX / canvas.current.clientWidth);
    audio.currentTime = updatedTime;

    setCurrentTime(currentTime);

    if (updatedCount > count) {
      colorNextBarsGrey(count, updatedCount, canvasContext, barsSamplesPaths, setCount);
    } else {
      colorPlaybackBarsWhite(count, updatedCount, canvasContext, barsSamplesPaths, setCount);
    }
  };

  const getDuration = () => {
    setDuration(audioElement.current.duration);
    const formattedDur = formatAudioTime(audioElement.current.duration);
    setFormattedDuration(formattedDur);
  };

  return (
    <div className={styles.audioContainer}>
      {!error && (
        <button type="button" onClick={toggleAudio}>
          {!isPlaying ? <PlayIcon /> : <PauseIcon />}
        </button>
      )}

      <audio
        onLoadedMetadata={getDuration}
        preload="metadata"
        ref={audioElement}
        src={audioUrl}
        onTimeUpdate={getCurrentDuration}
      ></audio>

      {!error ? (
        <canvas ref={canvas} onClick={e => navigateAudioTrack(e)}></canvas>
      ) : (
        <span> could not load audio</span>
      )}

      {!error && (
        <span className={styles.audioTime}>
          {currentTime !== 0 ? formatAudioTime(audioElement?.current.currentTime) : formattedDuration}
        </span>
      )}
    </div>
  );
};
