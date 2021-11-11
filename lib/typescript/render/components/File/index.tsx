import React from 'react';
import styles from './index.module.scss';
import {getFileName} from '../../services';
import {ReactComponent as FileDownloadIcon} from 'assets/images/icons/file-download.svg';

type FileRenderProps = {
  fileUrl: string;
  fileType?: string;
};

export const File = ({fileUrl, fileType}: FileRenderProps) => {
  const maxFileNameLength = 30;
  let fileName = getFileName(fileUrl);

  if (fileName.length >= maxFileNameLength) fileName = fileName.slice(-maxFileNameLength);

  if (fileType) fileName = `${fileName}.${fileType}`;

  return (
    <>
      <div className={styles.wrapper}>
        <a href={fileUrl} download={fileUrl} target="_blank" rel="noopener noreferrer">
          <div className={styles.container}>
            <FileDownloadIcon />
            {fileName}
          </div>
        </a>
      </div>
    </>
  );
};
