import React, {useState, useEffect, useRef} from 'react';
import {AudioStream} from './AudioStream';
import {AudioClip} from 'components';
import styles from './index.module.scss';
import {ReactComponent as Cancel} from 'assets/images/icons/cancelCross.svg';
import {uploadMedia} from '../../../../services/mediaUploader';
import {SimpleLoader} from 'components';
import AudioRecorder from 'audio-recorder-polyfill'
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder'

AudioRecorder.encoder = mpegEncoder;
AudioRecorder.prototype.mimeType = 'audio/mpeg';
window.MediaRecorder = AudioRecorder;

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
  setErrorPopUp,
  getUploadedAudioRecordingFile,
  audioRecordingSent,
  setRecordingResumed,
}) {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [savedAudioRecording, setSavedAudioRecording] = useState<File | null>(null);
  const [recordedAudioFileUploaded, setRecordedAudioFileUploaded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let abort = false;

    const startVoiceRecording = async () => {

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
  
        setAudioStream(stream);

      } catch {
        audioRecordingCanceledUpdate(true);
        setErrorPopUp('Microphone access denied. Check your browser settings to make sure Airy has permission to access your microphone, and try again.');
      }

    };

    if (!abort) {
      console.log('!abort, fetching');
      startVoiceRecording();
    }

    return () => {
      abort = true;
    };
  }, []);



  useEffect(() => {
    if (audioStream && !audioRecordingSent) {
   
      const mediaRecorder = new MediaRecorder(audioStream);
      console.log('mediaRecorder', mediaRecorder);
      setMediaRecorder(mediaRecorder);

      mediaRecorder.start();

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

      return () => {
        mediaRecorder.removeEventListener('dataavailable', getAudioFile);
        console.log('unmount STOP');
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks()[0].stop();
      }
    }
  }, [audioStream]);

  useEffect(() => {
    if (recordingResumed && mediaRecorder) {
      setRecordedAudioFileUploaded(null);
      mediaRecorder.resume();
      console.log('mediaRecorder.resumed()');
      console.log(mediaRecorder)
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
        console.log('savedAudioRecording', savedAudioRecording);
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
            setErrorPopUp('Failed to load the audio recording. Please try again later.');
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

    mediaRecorder.stop();
    mediaRecorder.stream.getTracks()[0].stop()

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
