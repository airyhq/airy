import React, {useState, useEffect, useRef} from 'react';
import {AudioStream} from './AudioStream';
import {AudioClip} from 'components';
import styles from './index.module.scss';
import {ReactComponent as Cancel} from 'assets/images/icons/cancelCross.svg';
import {SimpleLoader} from 'components';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export function AudioRecording({
  recordingResumed,
  audioRecordingCanceledUpdate,
  getSavedAudio,
  savedAudioFileUploaded,
  setVoiceRecordingOn,
  isVoiceRecordingPaused,
}) {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [recordingCanceled, setRecordingCanceled] = useState(false);
  const [savedAudioRecording, setSavedAudioRecording] = useState<any>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [loading, setLoading] = useState(false);

  console.log('audioStream', audioStream);

  useEffect(() => {
    if (recordingResumed) {
      setSavedAudioRecording(null);
    }
  }, [recordingResumed]);

  useEffect(() => {
    setLoading(false);
  }, [savedAudioFileUploaded]);

  useEffect(() => {
    recordVoiceMessage();
  }, []);

  useEffect(() => {
    if (audioStream) {
      const mediaRecorder = new MediaRecorder(audioStream, {mimeType: 'audio/webm'});

      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener('dataavailable', event => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);

          const audioBlob = new Blob(audioChunks, {type: 'audio/webm'});
          const file = new File(audioChunks, 'recording.mp3', {
            type: audioBlob.type,
            lastModified: Date.now(),
          });

          setSavedAudioRecording(file);
          setLoading(true);
          getSavedAudio(file);
        }
      });

      mediaRecorder.addEventListener('pause', () => {
        isVoiceRecordingPaused(true);
      });

      setMediaRecorder(mediaRecorder);
    }
  }, [audioStream]);

  useEffect(() => {
    console.log('mediaRecorder AUDIORECOR', mediaRecorder);
    if (recordingResumed && mediaRecorder) {
      mediaRecorder.resume();
      setAudioStream(audioStream);
      setRecordingCanceled(true);
      setSavedAudioRecording(null);
    }
  }, [recordingResumed]);

  const recordVoiceMessage = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    setAudioStream(stream);
  };

  const pauseRecording = () => {
    mediaRecorder.requestData();
    mediaRecorder.pause();

    audioRecordingCanceledUpdate(false);
    setRecordingCanceled(false);
  };

  const cancelRecording = () => {
    audioStream.getTracks().forEach(track => track.stop());
    mediaRecorder.stop();

    setAudioStream(null);
    setSavedAudioRecording(null);
    audioRecordingCanceledUpdate(true);
    setRecordingCanceled(true);
    setVoiceRecordingOn(false);
  };

  return (
    <div className={styles.container}>
      {!loading && (
        <button type="button" className={`${styles.audioButtons} ${styles.cancelButton}`} onClick={cancelRecording}>
          <Cancel />
        </button>
      )}

      {!savedAudioRecording && (
        <AudioStream
          savedAudioRecording={savedAudioRecording}
          pauseRecording={pauseRecording}
          audioStream={audioStream}
          recordingResumed={recordingResumed}
        />
      )}

      {loading && <SimpleLoader />}

      {savedAudioFileUploaded && (
        <div className={styles.audioComponent}>
          <AudioClip audioUrl={savedAudioFileUploaded} />
        </div>
      )}
    </div>
  );
}
