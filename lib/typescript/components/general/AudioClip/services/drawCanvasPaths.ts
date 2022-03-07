export interface CanvasWaveformPaths {
  path0: Path2D;
  path1: Path2D;
  path2: Path2D;
  path3: Path2D;
  path4: Path2D;
  path5: Path2D;
  path6: Path2D;
  path7: Path2D;
  path8: Path2D;
  path9: Path2D;
  path10: Path2D;
  path11: Path2D;
  path12: Path2D;
  path13: Path2D;
  path14: Path2D;
  path15: Path2D;
  path16: Path2D;
  path17: Path2D;
  path18: Path2D;
  path19: Path2D;
}

const canvasWidth = 174;
const canvasHeight = 40;
const barWidth = 3;

export const setUpCanvas = (context: CanvasRenderingContext2D, canvas: React.MutableRefObject<HTMLCanvasElement>) => {
  const ratio = window.devicePixelRatio;

  canvas.current.width = 174 * ratio;
  canvas.current.height = 40 * ratio;

  canvas.current.style.width = canvasWidth + 'px';
  canvas.current.style.height = canvasHeight + 'px';

  context.scale(ratio, ratio);

  context.translate(0, canvas.current.offsetHeight / 2);
  context.clearRect(0, 0, canvas.current.width, canvas.current.height);
};

export const drawBar = (
  i: number,
  x: number,
  height: number,
  isEven: number,
  color: string,
  ctx: CanvasRenderingContext2D,
  barsSamplesPaths: CanvasWaveformPaths,
  setCtx: React.Dispatch<React.SetStateAction<null | CanvasRenderingContext2D>>
) => {
  if (height <= 1) {
    height += 4;
  }

  if (height >= 20) {
    height = 18;
  }

  if (height <= 19 && height >= 18) {
    height -= 2;
  }

  if (x === 0) x = 2;

  height = isEven ? height : -height;

  ctx.lineWidth = barWidth;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';

  barsSamplesPaths['path' + i].moveTo(x, 0);
  barsSamplesPaths['path' + i].lineTo(x, height);
  ctx.stroke(barsSamplesPaths['path' + i]);
  barsSamplesPaths['path' + i].moveTo(x, 0);
  barsSamplesPaths['path' + i].lineTo(x, -height);

  ctx.stroke(barsSamplesPaths['path' + i]);
  setCtx(ctx);
};

export const drawAudioSampleBars = (
  freqData: number[],
  color: string,
  ctx: CanvasRenderingContext2D,
  canvas: React.MutableRefObject<HTMLCanvasElement>,
  barsSamplesPaths: CanvasWaveformPaths,
  setCtx: React.Dispatch<React.SetStateAction<null | CanvasRenderingContext2D>>
) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  const width = Math.round(canvas.current.offsetWidth / freqData.length);
  const canvasOffsetHeight = canvas.current.offsetHeight;

  let x: number;

  for (let i = 0; i < freqData.length; i++) {
    x = width * i;

    if (freqData[i] > canvasOffsetHeight / 2) {
      freqData[i] = canvasOffsetHeight / 2;
    }

    drawBar(i, x, freqData[i], (i + 1) % 2, color, ctx, barsSamplesPaths, setCtx);
  }
};
