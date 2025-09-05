declare module 'wav-decoder' {
  export interface AudioData {
    sampleRate: number;
    numberOfChannels: number;
    length: number;
    channelData: Float32Array[];
  }

  export function decode(buffer: ArrayBuffer | Buffer): Promise<AudioData>;
}