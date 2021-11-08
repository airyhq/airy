import React from 'react';
import styles from './index.module.scss';
import {getFileName} from '../../services';
import {ReactComponent as FileDownloadIcon} from 'assets/images/icons/file-download.svg';

type FileRenderProps = {
  fileUrl: string;
  fileName?: string;
};

export const File = ({fileUrl, fileName}: FileRenderProps) => {
  fileName = fileName ?? getFileName(fileUrl);

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
