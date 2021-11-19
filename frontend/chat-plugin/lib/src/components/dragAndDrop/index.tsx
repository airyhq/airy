import React, {ReactChild, ReactChildren, useState} from 'react';
import style from './index.module.scss';

type DragAndDropWrapperProps = {
  children: ReactChild | ReactChildren;
  setDragDropFile: (file: File) => void;
};

export const DragAndDropWrapper = (props: DragAndDropWrapperProps) => {
  const {children, setDragDropFile} = props;
  const [isFileDragged, setIsFileDragged] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setIsFileDragged(true);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setIsFileDragged(true);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    setDragDropFile(file);
    setIsFileDragged(false);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setIsFileDragged(false);
  };

  return (
    <div
      className={style.container}
      onDragEnter={e => handleDragEnter(e)}
      onDragOver={e => handleDragOver(e)}
      onDrop={e => handleFileDrop(e)}
      onDragLeave={e => handleDragLeave(e)}
    >
      {isFileDragged && (
        <div className={style.dragOverlay}>
          <h1>Drop Files Here</h1>
        </div>
      )}
      {children}
    </div>
  );
};
