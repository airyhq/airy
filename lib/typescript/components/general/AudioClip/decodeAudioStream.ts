import React from 'react';
import {formatAudioTime} from './formatAudioTime';

export const decodeAudioStream = async (
  audioUrl: string,
  abortController: AbortController,
  setDuration: React.Dispatch<React.SetStateAction<number>>,
  setFormattedDuration: React.Dispatch<React.SetStateAction<string>>,
  totalBars: number
) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  try {
    const readableStream = await fetch(audioUrl, {signal: abortController.signal});
    const arrayBuffer = await readableStream.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    setDuration(audioBuffer.duration);
    const formattedDuration = formatAudioTime(audioBuffer.duration);
    setFormattedDuration(formattedDuration);

    return filterData(audioBuffer, totalBars);
  } catch (error) {
    return error;
  }
};

export const filterData = (audioBuffer: AudioBuffer, totalBars: number) => {
  const channelData = audioBuffer.getChannelData(0);
  const sampleNumPerBar = Math.floor(channelData.length / totalBars);
  const filteredData = [];

  for (let i = 0; i < totalBars; i++) {
    const blockStart = sampleNumPerBar * i;
    let sum = 0;

    for (let j = 0; j < sampleNumPerBar; j++) {
      sum = sum + Math.abs(channelData[blockStart + j]);
    }

    const average = Number((sum / sampleNumPerBar).toFixed(2));
    const averageSample = Math.round(average * 100);

    filteredData.push(averageSample);
  }

  const multiplier = Math.pow(Math.max(...filteredData), 0);
  const audioData = filteredData.map(n => n * multiplier);

  return audioData;
};
