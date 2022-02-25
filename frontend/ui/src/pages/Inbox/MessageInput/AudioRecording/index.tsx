import React, {useState, useEffect, useRef} from 'react';
import {AudioStream} from './AudioStream';
import {AudioClip} from 'components';
import styles from './index.module.scss';
import {ReactComponent as CancelCross} from 'assets/images/icons/cancelCross.svg';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export function AudioRecording({savedAudio, isAudioRecordingCanceled, getAudioStream}) {
  const [audioStream, setAudioStream] = useState<any>(null);
  const [dataArr, setDataArr] = useState<any>(new Uint8Array(0));
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [recordingCanceled, setRecordingCanceled] = useState<boolean>(false);
  const [savedAudioRecording, setSavedAudioRecording] = useState<any>();
  const [mediaRecorder, setMediaRecorder] = useState<any>();

  useEffect(() => {
    console.log('audioRecording - recordingCanceled', recordingCanceled);
  }, [recordingCanceled]);

  useEffect(() => {
    console.log('AUDIORECORD, savedAudio', savedAudioRecording);
  }, [savedAudioRecording]);

  useEffect(() => {
    if (audioStream) {
      const mediaRecorder = new MediaRecorder(audioStream);

      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });
    
      mediaRecorder.addEventListener('stop', () => {
        //mediaRecorder.stop()

        console.log('STOP EVT LISTENER');
        const audioBlob = new Blob(audioChunks);
        const audioUrl: any = URL.createObjectURL(audioBlob);
        const savedAudio = new Audio(audioUrl);

        setSavedAudioRecording(savedAudio);
        setAudioStream(null);
       
        setIsPlaying(false);
      });

      setMediaRecorder(mediaRecorder);
    }
  }, [audioStream]);

  useEffect(() => {
    recordVoiceMessage();
  }, []);

  const recordVoiceMessage = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    getAudioStream(stream);
    setAudioStream(stream);
  };

  const stopRecording = () => {
    console.log('STOP FUNC');
    mediaRecorder.stop();
    audioStream.getTracks().forEach(track => track.stop());
    isAudioRecordingCanceled(false);
    setRecordingCanceled(false);

  };

  const cancelRecording = () => {
    console.log('CANCEL RECORDING');
    setAudioStream(null);
    setSavedAudioRecording(null);
    isAudioRecordingCanceled(true);
    setRecordingCanceled(true);
    setIsPlaying(false);
  };

  const startSavedRecording = async () => {
    savedAudio.play();
    setIsPlaying(true);
  };

  //add cancel and stop button around Waveform
  return (
    <div className={styles.container}>
      <button type="button" className={`${styles.audioButtons} ${styles.cancelButton}`} onClick={cancelRecording}>
        <CancelCross />
      </button>

      {audioStream && (
        <AudioStream
          savedAudioRecording={savedAudioRecording}
          stopRecording={stopRecording}
          cancelRecording={cancelRecording}
          recordingCanceled={recordingCanceled}
          audioStream={audioStream}
          isAudioRecordingCanceled={isAudioRecordingCanceled}
        />
      )}

      {savedAudioRecording && !recordingCanceled && (
        <>
          <div className={styles.audioComponent}>
            <AudioClip audioUrl={savedAudioRecording?.src} />
          </div>
        </>
      )}
    </div>
  );
}
