import React, {useState, useEffect, useRef} from 'react';
import {formatAudioTime} from './formatAudioTime';
import {decodeAudioStream} from './decodeAudioStream';
import {paths, setUpCanvas, drawBar} from './setUpAudioWaveform';
import {colorProgressBars, colorNextBarsGrey, colorPlaybackBarsGrey} from './setUpProgressBar';
import {ReactComponent as PlayIcon} from 'assets/images/icons/playAudioClip.svg';
import {ReactComponent as PauseIcon} from 'assets/images/icons/pauseAudioClip.svg';
import styles from './index.module.scss';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

type AudioRenderProps = {
  audioUrl: string;
};

export const AudioClip = ({audioUrl}: AudioRenderProps) => {
  const [barsSamplesPaths] = useState(paths);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [formattedDuration, setFormattedDuration] = useState('00:00');
  const [currentTime, setCurrentTime] = useState(0);
  const [canvasContext, setCanvasContext] = useState(null);

  const canvas = useRef(null);
  const audioElement = useRef(null);

  const totalBars = 20;

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;
    const canvasContext: CanvasRenderingContext2D = canvas.current.getContext('2d');

    const visualizeAudio = async () => {
      const filteredData = await decodeAudioStream(
        audioUrl,
        abortController,
        setDuration,
        setFormattedDuration,
        totalBars
      );
      setUpAudioSampleBars(filteredData, canvasContext, canvas);
    };

    if (isMounted && abortController) {
      setUpCanvas(canvas, canvasContext);
      visualizeAudio();
    }

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const setUpAudioSampleBars = (
    freqData: number[],
    color: string,
    ctx: CanvasRenderingContext2D,
    canvas: React.MutableRefObject<HTMLCanvasElement>
  ) => {
    const width = Math.round(canvas?.current?.offsetWidth / freqData.length);
    const canvasOffsetHeight = canvas?.current?.offsetHeight;

    let x: number;
    let path: Path2D;
    let isEven;

    for (let i = 0; i < freqData.length; i++) {
      x = width * i;

      if (freqData[i] > canvasOffsetHeight / 2) {
        freqData[i] = canvasOffsetHeight / 2;
      }

      path = barsSamplesPaths['path' + i];
      isEven = (i + 1) % 2;

      drawBar(x, freqData[i], isEven, ctx, path, setCanvasContext);
    }
  };

  const getCurrentDuration = (e: SyntheticEvent<HTMLDivElement>) => {
    const updatedCurrentTime = e.currentTarget.currentTime;
    let audioDuration = e.currentTarget.duration;

    if (audioDuration === Infinity) audioDuration = duration;

    const percentForCurrTimeAndDuration = Math.round((updatedCurrentTime / audioDuration) * 100);
    const step = Math.round(totalBars * (percentForCurrTimeAndDuration / 100));

    if (updatedCurrentTime === audioDuration) {
      setIsPlaying(false);
    }

    setCurrentTime(Number(updatedCurrentTime.toFixed(2)));

    colorProgressBars(step, count, setCount, barsSamplesPaths, canvasContext);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    audioElement.current.pause();
  };

  const startAudio = () => {
    if (audioElement.current.currentTime === audioElement.current.duration) {
      colorBarsWhite(19, 0, setCount, canvasContext, barsSamplesPaths);
    }
    audioElement.current.play();
    setIsPlaying(true);
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
      colorNextBarsGrey(count, updatedCount, setCount, canvasContext, barsSamplesPaths);
    } else {
      colorPlaybackBarsWhite(count, updatedCount, setCount, canvasContext, barsSamplesPaths);
    }
  };

  return (
    <div className={styles.audioContainer}>
      <button type="button" onClick={toggleAudio}>
        {!isPlaying ? <PlayIcon /> : <PauseIcon />}
      </button>

      <audio ref={audioElement} src={audioUrl} onTimeUpdate={getCurrentDuration}></audio>

      <canvas ref={canvas} onClick={e => navigateAudioTrack(e)}></canvas>

      {formattedDuration && (
        <span className={styles.audioTime}>
          {currentTime !== 0 ? formatAudioTime(audioElement?.current.currentTime) : formattedDuration}
        </span>
      )}
    </div>
  );
};
