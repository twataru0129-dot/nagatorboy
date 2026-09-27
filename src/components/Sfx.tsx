import React from 'react';
import {Html5Audio, Sequence, staticFile} from 'remotion';
import {SFX, SfxKey, VOLUME} from '../data/assets';
import {useAssets} from './Contexts';

/** 効果音（ファイルがなければ何もしない） */
export const Sfx: React.FC<{name: SfxKey; at: number; volume?: number}> = ({name, at, volume = 1}) => {
	const assets = useAssets();
	if (!assets.sfx[name]) {
		return null;
	}
	return (
		<Sequence from={at} durationInFrames={90} layout="none" name={`SFX ${name}`}>
			<Html5Audio src={staticFile(SFX[name])} volume={VOLUME.sfx * volume} />
		</Sequence>
	);
};
