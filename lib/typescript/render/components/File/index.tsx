import React from 'react';
import styles from './index.module.scss';
import {getFileName} from '../../attachments';
import {ReactComponent as FileDownloadIcon} from 'assets/images/icons/file-download.svg';

type FileRenderProps = {
  fileUrl: string;
};

export const File = ({fileUrl}: FileRenderProps) => {
  const fileName = getFileName(fileUrl);

  return (
    <div className={styles.wrapper}>
      <a href={fileUrl} download={fileUrl} target="_blank" rel="noopener noreferrer">
        <div className={styles.container}>
          <FileDownloadIcon />
          {fileName}
        </div>
      </a>
    </div>
  );
};
