import {CanvasWaveformPaths} from './drawCanvasPaths';

const greyProgressBarColor = '#C0D0D5';

const changeColorBarSegment = (
  i: number,
  color: string,
  ctx: CanvasRenderingContext2D,
  barsSamplesPaths: CanvasWaveformPaths
) => {
  ctx.strokeStyle = color;
  ctx.stroke(barsSamplesPaths['path' + i]);
};

export const colorProgressBars = (
  step: number,
  count: number,
  ctx: CanvasRenderingContext2D,
  barsSamplesPaths: CanvasWaveformPaths,
  setCount: React.Dispatch<React.SetStateAction<number>>
) => {
  colorNextBarsGrey(count, step, ctx, barsSamplesPaths, setCount);
  setCount(step);
};

export const colorNextBarsGrey = (
  prevCount: number,
  updatedCount: number,
  ctx: CanvasRenderingContext2D,
  barsSamplesPaths: CanvasWaveformPaths,
  setCount: React.Dispatch<React.SetStateAction<number>>
) => {
  for (let i = prevCount; i < updatedCount; i++) {
    changeColorBarSegment(i, greyProgressBarColor, ctx, barsSamplesPaths);
  }
  setCount(updatedCount);
};

export const colorPlaybackBarsWhite = (
  prevCount: number,
  updatedCount: number,
  ctx: CanvasRenderingContext2D,
  barsSamplesPaths: CanvasWaveformPaths,
  setCount: React.Dispatch<React.SetStateAction<number>>
) => {
  for (let i = prevCount; i >= updatedCount; i--) {
    changeColorBarSegment(i, 'white', ctx, barsSamplesPaths);
  }
  setCount(updatedCount);
};
