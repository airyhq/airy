import React, {useState, useEffect} from 'react';
import {AudioStream} from './AudioStream';
import {AudioClip, SimpleLoader} from 'components';
import {uploadMedia} from '../../../../services/mediaUploader';
import {ReactComponent as Cancel} from 'assets/images/icons/cancelCross.svg';
import AudioRecorder from 'audio-recorder-polyfill';
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder';
import styles from './index.module.scss';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
    MediaRecorder: typeof MediaRecorder;
  }
}

AudioRecorder.encoder = mpegEncoder;
AudioRecorder.prototype.mimeType = 'audio/mpeg';
window.MediaRecorder = AudioRecorder;

type AudioRecordingProps = {
  fetchMediaRecorder: (mediaRecorder: MediaRecorder) => void;
  isAudioRecordingPaused: (isPaused: boolean) => void;
  setAudioRecordingPreviewLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getUploadedAudioRecordingFile: (fileUrl: string) => void;
  audioRecordingResumed: boolean;
  setAudioRecordingResumed: React.Dispatch<React.SetStateAction<boolean>>;
  audioRecordingSent: boolean;
  audioRecordingCanceledUpdate: (isCanceled: boolean) => void;
  setErrorPopUp: React.Dispatch<React.SetStateAction<string>>;
};

export function AudioRecording({
  fetchMediaRecorder,
  isAudioRecordingPaused,
  setAudioRecordingPreviewLoading,
  getUploadedAudioRecordingFile,
  audioRecordingResumed,
  setAudioRecordingResumed,
  audioRecordingSent,
  audioRecordingCanceledUpdate,
  setErrorPopUp,
}: AudioRecordingProps) {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [savedAudioRecording, setSavedAudioRecording] = useState<File | null>(null);
  const [audioRecordingFileUploaded, setAudioRecordingFileUploaded] = useState<string | null>(null);
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
        setErrorPopUp(
          'Microphone access denied. Check your browser settings to make sure Airy has permission to access your microphone, and try again.'
        );
      }
    };

    if (!abort) {
      startVoiceRecording();
    }

    return () => {
      abort = true;
    };
  }, []);

  useEffect(() => {
    if (audioStream && !audioRecordingSent) {
      const mediaRecorder = new MediaRecorder(audioStream);
      setMediaRecorder(mediaRecorder);
      fetchMediaRecorder(mediaRecorder);

      mediaRecorder.start();

      const audioChunks = [];

      const getAudioFile = event => {
        audioChunks.push(event.data);

        const audioBlob = new Blob(audioChunks);

        const file = new File(audioChunks, 'recording.mp3', {
          type: audioBlob.type,
          lastModified: Date.now(),
        });

        setSavedAudioRecording(file);
      };

      mediaRecorder.addEventListener('dataavailable', getAudioFile);

      return () => {
        mediaRecorder.removeEventListener('dataavailable', getAudioFile);
      };
    }
  }, [audioStream]);

  useEffect(() => {
    if (savedAudioRecording && !audioRecordingSent) {
      let isRequestAborted = false;

      if (!isRequestAborted) {
        setLoading(true);
        uploadMedia(savedAudioRecording)
          .then((response: {mediaUrl: string}) => {
            setAudioRecordingFileUploaded(response.mediaUrl);
            getUploadedAudioRecordingFile(response.mediaUrl);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            cancelRecording();
            setErrorPopUp('Failed to upload the audio recording. Please try again later.');
          });
      }
      return () => {
        isRequestAborted = true;
      };
    }
  }, [savedAudioRecording, audioRecordingSent]);

  useEffect(() => {
    if (loading) {
      setAudioRecordingPreviewLoading(true);
    } else {
      setAudioRecordingPreviewLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (audioRecordingResumed && mediaRecorder) {
      setAudioRecordingFileUploaded(null);
      mediaRecorder.resume();
    }
  }, [audioRecordingResumed, mediaRecorder]);

  useEffect(() => {
    if (audioRecordingSent) {
      cancelRecording();
    }
  }, [audioRecordingSent]);

  const pauseRecording = () => {
    mediaRecorder.requestData();
    mediaRecorder.pause();
    isAudioRecordingPaused(true);
    setAudioRecordingResumed(false);
  };

  const cancelRecording = () => {
    setAudioRecordingFileUploaded(null);

    mediaRecorder.stop();
    mediaRecorder.stream.getTracks()[0].stop();

    setAudioStream(null);
    audioRecordingCanceledUpdate(true);
  };

  return (
    <div className={`${styles.container} ${loading ? styles.loading : ''}`}>
      {!loading && (
        <button type="button" className={`${styles.audioButtons} ${styles.cancelButton}`} onClick={cancelRecording}>
          <Cancel />
        </button>
      )}

      {!audioRecordingFileUploaded && !loading && audioStream && (
        <AudioStream pauseRecording={pauseRecording} audioStream={audioStream} />
      )}

      {loading && <SimpleLoader />}

      {audioRecordingFileUploaded && (
        <div className={styles.audioComponent}>
          <AudioClip audioUrl={audioRecordingFileUploaded} />
        </div>
      )}
    </div>
  );
}
