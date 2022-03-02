import React, {useState, useEffect, useRef} from 'react';
import {AudioStream} from './AudioStream';
import {AudioClip} from 'components';
import styles from './index.module.scss';
import {ReactComponent as Cancel} from 'assets/images/icons/cancelCross.svg';
import {uploadMedia} from '../../../../services/mediaUploader';
import {SimpleLoader} from 'components';
import AudioRecorder from 'audio-recorder-polyfill';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export function AudioRecording({
  recordingResumed,
  audioRecordingCanceledUpdate,
  isVoiceRecordingPaused,
  setAudioRecordingPreviewLoading,
  setFileUploadErrorPopUp,
  getUploadedAudioRecordingFile,
  audioRecordingSent,
  setRecordingResumed,
}) {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [savedAudioRecording, setSavedAudioRecording] = useState<File | null>(null);
  const [recordedAudioFileUploaded, setRecordedAudioFileUploaded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  window.MediaRecorder = AudioRecorder;

  useEffect(() => {
    let abort = false;

    const startVoiceRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setAudioStream(stream);
    };

    if (!abort) {
      console.log('!abort, fetching');
      startVoiceRecording();
    }

    return () => {
      abort = true;
    };
  }, []);

  const getMimeTypeForBrowser = () => {
    let options;

    if (MediaRecorder.isTypeSupported('audio/mp3')) {
      options = 'audio/mp3';
    } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
      options = 'audio/ogg';
    } else if (MediaRecorder.isTypeSupported('audio/mpeg audio/x-mpeg')) {
      options = 'audio/mpeg audio/x-mpeg';
    } else if (MediaRecorder.isTypeSupported('audio/mp4;codecs=opus')) {
      //safari
      options = 'audio/mp4;codecs=opus';
    } else if (MediaRecorder.isTypeSupported('audio/webm')) {
      //chrome + firefox
      options = 'audio/webm';
    } 

    return options;
  };

  useEffect(() => {
    if (audioStream && !audioRecordingSent) {
      console.log('audioStream', audioStream);

      const options = getMimeTypeForBrowser();
      console.log('OPTIONS', options);

      const mediaRecorder = new MediaRecorder(audioStream);
      console.log('mediaRecorder', mediaRecorder);

      mediaRecorder.start();
      setMediaRecorder(mediaRecorder);

      const audioChunks = [];

      const getAudioFile = event => {
        audioChunks.push(event.data);

        const audioBlob = new Blob(audioChunks);
        console.log('audioBlob.type', audioBlob.type);
        const file = new File(audioChunks, 'recording.mp3', {
          type: audioBlob.type,
          lastModified: Date.now(),
        });

        console.log('file dataRequest', file);

        setSavedAudioRecording(file);
      };

      mediaRecorder.addEventListener('dataavailable', getAudioFile);

      return () => mediaRecorder.removeEventListener('dataavailable', getAudioFile);
    }
  }, [audioStream]);

  useEffect(() => {
    if (recordingResumed && mediaRecorder) {
      setRecordedAudioFileUploaded(null);
      mediaRecorder.resume();
    }
  }, [recordingResumed, mediaRecorder]);

  useEffect(() => {
    console.log('audioRecordingSent', audioRecordingSent);
    if (audioRecordingSent) {
      console.log('audioRecordingSent - CANCEL', audioRecordingSent);
      cancelRecording();
    }
  }, [audioRecordingSent]);

  useEffect(() => {
    console.log('AUDIORECORDING loading', loading);
    if (loading) {
      setAudioRecordingPreviewLoading(true);
    } else {
      setAudioRecordingPreviewLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (savedAudioRecording && !audioRecordingSent) {
      let isRequestAborted = false;

      if (!isRequestAborted) {
        setLoading(true);
        uploadMedia(savedAudioRecording)
          .then((response: {mediaUrl: string}) => {
            console.log('uploadedMedia', response.mediaUrl);
            setRecordedAudioFileUploaded(response.mediaUrl);
            getUploadedAudioRecordingFile(response.mediaUrl);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            cancelRecording();
            setFileUploadErrorPopUp('Failed to load the audio recording. Please try again later.');
          });
      }
      return () => {
        isRequestAborted = true;
      };
    }
  }, [savedAudioRecording, audioRecordingSent]);

  const pauseRecording = () => {
    mediaRecorder.requestData();
    mediaRecorder.pause();
    isVoiceRecordingPaused(true);
    setRecordingResumed(false);
  };

  const cancelRecording = () => {
    setRecordedAudioFileUploaded(null);

    audioStream.getTracks().forEach(track => track.stop());
    //mediaRecorder.stop();

    setAudioStream(null);
    audioRecordingCanceledUpdate(true);
  };

  return (
    <div className={`${styles.container} ${loading ? styles.loadingContainer : ''}`}>
      {!loading && (
        <button type="button" className={`${styles.audioButtons} ${styles.cancelButton}`} onClick={cancelRecording}>
          <Cancel />
        </button>
      )}

      {!recordedAudioFileUploaded && !loading && audioStream && (
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
