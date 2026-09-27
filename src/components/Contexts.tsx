import React, {createContext, useContext} from 'react';
import {Availability, NO_ASSETS} from '../data/assets';
import {FPS, SceneKey, SCENES, sceneDelay} from '../data/scenes';

export const AssetContext = createContext<Availability>(NO_ASSETS);
export const useAssets = () => useContext(AssetContext);

type Timing = {
	key: SceneKey;
	durationInFrames: number;
};

const TimingContext = createContext<Timing | null>(null);

export const SceneTimingProvider: React.FC<{
	sceneKey: SceneKey;
	durationInFrames: number;
	children: React.ReactNode;
}> = ({sceneKey, durationInFrames, children}) => (
	<TimingContext.Provider value={{key: sceneKey, durationInFrames}}>{children}</TimingContext.Provider>
);

/**
 * シーン内のタイミングを取得するフック
 * 例: const b = useBeats(); b('title') → 「title」が始まるフレーム（シーン開始から）
 * beats は「ナレーション開始からの秒数」なので、audioDelay を足してフレームに直す
 */
export const useBeats = () => {
	const timing = useContext(TimingContext);
	if (!timing) {
		throw new Error('useBeats はシーンの中で使ってください');
	}
	const beats: Record<string, number> = SCENES[timing.key].beats;
	const delay = sceneDelay(timing.key);
	return (name: string, offsetSec = 0) => {
		const s = beats[name];
		if (s === undefined) {
			console.warn(`beat "${name}" が scenes.ts にありません`);
			return 0;
		}
		return Math.max(0, Math.min(Math.round((delay + s + offsetSec) * FPS), timing.durationInFrames - 1));
	};
};

/** このシーンの長さ（フレーム） */
export const useSceneDuration = () => {
	const timing = useContext(TimingContext);
	return timing?.durationInFrames ?? 1;
};
