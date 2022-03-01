import React, {useState, useEffect, useRef} from 'react';
import {WaveformAudio} from './WaveformAudio';
import styles from './index.module.scss';
import {ReactComponent as Pause} from 'assets/images/icons/stopMedia.svg';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export function AudioStream({audioStream, pauseRecording}) {
  const [dataArr, setDataArr] = useState<any>(new Uint8Array(0));
  let audioAnalyser;
  let audioArr;
  let updateAudioArrId;
  let source;

  useEffect(() => {
    if (audioStream) {
      console.log('AUDIOSTREAM', audioStream);
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioAnalyser = audioContext.createAnalyser();
      console.log('audioAnalyser', audioAnalyser);
      audioArr = new Uint8Array(audioAnalyser.frequencyBinCount);
      console.log('audioArr', audioArr);

      source = audioContext.createMediaStreamSource(audioStream);
      console.log('source', source);
      source.connect(audioAnalyser);
      updateAudioArrId = requestAnimationFrame(updateAudio);

      return () => {
        window.cancelAnimationFrame(updateAudioArrId);
        audioAnalyser.disconnect();
        source.disconnect();
      };
    }
  }, [audioStream]);

  const updateAudio = () => {
    audioAnalyser.getByteFrequencyData(audioArr);
    setDataArr([...audioArr]);
    updateAudioArrId = requestAnimationFrame(updateAudio);
  };

  return (
    <div className={styles.container}>
      <div className={styles.waveformContainer}>
        <WaveformAudio audioData={dataArr} />
      </div>

      <button type="button" className={`${styles.audioButtons} ${styles.pauseButton}`} onClick={pauseRecording}>
        <Pause />
      </button>
    </div>
  );
}
