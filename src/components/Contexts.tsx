import React, {createContext, useContext} from 'react';
import {Availability, NO_ASSETS} from '../data/assets';
import {FPS, SceneKey, SCENES} from '../data/scenes';

export const AssetContext = createContext<Availability>(NO_ASSETS);
export const useAssets = () => useContext(AssetContext);

type Timing = {
	key: SceneKey;
	durationInFrames: number;
	/** beats の拡大縮小率（シーンごとの音声で長さが変わった時） */
	scale: number;
};

const TimingContext = createContext<Timing | null>(null);

export const SceneTimingProvider: React.FC<{
	sceneKey: SceneKey;
	durationInFrames: number;
	scaleBeats: boolean;
	children: React.ReactNode;
}> = ({sceneKey, durationInFrames, scaleBeats, children}) => {
	const base = SCENES[sceneKey].duration * FPS;
	const scale = scaleBeats ? durationInFrames / base : 1;
	return (
		<TimingContext.Provider value={{key: sceneKey, durationInFrames, scale}}>{children}</TimingContext.Provider>
	);
};

/**
 * シーン内のタイミングを取得するフック
 * 例: const b = useBeats(); b('title') → 「title」が始まるフレーム
 */
export const useBeats = () => {
	const timing = useContext(TimingContext);
	if (!timing) {
		throw new Error('useBeats はシーンの中で使ってください');
	}
	const beats: Record<string, number> = SCENES[timing.key].beats;
	return (name: string, offsetSec = 0) => {
		const s = beats[name];
		if (s === undefined) {
			console.warn(`beat "${name}" が scenes.ts にありません`);
			return 0;
		}
		return Math.min(Math.round((s + offsetSec) * timing.scale * FPS), timing.durationInFrames - 1);
	};
};

/** このシーンの長さ（フレーム） */
export const useSceneDuration = () => {
	const timing = useContext(TimingContext);
	return timing?.durationInFrames ?? 1;
};
