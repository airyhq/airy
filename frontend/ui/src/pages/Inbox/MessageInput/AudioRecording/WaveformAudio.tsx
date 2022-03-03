import React, {useState, useEffect, useRef} from 'react';

type WaveformAudioProps = {
  audioData: number[];
};

export function WaveformAudio({audioData}: WaveformAudioProps) {
  const canvas = useRef(null);
  const [context, setContext] = useState(null);
  const [barWidth, setBarWidth] = useState(3);
  const [barTotalCount, setBarTotalCount] = useState(57);
  const maxFrequencyValue = 255;
  const canvasHeight = 40;

  useEffect(() => {
    if (window.innerWidth > 2000) {
      setBarTotalCount(90);
      setBarWidth(4);
    }
  }, []);

  useEffect(() => {
    if (canvas && canvas.current) {
      setContext(canvas.current.getContext('2d'));
      canvas.current.style.width = '100%';
      canvas.current.style.height = canvasHeight + 'px';
      canvas.current.width = canvas.current.offsetWidth;
      canvas.current.height = canvas.current.offsetHeight;
    }
  }, [canvas]);

  useEffect(() => {
    if (audioData && context) {
      context.clearRect(0, 0, canvas.current.width, canvas.current.height);
      visualizeAudioRecording();
    }
  }, [context, audioData]);

  const visualizeAudioRecording = () => {
    const canvasHeight = canvas.current.height;
    const singleBarSize = canvas.current.width / barTotalCount;

    context.lineWidth = barWidth;
    context.strokeStyle = '#1578D4'; //Airy blue
    context.lineCap = 'round';

    let x = barWidth * 2;
    for (let i = 0; i < barTotalCount; i++) {
      const freqHeight = (audioData[i] / maxFrequencyValue) * canvasHeight;
      const baseHeight = canvasHeight / 8;
      const yStartingPoint = canvasHeight / 2 - freqHeight / 2 - baseHeight / 2;
      const yEndPoint = yStartingPoint + freqHeight + baseHeight;

      context.beginPath();
      context.moveTo(x, yStartingPoint);
      context.lineTo(x, yEndPoint);
      context.stroke();
      x += singleBarSize;
    }
  };

  return <canvas ref={canvas}></canvas>;
}
