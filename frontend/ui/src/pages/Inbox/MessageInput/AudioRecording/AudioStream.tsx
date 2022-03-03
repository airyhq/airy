import React, {useState, useEffect} from 'react';
import {WaveformAudio} from './WaveformAudio';
import {ReactComponent as Pause} from 'assets/images/icons/stopMedia.svg';
import styles from './index.module.scss';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

type AudioStreamProps = {
  audioStream: MediaStream;
  pauseRecording: () => void;
};

export function AudioStream({audioStream, pauseRecording}: AudioStreamProps) {
  const [dataArr, setDataArr] = useState<number[]>([0]);
  let audioAnalyser;
  let audioArr;
  let updateAudioArrId;
  let source;

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.minDecibels = -90;
    audioAnalyser.maxDecibels = -10;
    audioAnalyser.smoothingTimeConstant = 0.85;
    audioArr = new Uint8Array(audioAnalyser.frequencyBinCount);

    source = audioContext.createMediaStreamSource(audioStream);
    source.connect(audioAnalyser);
    updateAudioArrId = requestAnimationFrame(updateAudio);

    return () => {
      window.cancelAnimationFrame(updateAudioArrId);
      audioAnalyser.disconnect();
      source.disconnect();
    };
  }, []);

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
