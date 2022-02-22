import React, {useState, useEffect, useRef} from 'react';

export function WaveformAudio({audioData}) {
  const canvas = useRef(null);
  const [context, setContext] = useState(null);
  const maxFrequencyValue = 255;
  const barWidth = 2;
  const barTotalCount = 57;

  //find canvas width in pixel dynamically

  useEffect(() => {
    if (canvas && canvas.current) {
      setContext(canvas.current.getContext('2d'));
    }
  }, [canvas]);

  useEffect(() => {
    if (context !== null && audioData) {
      context.clearRect(0, 0, canvas.current.width, canvas.current.height);
      visualizeAudioRecording();
    }
  }, [context, audioData]);

  const visualizeAudioRecording = () => {
    const canvasHeight = canvas.current.height;
    const singleBarSize = canvas.current.width / barTotalCount;

    context.lineWidth = barWidth;
    context.strokeStyle = '#1578D4'; //use scss color
    context.lineCap = 'round';

    let x = barWidth;
    for (let i = 0; i < barTotalCount; i++) {
      const freqHeight = (audioData[i] / maxFrequencyValue) * canvasHeight;
      const y = canvasHeight / 2 - freqHeight / 2;

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y + freqHeight);
      context.stroke();
      x += singleBarSize;
    }
  };

  return <canvas ref={canvas} width="470" height="40"></canvas>;
}
