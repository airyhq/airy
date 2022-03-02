import React, {useState, useEffect, useRef} from 'react';
import {formatSecondsAsTime} from 'dates';
import {ReactComponent as PlayIcon} from 'assets/images/icons/play.svg';
import {ReactComponent as PauseIcon} from 'assets/images/icons/pause.svg';
//import {barsSamplesPaths} from './canvasPaths';
import styles from './index.module.scss';
import { $CombinedState } from 'redux';

type AudioRenderProps = {
  audioUrl: string;
};

export const AudioClip = ({audioUrl}: AudioRenderProps) => {
  const barsSamplesPaths = {
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

  const [path0, setPath0] = useState(new Path2D());
  const [path1, setPath1] = useState(new Path2D());
  const [path2, setPath2] = useState(new Path2D());
  const [path3, setPath3] = useState(new Path2D());
  const [path4, setPath4] = useState(new Path2D());
  const [path5, setPath5] = useState(new Path2D());
  const [path6, setPath6] = useState(new Path2D());
  const [path7, setPath7] = useState(new Path2D());
  const [path8, setPath8] = useState(new Path2D());
  const [path9, setPath9] = useState(new Path2D());
  const [path10, setPath10] = useState(new Path2D());
  const [path11, setPath11] = useState(new Path2D());
  const [path12, setPath12] = useState(new Path2D());
  const [path13, setPath13] = useState(new Path2D());
  const [path14, setPath14] = useState(new Path2D());
  const [path15, setPath15] = useState(new Path2D());
  const [path16, setPath16] = useState(new Path2D());
  const [path17, setPath17] = useState(new Path2D());
  const [path18, setPath18] = useState(new Path2D());
  const [path19, setPath19] = useState(new Path2D());

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

    if(audioElement.current){
      console.log('LOAD')
      audioElement.current.load();
    }


  }, [audioElement])

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

  // const visualizeAudio = async canvasContext => {
  //   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  //   audioContext.resume();

  //   canvasContext.translate(0, canvas.current.offsetHeight / 2);
  //   canvasContext.clearRect(0, 0, canvas.current.width, canvas.current.height);
  //   const canvasCurrent = canvas.current;
  //   const barsColor = 'white';

  //   try {
  //     const readableStream = await fetch(audioUrl);
  //     const arrayBuffer = await readableStream.arrayBuffer();
  //     const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  //     setDuration(audioBuffer.duration);
  //     const formattedDuration = formatSecondsAsTime(audioBuffer.duration);
  //     setFormattedDuration(formattedDuration);

  //     const filteredData = filterData(audioBuffer);
  //     drawAudioSampleBars(filteredData, barsColor, canvasCurrent, canvasContext);
  //   } catch (error) {
  //     console.log('fetch error', error);
  //   }
  // };

  const filterData = audioBuffer => {
    const channelData = audioBuffer.getChannelData(0);
    const sampleNumPerBar = Math.floor(channelData.length / totalBars);

    // console.log('channelData', channelData);

    const filteredData = [];
    for (let i = 0; i < totalBars; i++) {
      const blockStart = sampleNumPerBar * i;
      let sum = 0;

      for (let j = 0; j < sampleNumPerBar; j++) {
        sum = sum + Math.abs(channelData[blockStart + j]);
      }

      const average = Number((sum / sampleNumPerBar).toFixed(2));
      const averageSample = Math.round(average * 100);

      //console.log('averageSample', averageSample);
      filteredData.push(averageSample);
    }

    const multiplier = Math.pow(Math.max(...filteredData), 0);
    const audioData = filteredData.map(n => n * multiplier);

    //setData(audioData);

    //console.log('audioData', audioData);

    return audioData;
  };

  const getCurrentDuration = e => {
    console.log('e.currentTarget', e.currentTarget);
    const updatedCurrentTime = e.currentTarget.currentTime;
    console.log('updatedCurrentTime', updatedCurrentTime);
    let audioDuration = e.currentTarget.duration;
    console.log('audioDuration', audioDuration);

    if(audioDuration === Infinity) audioDuration = duration;

    const percentForCurrTimeAndDuration = Math.round((updatedCurrentTime / audioDuration) * 100);
    console.log('percentForCurrTimeAndDuration', percentForCurrTimeAndDuration);
    const step = Math.round(totalBars * (percentForCurrTimeAndDuration / 100));
    console.log('step', step);

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
    //console.log('drawBar', height);
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

    if (i === 0) setPath0(barsSamplesPaths['path' + i]);
    if (i === 1) setPath1(barsSamplesPaths['path' + i]);
    if (i === 2) setPath2(barsSamplesPaths['path' + i]);
    if (i === 3) setPath3(barsSamplesPaths['path' + i]);
    if (i === 4) setPath4(barsSamplesPaths['path' + i]);
    if (i === 5) setPath5(barsSamplesPaths['path' + i]);
    if (i === 6) setPath6(barsSamplesPaths['path' + i]);
    if (i === 7) setPath7(barsSamplesPaths['path' + i]);
    if (i === 8) setPath8(barsSamplesPaths['path' + i]);
    if (i === 9) setPath9(barsSamplesPaths['path' + i]);
    if (i === 10) setPath10(barsSamplesPaths['path' + i]);
    if (i === 11) setPath11(barsSamplesPaths['path' + i]);
    if (i === 12) setPath12(barsSamplesPaths['path' + i]);
    if (i === 13) setPath13(barsSamplesPaths['path' + i]);
    if (i === 14) setPath14(barsSamplesPaths['path' + i]);
    if (i === 15) setPath15(barsSamplesPaths['path' + i]);
    if (i === 16) setPath16(barsSamplesPaths['path' + i]);
    if (i === 17) setPath17(barsSamplesPaths['path' + i]);
    if (i === 18) setPath18(barsSamplesPaths['path' + i]);
    if (i === 19) setPath19(barsSamplesPaths['path' + i]);
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
    if (i === 0) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path0);

      ctx.strokeStyle = color;
      ctx.stroke(path0);
    }

    if (i === 1) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path1);

      ctx.strokeStyle = color;
      ctx.stroke(path1);
    }

    if (i === 2) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path2);

      ctx.strokeStyle = color;
      ctx.stroke(path2);
    }

    if (i === 3) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path3);

      ctx.strokeStyle = color;
      ctx.stroke(path3);
    }

    if (i === 4) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path4);

      ctx.strokeStyle = color;
      ctx.stroke(path4);
    }

    if (i === 5) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path5);

      ctx.strokeStyle = color;
      ctx.stroke(path5);
    }

    if (i === 6) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path6);

      ctx.strokeStyle = color;
      ctx.stroke(path6);
    }

    if (i === 7) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path7);

      ctx.strokeStyle = color;
      ctx.stroke(path7);
    }

    if (i === 8) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path8);

      ctx.strokeStyle = color;
      ctx.stroke(path8);
    }

    if (i === 9) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path9);

      ctx.strokeStyle = color;
      ctx.stroke(path9);
    }

    if (i === 10) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path10);

      ctx.strokeStyle = color;
      ctx.stroke(path10);
    }

    if (i === 11) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path11);

      ctx.strokeStyle = color;
      ctx.stroke(path11);
    }

    if (i === 12) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path12);

      ctx.strokeStyle = color;
      ctx.stroke(path12);
    }

    if (i === 12) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path12);

      ctx.strokeStyle = color;
      ctx.stroke(path12);
    }

    if (i === 13) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path13);

      ctx.strokeStyle = color;
      ctx.stroke(path13);
    }

    if (i === 14) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path14);

      ctx.strokeStyle = color;
      ctx.stroke(path14);
    }

    if (i === 15) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path15);

      ctx.strokeStyle = color;
      ctx.stroke(path15);
    }

    if (i === 16) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path16);

      ctx.strokeStyle = color;
      ctx.stroke(path16);
    }

    if (i === 17) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path17);

      ctx.strokeStyle = color;
      ctx.stroke(path17);
    }

    if (i === 18) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path18);

      ctx.strokeStyle = color;
      ctx.stroke(path18);
    }

    if (i === 19) {
      ctx.strokeStyle = 'white';
      ctx.stroke(path19);

      ctx.strokeStyle = color;
      ctx.stroke(path19);
    }
  };

  const colorBarsBlue = (prevCount, updatedCount) => {
    for (let i = prevCount; i < updatedCount; i++) {
      changeColorBarSegment(i, '#C0D0D5');
    }

    setCount(updatedCount);
    //setUpdating(false);
  };

  const colorBarsGrey = (prevCount, updatedCount) => {
    for (let i = prevCount; i >= updatedCount; i--) {
      changeColorBarSegment(i, 'white');
    }

    setCount(updatedCount);
    //setUpdating(false);
  };

  const pauseAudio = () => {
    // setStopPlayer(true);
    setIsPlaying(false);
    audioElement.current.pause();
  };

  const startAudio = () => {
    //means that the audio has been finished and is re/starting
    if (audioElement.current.currentTime === audioElement.current.duration) {
      colorBarsGrey(19, 0);
    }
    //setStopPlayer(false);
 
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
    const rect = canvas.current.getBoundingClientRect();
    const audio = audioElement.current;
    console.log('rect.left', rect.left);
    console.log('e.clientX', e.clientX);
    const offsetX = Math.round(e.clientX - rect.left);
    console.log('offsetX', offsetX);
    console.log('audio.duration', audio.duration);

    const updatedPercentage = Math.ceil((offsetX / canvas.current.clientWidth) * 100);

    const currentTime = audio.duration * (offsetX / canvas.current.clientWidth);
    const updatedCount = Math.ceil(totalBars * (updatedPercentage / 100));

    const updatedTime = duration * (offsetX / canvas.current.clientWidth);
    console.log('updatedTime', updatedTime);
    audio.currentTime = updatedTime;

    setCurrentTime(currentTime);

    if (updatedCount > count) {
      colorBarsBlue(count, updatedCount);
    } else {
      colorBarsGrey(count, updatedCount);
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


//