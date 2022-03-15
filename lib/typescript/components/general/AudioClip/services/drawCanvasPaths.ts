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
const barPadding = 2;
const initialColorBars = 'white';

export const setUpCanvas = (context: CanvasRenderingContext2D, canvas: React.MutableRefObject<HTMLCanvasElement>) => {
  const ratio = window.devicePixelRatio;

  canvas.current.width = canvasWidth * ratio;
  canvas.current.height = canvasHeight * ratio;

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
  ctx: CanvasRenderingContext2D,
  barsSamplesPaths: CanvasWaveformPaths,
  setCanvasContext: React.Dispatch<React.SetStateAction<null | CanvasRenderingContext2D>>
) => {
  const halfCanvasHeight = canvasHeight / 2;
  const maxBarHeight = canvasHeight / 2 - barPadding;
  const barMinimumHeight = 4;

  if (height <= 1) {
    height += barMinimumHeight;
  }

  if (height >= halfCanvasHeight) {
    height = maxBarHeight;
  }

  if (height <= halfCanvasHeight - 1 && height >= halfCanvasHeight - barPadding) {
    height -= barPadding;
  }

  if (x === 0) x = barPadding;

  height = isEven ? height : -height;

  ctx.lineWidth = barWidth;
  ctx.strokeStyle = initialColorBars;
  ctx.lineCap = 'round';

  barsSamplesPaths['path' + i].moveTo(x, 0);
  barsSamplesPaths['path' + i].lineTo(x, height);
  ctx.stroke(barsSamplesPaths['path' + i]);
  barsSamplesPaths['path' + i].moveTo(x, 0);
  barsSamplesPaths['path' + i].lineTo(x, -height);

  ctx.stroke(barsSamplesPaths['path' + i]);
  setCanvasContext(ctx);
};

export const drawAudioSampleBars = (
  freqData: number[],
  ctx: CanvasRenderingContext2D,
  canvas: React.MutableRefObject<HTMLCanvasElement>,
  barsSamplesPaths: CanvasWaveformPaths,
  setCanvasContext: React.Dispatch<React.SetStateAction<null | CanvasRenderingContext2D>>
) => {
  const width = Math.round(canvas?.current?.offsetWidth / freqData.length);
  const canvasOffsetHeight = canvas?.current?.offsetHeight;

  let x: number;

  for (let i = 0; i < freqData.length; i++) {
    x = width * i;

    if (freqData[i] > canvasOffsetHeight / 2) {
      freqData[i] = canvasOffsetHeight / 2;
    }

    drawBar(i, x, freqData[i], (i + 1) % 2, ctx, barsSamplesPaths, setCanvasContext);
  }
};
