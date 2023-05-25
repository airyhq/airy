import React, {useEffect} from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';
import {calculateHeightOfCodeString} from '../../../../../services';

type MessageSectionProps = {
  code: string;
  editorMode: string;
  recalculateContainerHeight: (text: string) => void;
};

export const InfoSection = (props: MessageSectionProps) => {
  const {code, editorMode, recalculateContainerHeight} = props;

  useEffect(() => {
    recalculateContainerHeight(code);
  }, [code]);

  return (
    <MonacoEditor
      height={calculateHeightOfCodeString(code)}
      language="yaml"
      value={code}
      options={{
        scrollBeyondLastLine: false,
        readOnly: true,
        theme: editorMode,
      }}
    />
  );
};
