import {CanvasWaveformPaths} from './setUpAudioWaveform';

const greyProgressBarColor = '#C0D0D5';
const initialBarsColor = 'white';

const changeColorBarSegment = (ctx, path, color) => {
  ctx.strokeStyle = color;
  ctx.stroke(path);
};

export const colorProgressBars = (
  step: number,
  count: number,
  setCount: React.Dispatch<React.SetStateAction<number>>,
  paths: CanvasWaveformPaths,
  ctx: CanvasRenderingContext2D
) => {
  let bar2Dpath;
  if (count === 0 && step === 0) {
    bar2Dpath = paths['path' + count];
    changeColorBarSegment(ctx, bar2Dpath, greyProgressBarColor);
  } else {
    for (let i = count; i < step; i++) {
      bar2Dpath = paths['path' + i];
      changeColorBarSegment(ctx, bar2Dpath, greyProgressBarColor);
    }
  }

  setCount(step);
};

export const colorNextBarsGrey = (
  prevCount: number,
  updatedCount: number,
  setCount: React.Dispatch<React.SetStateAction<number>>,
  paths: CanvasWaveformPaths,
  ctx: CanvasRenderingContext2D
) => {
  let bar2Dpath;
  for (let i = prevCount; i < updatedCount; i++) {
    bar2Dpath = paths['path' + i];
    changeColorBarSegment(ctx, bar2Dpath, greyProgressBarColor);
  }
  setCount(updatedCount);
};

export const colorPlaybackBarsWhite = (prevCount: number, updatedCount: number, setCount, ctx, paths) => {
  let bar2Dpath;
  for (let i = prevCount; i >= updatedCount; i--) {
    bar2Dpath = paths['path' + i];
    changeColorBarSegment(ctx, bar2Dpath, initialBarsColor);
  }
  setCount(updatedCount);
};
