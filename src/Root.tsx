import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {LifeRoleVideo, LifeRoleVideoProps} from './LifeRoleVideo';
import {AUDIO, Availability, IMAGES, NO_ASSETS, SFX, sceneNarrationPath} from './data/assets';
import {
	DEFAULT_DURATIONS,
	FPS,
	HEIGHT,
	SCENE_ORDER,
	SceneDurations,
	WIDTH,
	sceneDelay,
	sceneTail,
	totalFrames,
} from './data/scenes';

/** public/ にファイルがあるかを確認（なければ false。例外は出さない） */
const exists = async (path: string): Promise<boolean> => {
	try {
		const res = await fetch(staticFile(path), {method: 'HEAD'});
		if (!res.ok) {
			return false;
		}
		// 開発サーバーが HTML（404 ページ等）を返した場合は「なし」とみなす
		const type = res.headers.get('content-type') ?? '';
		return !type.includes('text/html');
	} catch {
		return false;
	}
};

const checkAll = async <T extends Record<string, string>>(files: T) => {
	const entries = await Promise.all(Object.entries(files).map(async ([k, p]) => [k, await exists(p)] as const));
	return Object.fromEntries(entries) as Record<keyof T, boolean>;
};

const audioLength = async (path: string) => {
	try {
		return await getAudioDurationInSeconds(staticFile(path));
	} catch {
		return null;
	}
};

const calculateMetadata: CalculateMetadataFunction<LifeRoleVideoProps> = async ({props}) => {
	const sceneFiles = Object.fromEntries(SCENE_ORDER.map((k) => [k, sceneNarrationPath(k)]));
	const [images, sfx, sceneNarration, narration, bgm] = await Promise.all([
		checkAll(IMAGES),
		checkAll(SFX),
		checkAll(sceneFiles),
		exists(AUDIO.narration),
		exists(AUDIO.bgm),
	]);
	const assets: Availability = {images, sfx, sceneNarration, narration, bgm};

	// シーンごとの音声があれば「開始前の間 + 音声の長さ + 終了後の余裕」にシーンの長さを自動調整
	const durations: SceneDurations = {...DEFAULT_DURATIONS};
	for (const key of SCENE_ORDER) {
		if (sceneNarration[key]) {
			const len = await audioLength(sceneNarrationPath(key));
			if (len) {
				durations[key] = Math.ceil((sceneDelay(key) + len + sceneTail(key)) * FPS) / FPS;
			}
		}
	}

	// 1本のナレーションが動画より長い場合は、最後のシーンを伸ばして切れないようにする
	if (narration) {
		const len = await audioLength(AUDIO.narration);
		const total = totalFrames(durations) / FPS;
		if (len && len > total) {
			durations.ending += Math.ceil((len - total) * 10) / 10 + 0.5;
		}
	}

	return {
		durationInFrames: totalFrames(durations),
		props: {...props, assets, durations},
	};
};

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="LifeRoleVideo"
			component={LifeRoleVideo}
			durationInFrames={totalFrames(DEFAULT_DURATIONS)}
			fps={FPS}
			width={WIDTH}
			height={HEIGHT}
			defaultProps={{assets: NO_ASSETS, durations: DEFAULT_DURATIONS} satisfies LifeRoleVideoProps}
			calculateMetadata={calculateMetadata}
		/>
	);
};
