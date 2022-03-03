import React, {useState, useEffect, useRef} from 'react';
import {formatSecondsAsTime} from './formatSecondsAsTime';
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
  const [ctx, setCtx] = useState(null);

  const canvas = useRef(null);
  const audioElement = useRef(null);

  const totalBars = 20;
  const barWidth = 3;
  const barsColor = 'white';
  const greyProgressBarColor = '#C0D0D5';

  const canvasWidth = 174;
  const canvasHeight = 40;

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;
    const context: CanvasRenderingContext2D = canvas.current.getContext('2d');
    const ratio = window.devicePixelRatio;

    canvas.current.width = 174 * ratio;
    canvas.current.height = 40 * ratio;

    canvas.current.style.width = canvasWidth + 'px';
    canvas.current.style.height = canvasHeight + 'px';

    context.scale(ratio, ratio);

    const visualizeAudio = async (canvasContext: CanvasRenderingContext2D) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      canvasContext.translate(0, canvas.current.offsetHeight / 2);
      canvasContext.clearRect(0, 0, canvas.current.width, canvas.current.height);

      try {
        const readableStream = await fetch(audioUrl, {signal: abortController.signal});
        const arrayBuffer = await readableStream.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        setDuration(audioBuffer.duration);
        const formattedDuration = formatSecondsAsTime(audioBuffer.duration);
        setFormattedDuration(formattedDuration);

        const filteredData = filterData(audioBuffer);
        drawAudioSampleBars(filteredData, barsColor, canvasContext);
      } catch (error) {
        return error;
      }
    };

    if (isMounted) {
      visualizeAudio(context);
    }

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const filterData = (audioBuffer: AudioBuffer) => {
    const channelData = audioBuffer.getChannelData(0);
    const sampleNumPerBar = Math.floor(channelData.length / totalBars);
    const filteredData = [];

    for (let i = 0; i < totalBars; i++) {
      const blockStart = sampleNumPerBar * i;
      let sum = 0;

      for (let j = 0; j < sampleNumPerBar; j++) {
        sum = sum + Math.abs(channelData[blockStart + j]);
      }

      const average = Number((sum / sampleNumPerBar).toFixed(2));
      const averageSample = Math.round(average * 100);

      filteredData.push(averageSample);
    }

    const multiplier = Math.pow(Math.max(...filteredData), 0);
    const audioData = filteredData.map(n => n * multiplier);

    return audioData;
  };

  const getCurrentDuration = e => {
    const updatedCurrentTime = e.currentTarget.currentTime;
    let audioDuration = e.currentTarget.duration;

    if (audioDuration === Infinity) audioDuration = duration;

    const percentForCurrTimeAndDuration = Math.round((updatedCurrentTime / audioDuration) * 100);
    const step = Math.round(totalBars * (percentForCurrTimeAndDuration / 100));

    if (updatedCurrentTime === audioDuration) {
      setIsPlaying(false);
    }

    setCurrentTime(Number(updatedCurrentTime.toFixed(2)));

    colorProgressBars(step);
  };

  const drawAudioSampleBars = (freqData: number[], color: string, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    console.log('freqData', freqData);

    const width = Math.round(canvas.current.offsetWidth / freqData.length);
    const canvasOffsetHeight = canvas.current.offsetHeight;

    let x: number;

    for (let i = 0; i < freqData.length; i++) {
      x = width * i;

      if (freqData[i] > canvasOffsetHeight / 2) {
        freqData[i] = canvasOffsetHeight / 2;
      }

      drawBar(i, x, freqData[i], (i + 1) % 2, color, ctx);
    }
  };

  const drawBar = (
    i: number,
    x: number,
    height: number,
    isEven: number,
    color: string,
    ctx: CanvasRenderingContext2D
  ) => {
    if (height <= 1) {
      height += 4;
    }

    if (height >= 20) {
      height = 18;
    }

    if (height <= 19 && height >= 18) {
      height -= 2;
    }

    if (x === 0) x = 2;

    height = isEven ? height : -height;

    ctx.lineWidth = barWidth;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';

    barsSamplesPaths['path' + i].moveTo(x, 0);
    barsSamplesPaths['path' + i].lineTo(x, height);
    ctx.stroke(barsSamplesPaths['path' + i]);
    barsSamplesPaths['path' + i].moveTo(x, 0);
    barsSamplesPaths['path' + i].lineTo(x, -height);

    ctx.stroke(barsSamplesPaths['path' + i]);
    setCtx(ctx);
  };

  const colorProgressBars = (step: number) => {
    if (count === 0 && step === 0) {
      changeColorBarSegment(step, greyProgressBarColor);
    } else {
      for (let i = count; i < step; i++) {
        changeColorBarSegment(i, greyProgressBarColor);
      }
    }

    setCount(step);
  };

  const changeColorBarSegment = (i: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.stroke(barsSamplesPaths['path' + i]);
  };

  const colorBarsGrey = (prevCount: number, updatedCount: number) => {
    for (let i = prevCount; i < updatedCount; i++) {
      changeColorBarSegment(i, greyProgressBarColor);
    }
    setCount(updatedCount);
  };

  const colorBarsWhite = (prevCount: number, updatedCount: number) => {
    for (let i = prevCount; i >= updatedCount; i--) {
      changeColorBarSegment(i, 'white');
    }
    setCount(updatedCount);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    audioElement.current.pause();
  };

  const startAudio = () => {
    if (audioElement.current.currentTime === audioElement.current.duration) {
      colorBarsWhite(19, 0);
    }
    audioElement.current.play();
    setIsPlaying(true);
  };

  const toggleAudio = () => {
    if (!isPlaying) {
      startAudio();
    } else {
      pauseAudio();
    }
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
      colorBarsGrey(count, updatedCount);
    } else {
      colorBarsWhite(count, updatedCount);
    }
  };

  return (
    <div className={styles.audioContainer}>
      <button type="button" onClick={toggleAudio}>
        {!isPlaying ? <PlayIcon className={styles.icon} /> : <PauseIcon className={styles.icon} />}
      </button>

      <audio ref={audioElement} src={audioUrl} onTimeUpdate={getCurrentDuration}></audio>

      <canvas ref={canvas} onClick={e => navigateAudioTrack(e)}></canvas>

      {formattedDuration && (
        <span className={styles.audioTime}>
          {currentTime !== 0 ? formatSecondsAsTime(audioElement?.current.currentTime) : formattedDuration}
        </span>
      )}
    </div>
  );
};
