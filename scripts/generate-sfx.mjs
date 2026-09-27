// 効果音（WAV）をプログラムで合成して public/sfx/ に書き出すスクリプト。
// 外部素材を使わないので著作権の心配がありません。
// 実行: npm run sfx
import {writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sfx');
mkdirSync(outDir, {recursive: true});

// 疑似乱数（毎回同じ音になるように固定シード）
let seed = 12345;
const rand = () => {
	seed = (seed * 1664525 + 1013904223) >>> 0;
	return seed / 4294967296 * 2 - 1;
};

const writeWav = (name, samples) => {
	const peak = Math.max(...samples.map(Math.abs), 1e-6);
	const norm = 0.9 / peak;
	const data = Buffer.alloc(samples.length * 2);
	samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s * norm)) * 32767), i * 2));
	const header = Buffer.alloc(44);
	header.write('RIFF', 0);
	header.writeUInt32LE(36 + data.length, 4);
	header.write('WAVE', 8);
	header.write('fmt ', 12);
	header.writeUInt32LE(16, 16);
	header.writeUInt16LE(1, 20);
	header.writeUInt16LE(1, 22);
	header.writeUInt32LE(SR, 24);
	header.writeUInt32LE(SR * 2, 28);
	header.writeUInt16LE(2, 32);
	header.writeUInt16LE(16, 34);
	header.write('data', 36);
	header.writeUInt32LE(data.length, 40);
	writeFileSync(join(outDir, name), Buffer.concat([header, data]));
	console.log('wrote', name);
};

const make = (sec, fn) => Array.from({length: Math.floor(sec * SR)}, (_, i) => fn(i / SR, i));

// 1極ローパス
const lowpass = (arr, alpha) => {
	let y = 0;
	return arr.map((x) => (y += alpha * (x - y)));
};

// 水しぶき：ノイズを減衰させる
writeWav('splash.wav', lowpass(make(1.1, (t) => rand() * Math.exp(-t * 4) * Math.min(1, t * 40)), 0.35));

// シュッ：高めのノイズが素早く通り過ぎる
{
	let y = 0;
	writeWav('whoosh.wav', make(0.4, (t) => {
		const env = Math.sin(Math.PI * Math.min(1, t / 0.4)) ** 2;
		const alpha = 0.15 + 0.6 * (t / 0.4);
		y += alpha * (rand() - y);
		return y * env;
	}));
}

// 着地音：低い「トン」
writeWav('land.wav', make(0.35, (t) => {
	const f = 110 * Math.exp(-t * 6);
	return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 14) + rand() * 0.15 * Math.exp(-t * 40);
}));

// ジャーン：明るい和音
writeWav('jaan.wav', make(1.6, (t) => {
	const notes = [523.25, 659.25, 783.99, 1046.5];
	const env = Math.min(1, t * 60) * Math.exp(-t * 2.2);
	return notes.reduce((acc, f) => acc + Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t) + 0.15 * Math.sin(6 * Math.PI * f * t), 0) * env;
}));

// チェック：軽い「ピコッ」
writeWav('check.wav', make(0.22, (t) => {
	const f = t < 0.07 ? 1318.5 : 1760;
	const local = t < 0.07 ? t : t - 0.07;
	return Math.sin(2 * Math.PI * f * t) * Math.exp(-local * 22) * Math.min(1, local * 400);
}));

// 目覚まし時計：やさしい「ピピピッ」
writeWav('alarm.wav', make(1.3, (t) => {
	const on = (t % 0.26) < 0.13 && (t % 1.04) < 0.78;
	return on ? Math.sin(2 * Math.PI * 1760 * t) * 0.8 + Math.sin(2 * Math.PI * 3520 * t) * 0.2 : 0;
}));

// OK：上がっていくチャイム
writeWav('ok.wav', make(1.2, (t) => {
	const notes = [783.99, 987.77, 1174.66, 1567.98];
	return notes.reduce((acc, f, k) => {
		const st = k * 0.09;
		if (t < st) return acc;
		const lt = t - st;
		return acc + Math.sin(2 * Math.PI * f * lt) * Math.exp(-lt * 3.5) * Math.min(1, lt * 300);
	}, 0);
}));
