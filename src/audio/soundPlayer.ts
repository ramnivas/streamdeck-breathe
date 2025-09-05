import streamDeck from "@elgato/streamdeck";
import { readFileSync } from "fs";
import Speaker from "speaker";
import * as WavDecoder from "wav-decoder";

export class SoundPlayer {
	private wavFilePath: string;
	private audioData?: WavDecoder.AudioData;
	private pcmData?: Buffer;
	private loadingPromise?: Promise<void>;

	constructor(wavFilePath: string) {
		this.wavFilePath = wavFilePath;
	}

	private async ensureAudioLoaded(): Promise<void> {
		if (this.audioData && this.pcmData) {
			return; // Already loaded
		}

		// Prevent race condition - return existing loading promise
		if (this.loadingPromise) {
			return this.loadingPromise;
		}

		this.loadingPromise = this.loadAudio();
		return this.loadingPromise;
	}

	private async loadAudio(): Promise<void> {
		try {
			// Read and decode the WAV file
			const buffer = readFileSync(this.wavFilePath);
			this.audioData = await WavDecoder.decode(buffer);
			
			streamDeck.logger.debug('Decoded audio:', {
				sampleRate: this.audioData.sampleRate,
				channels: this.audioData.numberOfChannels,
				length: this.audioData.length
			});
			
			// Pre-convert float samples to 16-bit PCM
			const samplesPerChannel = this.audioData.length;
			const pcmArray = new Int16Array(samplesPerChannel * this.audioData.numberOfChannels);
			
			if (this.audioData.numberOfChannels === 1) {
				// Mono: direct conversion
				const samples = this.audioData.channelData[0];
				for (let i = 0; i < samplesPerChannel; i++) {
					pcmArray[i] = Math.round(samples[i] * 32767);
				}
			} else if (this.audioData.numberOfChannels === 2) {
				// Stereo: interleave left and right channels
				const leftSamples = this.audioData.channelData[0];
				const rightSamples = this.audioData.channelData[1];
				for (let i = 0; i < samplesPerChannel; i++) {
					pcmArray[i * 2] = Math.round(leftSamples[i] * 32767);
					pcmArray[i * 2 + 1] = Math.round(rightSamples[i] * 32767);
				}
			}
			
			this.pcmData = Buffer.from(pcmArray.buffer);
			streamDeck.logger.debug('Audio loaded and cached');
			
		} catch (error) {
			streamDeck.logger.error('Error loading and decoding WAV file:', error);
			// Reset loading promise so retry is possible
			this.loadingPromise = undefined;
			throw error;
		}
	}

	async playSound(enabled: boolean): Promise<void> {
		if (!enabled) {
			streamDeck.logger.debug('Sound disabled, skipping playback');
			return;
		}
		
		try {
			// Ensure audio is loaded on first play
			await this.ensureAudioLoaded();
			
			// Create speaker with cached audio format
			const speaker = new Speaker({
				channels: this.audioData!.numberOfChannels,
				bitDepth: 16,
				sampleRate: this.audioData!.sampleRate,
			});
			
			// Setup event handlers before writing data
			speaker.on('error', (error: any) => {
				streamDeck.logger.error('Speaker error:', error);
			});
			
			speaker.on('open', () => {
				streamDeck.logger.debug('Speaker opened');
			});
			
			speaker.on('close', () => {
				streamDeck.logger.debug('Speaker closed');
			});
			
			streamDeck.logger.debug('Created speaker instance');
			
			// Write pre-processed PCM data to speaker
			speaker.write(this.pcmData!);
			speaker.end();
			
			streamDeck.logger.debug('Audio data written to speaker');
			
		} catch (error) {
			// Don't crash the plugin if audio fails - just log the error
			streamDeck.logger.error('Error playing sound:', error);
		}
	}
}