import React, {useState, useEffect, useRef} from 'react';
import {formatSecondsAsTime} from 'dates';
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
  const [ctx, setCtx] = useState(null);

  const canvas = useRef(null);
  const audioElement = useRef(null);
  const totalBars = 20;
  const barWidth = 3;

  const canvasWidth = 174;
  const canvasHeight = 40;

  useEffect(() => {
    const abortController = new AbortController();
    const context = canvas.current.getContext('2d');
    const ratio = window.devicePixelRatio;

    canvas.current.width = 174 * ratio;
    canvas.current.height = 40 * ratio;

    canvas.current.style.width = canvasWidth + 'px';
    canvas.current.style.height = canvasHeight + 'px';

    context.scale(ratio, ratio);

    const visualizeAudio = async canvasContext => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.resume();

      canvasContext.translate(0, canvas.current.offsetHeight / 2);
      canvasContext.clearRect(0, 0, canvas.current.width, canvas.current.height);
      const canvasCurrent = canvas.current;
      const barsColor = 'white';

      try {
        const readableStream = await fetch(audioUrl, { signal: abortController.signal });
        const arrayBuffer = await readableStream.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          setDuration(audioBuffer.duration);
          const formattedDuration = formatSecondsAsTime(audioBuffer.duration);
          setFormattedDuration(formattedDuration);
        
        const filteredData = filterData(audioBuffer);
        drawAudioSampleBars(filteredData, barsColor, canvasCurrent, canvasContext);
      } catch (error) {
        console.log('fetch error', error);
      }
    };

    visualizeAudio(context);

    return () => {
      abortController.abort();
    }
  
  }, []);

  const filterData = audioBuffer => {
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
    // console.log('e.currentTarget.currentTime', e.currentTarget.currentTime);
    // console.log('e.currentTarget.duration', e.currentTarget.duration);
    const updatedCurrentTime = e.currentTarget.currentTime;
    //console.log('updatedCurrentTime', updatedCurrentTime);
    let audioDuration = e.currentTarget.duration;

    if(audioDuration === Infinity) audioDuration = duration;

    //console.log('audioDuration', audioDuration);

    const percentForCurrTimeAndDuration = Math.round((updatedCurrentTime / audioDuration) * 100);
    //console.log('percentForCurrTimeAndDuration', percentForCurrTimeAndDuration);
    const step = Math.round(totalBars * (percentForCurrTimeAndDuration / 100));
   // console.log('step', step);

    if (updatedCurrentTime === audioDuration) {
      setIsPlaying(false);
    }

    setCurrentTime(Number(updatedCurrentTime.toFixed(2)));

    colorProgressBars(step);
  };

  const drawAudioSampleBars = (freqData, color, canvasCurrent, ctx) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    const width = Math.round(canvasCurrent.offsetWidth / freqData.length);
    const canvasOffsetHeight = canvasCurrent.offsetHeight;

    let x;

    for (let i = 0; i < freqData.length; i++) {
      x = width * i;

      if (freqData[i] > canvasOffsetHeight / 2) {
        freqData[i] = canvasOffsetHeight / 2;
      }

      drawBar(i, x, freqData[i], (i + 1) % 2, color, barWidth, ctx);
    }
  };

  const drawBar = (i, x, height, isEven, color, barWidth, ctx) => {
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

  const colorProgressBars = step => {
    if (count === 0 && step === 0) {
      changeColorBarSegment(step, '#C0D0D5');
    } else {
      for (let i = count; i < step; i++) {
        changeColorBarSegment(i, '#C0D0D5');
      }
    }

    setCount(step);
  };

  const changeColorBarSegment = (i, color) => {
    ctx.strokeStyle = 'white';
    ctx.stroke(barsSamplesPaths['path' + i]);

    ctx.strokeStyle = color;
    ctx.stroke(barsSamplesPaths['path' + i]);
  };

  
  const colorBarsGrey = (prevCount, updatedCount) => {
    for (let i = prevCount; i < updatedCount; i++) {
      changeColorBarSegment(i, '#C0D0D5');
    }
    setCount(updatedCount);
  };

  const colorBarsWhite = (prevCount, updatedCount) => {
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

    if(!isPlaying) return; 

    const rect = canvas.current.getBoundingClientRect();
    const audio = audioElement.current;
    // console.log('rect.left', rect.left);
    // console.log('e.clientX', e.clientX);
    const offsetX = Math.round(e.clientX - rect.left);
    // console.log('offsetX', offsetX);
    // console.log('audio.duration', audio.duration);

    const updatedPercentage = Math.ceil((offsetX / canvas.current.clientWidth) * 100);

    const currentTime = audio.duration * (offsetX / canvas.current.clientWidth);
    const updatedCount = Math.ceil(totalBars * (updatedPercentage / 100));

    const updatedTime = duration * (offsetX / canvas.current.clientWidth);
    //console.log('updatedTime', updatedTime);
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