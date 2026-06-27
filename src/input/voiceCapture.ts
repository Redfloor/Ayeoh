const SAMPLE_RATE = 16000;
const BUFFER_SIZE = 4096;

function floatToPcm16(input: Float32Array): ArrayBuffer {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, input[i] ?? 0));
    output[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }
  return output.buffer;
}

export async function startVoiceCapture(): Promise<() => void> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
  const source = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
  const silentOutput = audioContext.createGain();
  silentOutput.gain.value = 0;

  processor.onaudioprocess = (event) => {
    const channelData = event.inputBuffer.getChannelData(0);
    window.ayeoh?.sendVoiceAudioChunk(floatToPcm16(channelData));
  };

  source.connect(processor);
  processor.connect(silentOutput);
  silentOutput.connect(audioContext.destination);

  return () => {
    processor.disconnect();
    source.disconnect();
    silentOutput.disconnect();
    stream.getTracks().forEach((track) => track.stop());
    void audioContext.close();
  };
}
