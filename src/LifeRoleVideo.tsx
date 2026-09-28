import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile} from 'remotion';
import {AssetContext, SceneTimingProvider} from './components/Contexts';
import {AUDIO, Availability, VOLUME, sceneNarrationPath} from './data/assets';
import {FPS, SceneDurations, SceneKey, buildTimeline, sceneDelay, sceneFallbackClips} from './data/scenes';
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
import {INK} from './design/tokens';
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
			<AbsoluteFill style={{backgroundColor: INK.base, fontFamily: FONT_FAMILY}}>
				{timeline.map(({key, from, durationInFrames}) => {
					const Scene = SCENE_COMPONENTS[key];
					const hasSceneAudio = Boolean(assets.sceneNarration[key]);
					return (
						<Sequence key={key} from={from} durationInFrames={durationInFrames} name={key}>
							<SceneTimingProvider sceneKey={key} durationInFrames={durationInFrames}>
								<Scene />
							</SceneTimingProvider>
							{hasSceneAudio ? (
								<Sequence from={Math.round(sceneDelay(key) * FPS)} layout="none" name={`ナレーション ${key}`}>
									<Html5Audio src={staticFile(sceneNarrationPath(key))} volume={VOLUME.narration} />
								</Sequence>
							) : null}
							{/* <シーン名>.wav がない時は、仮のナレーション部品を並べる */}
							{!hasSceneAudio
								? sceneFallbackClips(key)
										.filter((clip) => assets.fallbackClips?.[clip.file])
										.map((clip) => (
											<Sequence
												key={clip.file}
												from={Math.round((sceneDelay(key) + clip.at) * FPS)}
												layout="none"
												name={`仮ナレーション ${clip.file}`}
											>
												<Html5Audio src={staticFile(clip.file)} volume={VOLUME.narration} />
											</Sequence>
										))
								: null}
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
