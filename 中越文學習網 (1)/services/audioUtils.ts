/**
 * Decodes a base64 string into a Uint8Array.
 */
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM data from Gemini into an AudioBuffer.
 * Gemini TTS output is typically 24kHz.
 */
export async function decodeAudioData(
  base64Data: string,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const bytes = decodeBase64(base64Data);
  const dataInt16 = new Int16Array(bytes.buffer);
  
  // Calculate frame count based on Int16 data (2 bytes per sample)
  const frameCount = dataInt16.length / numChannels;
  
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert Int16 (-32768 to 32767) to Float32 (-1.0 to 1.0)
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export async function playAudioBuffer(buffer: AudioBuffer, ctx: AudioContext): Promise<void> {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
}

/**
 * Uses the browser's built-in Web Speech API to speak text.
 * Falls back to default voice if specific Vietnamese voice isn't found,
 * but requests 'vi-VN' locale.
 */
export const playBrowserTTS = (text: string, onEnd?: () => void) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Web Speech API not supported in this browser.');
    onEnd?.();
    return;
  }

  // Cancel any currently playing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN'; // Request Vietnamese
  utterance.rate = 0.85; // Slightly slower for learning purposes
  
  // Clean text for browser TTS (remove parenthesis content if any leaked through)
  // Although the service cleaner is robust, browser TTS is sensitive to mixed languages
  utterance.text = text.replace(/[\u4e00-\u9fa5]/g, '').replace(/\(.*?\)/g, '').trim();

  // Try to select a high-quality Vietnamese voice if available (e.g., Google Tiếng Việt, Microsoft HoaiMy)
  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(v => v.lang.includes('vi'));
  if (viVoice) {
    utterance.voice = viVoice;
  }

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    console.error('Browser TTS Error:', e);
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
};