import React, {useState, useEffect, useRef} from 'react';
import {WaveformAudio} from './WaveformAudio';
import styles from './index.module.scss';
import {ReactComponent as Stop} from 'assets/images/icons/stopMedia.svg';
import {ReactComponent as Play} from 'assets/images/icons/playAudio.svg';
import {AudioClip} from 'components';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export function AudioStream({
  savedAudioRecording,
  audioStream,
  stopRecording,
  cancelRecording,
  recordingCanceled,
  isAudioRecordingCanceled,
}) {
  const [dataArr, setDataArr] = useState<any>(new Uint8Array(0));
  let audioAnalyser;
  let audioArr;
  let updateAudioArrId;
  let source;

  useEffect(() => {
    if (audioStream) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioAnalyser = audioContext.createAnalyser();
      audioArr = new Uint8Array(audioAnalyser.frequencyBinCount);
      console.log('audioStream', audioStream);

      source = audioContext.createMediaStreamSource(audioStream);
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
      {!savedAudioRecording && (
        <>
          <WaveformAudio audioData={dataArr} />

          <button type="button" className={`${styles.audioButtons} ${styles.stopPlayButtons}`} onClick={stopRecording}>
            <Stop />
          </button>
        </>
      )}
    </div>
  );
}
