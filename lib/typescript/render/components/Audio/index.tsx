import React, {useRef, useEffect, useState} from 'react';
import styles from './index.module.scss';
import {ReactComponent as PlayIcon} from 'assets/images/icons/play.svg';
import {ReactComponent as PauseIcon} from 'assets/images/icons/pause.svg';
import {ReactComponent as StopIcon} from 'assets/images/icons/stop.svg';
import {ReactComponent as DownloadIcon} from 'assets/images/icons/download.svg';

type AudioRenderProps = {
  audioUrl: string;
};

export const Audio = ({audioUrl}: AudioRenderProps) => {
  const player = useRef(null);
  const [duration, setDuration] = useState<number | string>('');

  console.log(duration);

  useEffect(() => {
    player.current?.load();

    setTimeout(() => {
      const totalTime = Number((player.current?.duration / 100).toFixed(2));
      if (typeof totalTime === 'number' && !isNaN(totalTime)) {
        setDuration(Number(totalTime));
      }
    }, 200);
  }, [player]);

  const playAudio = () => {
    player.current?.play();
  };

  const pauseAudio = () => {
    player.current?.pause();
  };

  const stopAudio = () => {
    if (player && player.current) {
      player.current?.pause();
      player.current.currentTime = 0;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.player}>
        <audio ref={player} src={audioUrl} />
        <div className={styles.buttonsContainer}>
          <button>
            <PlayIcon onClick={playAudio} />
          </button>
          <button>
            <PauseIcon onClick={pauseAudio} />
          </button>
          <button>
            <StopIcon onClick={stopAudio} />
          </button>
          <a href={audioUrl} download>
            <DownloadIcon />
          </a>
        </div>
        {duration && duration !== 0 && <span>{duration}</span>}
      </div>
    </div>
  );
};
