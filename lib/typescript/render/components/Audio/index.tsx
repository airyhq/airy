import React, {useRef, useState} from 'react';
import styles from './index.module.scss';
import {ReactComponent as PlayIcon} from 'assets/images/icons/play.svg';
import {ReactComponent as PauseIcon} from 'assets/images/icons/pause.svg';
import {ReactComponent as FileAudioIcon} from 'assets/images/icons/fileAudio.svg';
import {ReactComponent as DownloadIcon} from 'assets/images/icons/download.svg';
import {formatSecondsAsTime} from 'dates';

type AudioRenderProps = {
  audioUrl: string;
};

export const Audio = ({audioUrl}: AudioRenderProps) => {
  const player = useRef(null);
  const [duration, setDuration] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);

  const displayTotalTime = () => {
    const totalTime = Math.floor(player.current?.duration);

    const formattedTotalTime = formatSecondsAsTime(totalTime);
    setDuration(formattedTotalTime);
  };

  const updateAudioTime = () => {
    const currentTime = Math.floor(player.current?.currentTime);

    if (audioPlaying && !isNaN(currentTime)) {
      const formattedCurrentTime = formatSecondsAsTime(currentTime);
      setDuration(formattedCurrentTime);
    }
  };

  const resetIconAndTime = () => {
    setAudioPlaying(false);
    displayTotalTime();
  };

  const playAudio = () => {
    player.current?.play();
    setAudioPlaying(true);
  };

  const pauseAudio = () => {
    player.current?.pause();
    setAudioPlaying(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.player}>
        <audio
          ref={player}
          src={audioUrl}
          onTimeUpdate={updateAudioTime}
          onEnded={resetIconAndTime}
          onLoadedMetadata={displayTotalTime}
        />
        <FileAudioIcon />
        <div className={styles.buttonsContainer}>
          <button type="button">{audioPlaying ? <PauseIcon onClick={pauseAudio} /> : <PlayIcon onClick={playAudio} />}</button>
          <a href={audioUrl} target="_blank" rel="noopener noreferrer" download>
            <DownloadIcon />
          </a>
        </div>
        {duration && <span className={styles.audioTime}>{duration}</span>}
      </div>
    </div>
  );
};
