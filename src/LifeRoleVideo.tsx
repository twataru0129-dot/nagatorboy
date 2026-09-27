import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile} from 'remotion';
import {AssetContext, SceneTimingProvider} from './components/Contexts';
import {AUDIO, Availability, VOLUME, sceneNarrationPath} from './data/assets';
import {SceneDurations, SceneKey, buildTimeline} from './data/scenes';
import {loadFonts} from './fonts';
import {BathScene} from './scenes/BathScene';
import {BedScene} from './scenes/BedScene';
import {EndingScene} from './scenes/EndingScene';
import {FacilityScene} from './scenes/FacilityScene';
import {HealthScene} from './scenes/HealthScene';
import {IntroScene} from './scenes/IntroScene';
import {LinenReturnScene} from './scenes/LinenReturnScene';
import {LinenScene} from './scenes/LinenScene';
import {MorningScene} from './scenes/MorningScene';
import {ReportScene} from './scenes/ReportScene';
import {RoomCheckScene} from './scenes/RoomCheckScene';
import {FONT_FAMILY} from './theme';

loadFonts();

export type LifeRoleVideoProps = {
	assets: Availability;
	durations: SceneDurations;
};

const SCENE_COMPONENTS: Record<SceneKey, React.FC> = {
	intro: IntroScene,
	facility: FacilityScene,
	linen: LinenScene,
	bed: BedScene,
	bath: BathScene,
	health: HealthScene,
	morning: MorningScene,
	returnLinen: LinenReturnScene,
	roomCheck: RoomCheckScene,
	report: ReportScene,
	ending: EndingScene,
};

export const LifeRoleVideo: React.FC<LifeRoleVideoProps> = ({assets, durations}) => {
	const timeline = buildTimeline(durations);

	return (
		<AssetContext.Provider value={assets}>
			<AbsoluteFill style={{backgroundColor: '#fff', fontFamily: FONT_FAMILY}}>
				{timeline.map(({key, from, durationInFrames}) => {
					const Scene = SCENE_COMPONENTS[key];
					const hasSceneAudio = Boolean(assets.sceneNarration[key]);
					return (
						<Sequence key={key} from={from} durationInFrames={durationInFrames} name={key}>
							<SceneTimingProvider sceneKey={key} durationInFrames={durationInFrames} scaleBeats={hasSceneAudio}>
								<Scene />
							</SceneTimingProvider>
							{hasSceneAudio ? (
								<Html5Audio src={staticFile(sceneNarrationPath(key))} volume={VOLUME.narration} />
							) : null}
						</Sequence>
					);
				})}

				{/* 1本のナレーション音声（public/audio/narration.wav） */}
				{assets.narration ? <Html5Audio src={staticFile(AUDIO.narration)} volume={VOLUME.narration} /> : null}

				{/* BGM（public/audio/bgm.mp3 を置くと自動で小さく流れる） */}
				{assets.bgm ? <Html5Audio src={staticFile(AUDIO.bgm)} volume={VOLUME.bgm} loop /> : null}
			</AbsoluteFill>
		</AssetContext.Provider>
	);
};
