import React, {useState, useEffect, useRef} from 'react';
import {WaveformAudio} from './WaveformAudio';
import styles from './index.module.scss';
import {ReactComponent as Stop} from 'assets/images/icons/stopMedia.svg';
import {ReactComponent as CancelCross} from 'assets/images/icons/cancelCross.svg';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export function AudioRecording({audio}) {
  const [dataArr, setDataArr] = useState<any>(new Uint8Array(0));
  let audioAnalyser;
  let audioArr;
  let updateAudioArrId;
  let source;

  console.log('audio', audio);

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioAnalyser = audioContext.createAnalyser();
    audioArr = new Uint8Array(audioAnalyser.frequencyBinCount);

    source = audioContext.createMediaStreamSource(audio);
    source.connect(audioAnalyser);
    updateAudioArrId = requestAnimationFrame(updateAudio);

    return () => {
      //window.cancelAnimationFrame(updateAudioArrId);
      audioAnalyser.disconnect();
      source.disconnect();
    };
  }, []);

  const updateAudio = () => {
    audioAnalyser.getByteFrequencyData(audioArr);

    setDataArr([...audioArr]);

    updateAudioArrId = requestAnimationFrame(updateAudio);
  };

  const stopRecording = () => {
    audio.cancel();
    //setDataArr(null)
    window.cancelAnimationFrame(updateAudioArrId);
  };

  //add cancel and stop button around Waveform
  return (
    <div className={styles.container}>
      <button className={`${styles.audioButtons} ${styles.stopButton}`} onClick={stopRecording}>
        <Stop />
      </button>
      <WaveformAudio audioData={dataArr} />
      <button className={`${styles.audioButtons} ${styles.cancelButton}`}>
        <CancelCross />
      </button>
    </div>
  );
}
