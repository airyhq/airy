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
  setVoiceRecordingOn,
  isVoiceRecordingPaused,
  recordedAudioFileUploaded,
}) {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recordingResumed && mediaRecorder) {
      mediaRecorder.resume();
      setAudioStream(audioStream);
    }
  }, [recordingResumed, mediaRecorder]);

  useEffect(() => {
      setLoading(false);

  }, [recordedAudioFileUploaded]);

  useEffect(() => {
    recordVoiceMessage();
  }, []);


  useEffect(() => {
    if (audioStream) {
      const mediaRecorder = new MediaRecorder(audioStream, {mimeType: 'audio/webm'});

      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener('dataavailable', event => {

          audioChunks.push(event.data);

          const audioBlob = new Blob(audioChunks, {type: 'audio/webm'});
          const file = new File(audioChunks, 'recording.mp3', {
            type: audioBlob.type,
            lastModified: Date.now(),
          });

          setLoading(true);
          getSavedAudio(file);
        
      });

      mediaRecorder.addEventListener('pause', () => {
        isVoiceRecordingPaused(true);
      });

      setMediaRecorder(mediaRecorder);
    }
  }, [audioStream]);

  const recordVoiceMessage = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    setAudioStream(stream);
  };

  const pauseRecording = () => {
    mediaRecorder.requestData();
    mediaRecorder.pause();
  };

  const cancelRecording = () => {
    audioRecordingCanceledUpdate(true);
    setVoiceRecordingOn(false)
    setAudioStream(null);
 
    audioStream.getTracks().forEach(track => track.stop());
    mediaRecorder.stop();
  };

  return (
    <div className={`${styles.container} ${loading ? styles.loadingContainer : ''}`}>
      {!loading && (
        <button type="button" className={`${styles.audioButtons} ${styles.cancelButton}`} onClick={cancelRecording}>
          <Cancel />
        </button>
      )}

      {!recordedAudioFileUploaded && !loading && (
        <AudioStream pauseRecording={pauseRecording} audioStream={audioStream} />
      )}

      {loading && <SimpleLoader />}

      {recordedAudioFileUploaded && (
        <div className={styles.audioComponent}>
          <AudioClip audioUrl={recordedAudioFileUploaded} />
        </div>
      )}
    </div>
  );
}
