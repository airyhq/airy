import React, {useState, useEffect, useRef} from 'react';
import {WaveformAudio} from './WaveformAudio';
import styles from './index.module.scss';
import {ReactComponent as Stop} from 'assets/images/icons/stopMedia.svg';
import {ReactComponent as CancelCross} from 'assets/images/icons/cancelCross.svg';
import {ReactComponent as Play} from 'assets/images/icons/playAudio.svg';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export function AudioRecording({audio, savedAudio, isAudioRecordingCanceled}) {
  const [dataArr, setDataArr] = useState<any>(new Uint8Array(0));
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let audioAnalyser;
  let audioArr;
  let updateAudioArrId;
  let source;

  useEffect(() => {
    console.log('savedAudio', savedAudio);
  }, [savedAudio]);

  useEffect(() => {
    audioAnalyser = audioContext.createAnalyser();
    audioArr = new Uint8Array(audioAnalyser.frequencyBinCount);

    source = audioContext.createMediaStreamSource(audio);
    source.connect(audioAnalyser);
    updateAudioArrId = requestAnimationFrame(updateAudio);
    isAudioRecordingCanceled(false);

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

  const stopRecording = () => {
    console.log('STOP RECORDING, audioRecording');
    audio.getTracks().forEach(track => track.stop());
    //isAudioRecordingCanceled(false);
    //setDataArr(null);
    setIsPlaying(false);

    //window.cancelAnimationFrame(updateAudioArrId);
  };

  const cancelRecording = () => {
    console.log('CANCEL RECORDING');
    audio.getTracks().forEach(track => track.stop());
    isAudioRecordingCanceled(true);

    setDataArr(null);
    setIsPlaying(false);
  };

  const startSavedRecording = async () => {
    // const arrayBuffer = await new Response(savedAudio).arrayBuffer();
    // const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    //setDataArr([...savedAudio]);
    // source = audioContext.createBufferSource();
    // source.buffer = audioBuffer;
    // source.connect(audioAnalyser);
    // source.start(0);
    savedAudio.play();
    setIsPlaying(true);
  };

  //add cancel and stop button around Waveform
  return (
    <div className={styles.container}>
      {isPlaying ? (
        <button type="button" className={`${styles.audioButtons} ${styles.stopPlayButtons}`} onClick={stopRecording}>
          <Stop />
        </button>
      ) : (
        <button
          type="button"
          className={`${styles.audioButtons} ${styles.stopPlayButtons}`}
          onClick={startSavedRecording}
        >
          <Play />
        </button>
      )}

      <WaveformAudio audioData={dataArr} />
      <button type="button" className={`${styles.audioButtons} ${styles.cancelButton}`} onClick={cancelRecording}>
        <CancelCross />
      </button>
    </div>
  );
}
