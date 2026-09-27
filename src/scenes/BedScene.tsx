import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {appear, pop, progress} from '../components/anim';
import {useBeats, useSceneDuration} from '../components/Contexts';
import {FutonIcon} from '../components/Icons';
import {ImagePlaceholder, SafeImg} from '../components/SafeImg';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS} from '../theme';

// SCENE 4 ②ベッド・布団の準備（生活係は「声かけ・確認」）

export const BedScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const duration = useSceneDuration();
	// 写真をゆっくりズーム
	const zoom = interpolate(frame, [0, duration], [1, 1.18]);
	const emphasis = b('emphasis');
	const strike = progress(frame, b('notAll') + 10, 10);
	const e = pop(frame, emphasis, 10);

	return (
		<SceneFrame>
			<SceneHeader day={1} number={2} title="ベッド・布団の準備" />

			<div
				style={{
					position: 'absolute',
					left: 60,
					top: 240,
					width: 760,
					height: 620,
					borderRadius: 30,
					overflow: 'hidden',
					border: '8px solid #fff',
					boxShadow: `0 10px 26px ${COLORS.shadow}`,
					...appear(frame, 6, 40, 18),
				}}
			>
				<div style={{width: '100%', height: '100%', transform: `scale(${zoom})`}}>
					<SafeImg
						name="bedMaking"
						style={{width: '100%', height: '100%'}}
						fallback={
							<ImagePlaceholder label="bed-making.png" style={{width: '100%', height: '100%'}}>
								<FutonIcon size={260} />
							</ImagePlaceholder>
						}
					/>
				</div>
			</div>

			{/* 生活係は… 全部やる ではなく 声かけ・確認 */}
			<div style={{position: 'absolute', left: 880, top: 240, width: 660}}>
				<div style={{fontSize: 64, fontWeight: 700, color: COLORS.subText, ...appear(frame, b('lead'))}}>生活係は…</div>

				<div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 18, ...appear(frame, b('notAll'))}}>
					<div style={{position: 'relative', fontSize: 72, fontWeight: 700, color: COLORS.subText}}>
						全部やる
						<div
							style={{
								position: 'absolute',
								left: -6,
								top: '52%',
								height: 10,
								width: `${strike * 104}%`,
								background: COLORS.red,
								borderRadius: 5,
							}}
						/>
					</div>
					<div style={{fontSize: 52, fontWeight: 700, color: COLORS.text, ...appear(frame, b('rather'))}}>ではなく</div>
				</div>

				<div
					style={{
						marginTop: 30,
						display: 'inline-flex',
						alignItems: 'center',
						gap: 16,
						background: COLORS.yellow,
						borderRadius: 30,
						padding: '24px 40px',
						border: `8px solid ${COLORS.orange}`,
						boxShadow: `0 12px 30px rgba(255,138,31,0.35)`,
						opacity: Math.min(1, e * 1.5),
						transform: `scale(${0.5 + 0.5 * e})`,
						transformOrigin: 'left center',
					}}
				>
					<span style={{fontSize: 100, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap'}}>声かけ・確認</span>
				</div>

				<div
					style={{
						marginTop: 40,
						fontSize: 50,
						fontWeight: 700,
						color: COLORS.green,
						background: COLORS.greenLight,
						borderRadius: 24,
						padding: '16px 30px',
						lineHeight: 1.35,
						display: 'inline-block',
						...appear(frame, b('help')),
					}}
				>
					困っている人には
					<br />
					やさしく教える
				</div>
			</div>

			<TeacherCharacter height={560} motion="nod" motionStart={emphasis} style={{right: 30, bottom: -20}} />
		</SceneFrame>
	);
};
