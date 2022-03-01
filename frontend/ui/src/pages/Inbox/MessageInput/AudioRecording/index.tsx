import React, {useState, useEffect, useRef} from 'react';
import {AudioStream} from './AudioStream';
import {AudioClip} from 'components';
import styles from './index.module.scss';
import {ReactComponent as Cancel} from 'assets/images/icons/cancelCross.svg';
import {uploadMedia} from '../../../../services/mediaUploader';
import {SimpleLoader} from 'components';

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
  setAudioRecordingSentFinish
}) {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [savedAudioRecording, setSavedAudioRecording] = useState<File | null>(null);
  const [recordedAudioFileUploaded, setRecordedAudioFileUploaded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('recordingResumed resume', recordingResumed)
    //console.log('mediaRecorder resume', mediaRecorder)
    if (recordingResumed && mediaRecorder) {
      setRecordedAudioFileUploaded(null);
      mediaRecorder.resume();
      //setAudioStream(audioStream);
    }
  }, [recordingResumed, mediaRecorder]);

  useEffect(() => {
    console.log('AUDIORECORDING SENT', audioRecordingSent);
    if(audioRecordingSent){
      console.log('audioStream inside', audioStream);
      console.log('mediaRecorder', mediaRecorder);

      audioStream.getTracks().forEach(track => track.stop());
      //mediaRecorder.stop();

      setAudioStream(null);
      setRecordedAudioFileUploaded(null);
      setLoading(false);
      //setAudioRecordingPreviewLoading(false)
      //setAudioRecordingSentFinish(true);
  

    }

  }, [audioRecordingSent])

  useEffect(() => {
    console.log('AUDIORECORDING loading', loading);
    if (loading) {
      setAudioRecordingPreviewLoading(true);
    } else {
      setAudioRecordingPreviewLoading(false);
    }
  }, [loading]);


  useEffect(() => {
    recordVoiceMessage();
  }, []);

  useEffect(() => {
    if (audioStream) {
      console.log('audioStream', audioStream);
      const mediaRecorder = new MediaRecorder(audioStream, {mimeType: 'audio/webm'});
      console.log('mediaRecorder', mediaRecorder);

      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);

        const audioBlob = new Blob(audioChunks, {type: 'audio/webm'});
        const file = new File(audioChunks, 'recording.mp3', {
          type: audioBlob.type,
          lastModified: Date.now(),
        });

       
        setSavedAudioRecording(file);
      });

      setMediaRecorder(mediaRecorder);
    }
  }, [audioStream]);

  useEffect(() => {
    if (savedAudioRecording && !audioRecordingSent) {
      let isRequestAborted = false;
      setLoading(true);
      if (!isRequestAborted) {
        uploadMedia(savedAudioRecording)
          .then((response: {mediaUrl: string}) => {
            console.log('response.mediaUrl', response.mediaUrl);
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
  }, [savedAudioRecording]);

  const recordVoiceMessage = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    setAudioStream(stream);
  };

  const pauseRecording = () => {
    mediaRecorder.requestData();
    mediaRecorder.pause();
    isVoiceRecordingPaused(true);
  };

  const cancelRecording = () => {
    audioRecordingCanceledUpdate(true);
    setRecordedAudioFileUploaded(null);

    audioStream.getTracks().forEach(track => track.stop());
    //mediaRecorder.stop();

    setAudioStream(null);
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
