import React from 'react';

type AudioRenderProps = {
  audioUrl: string;
};

export const Audio = ({audioUrl}: AudioRenderProps) => {
  return <audio src={audioUrl} controls />;
};
