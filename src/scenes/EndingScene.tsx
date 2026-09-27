import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {pop} from '../components/anim';
import {useBeats} from '../components/Contexts';
import {SceneFrame} from '../components/SceneFrame';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS} from '../theme';
import {PlazaBackground} from './FacilityScene';

// SCENE 11 まとめ

export const EndingScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const m1 = b('msg1');
	const m2 = b('msg2');
	const m3 = b('msg3');

	return (
		<SceneFrame background={<PlazaBackground dim={0.55} zoom={interpolate(frame, [0, 240], [1.05, 1])} />} fadeOut={20}>
			<Message start={m1} end={m2}>
				<div style={{fontSize: 60, color: COLORS.subText}}>生活係は</div>
				<div style={{fontSize: 64}}>みんなが気持ちよく過ごすための</div>
				<div style={{fontSize: 104, color: COLORS.blue}}>大切な係！</div>
			</Message>
			<Message start={m2} end={m3}>
				<div style={{fontSize: 84, color: COLORS.blue}}>自分の担当を確認！</div>
				<div style={{fontSize: 64, marginTop: 10}}>
					分からなくなったら<span style={{color: COLORS.green}}>プリント</span>を見よう！
				</div>
			</Message>
			<Message start={m3}>
				<div style={{fontSize: 76}}>協力して</div>
				<div style={{fontSize: 100, color: COLORS.green}}>楽しい宿泊学習にしよう！</div>
			</Message>

			{/* 人物は中央。親指を立てるバッジ */}
			<div style={{position: 'absolute', left: '50%', bottom: -20, transform: 'translateX(-50%)'}}>
				<div style={{position: 'relative', height: 620}}>
					<TeacherCharacter
						height={620}
						motion="nod"
						motionStart={m3}
						style={{position: 'relative'}}
					/>
				</div>
			</div>
		</SceneFrame>
	);
};

const Message: React.FC<{start: number; end?: number; children: React.ReactNode}> = ({start, end, children}) => {
	const frame = useCurrentFrame();
	if (frame < start || (end !== undefined && frame >= end)) {
		return null;
	}
	const p = pop(frame, start, 13);
	const out = end === undefined ? 1 : interpolate(frame, [end - 8, end], [1, 0], {extrapolateLeft: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute',
				left: 160,
				right: 160,
				top: 50,
				height: 360,
				boxSizing: 'border-box',
				background: 'rgba(255,255,255,0.96)',
				borderRadius: 40,
				boxShadow: `0 14px 40px ${COLORS.shadow}`,
				border: `8px solid ${COLORS.green}`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				fontWeight: 700,
				color: COLORS.text,
				lineHeight: 1.3,
				textAlign: 'center',
				opacity: Math.min(1, p * 1.5) * out,
				transform: `scale(${0.85 + 0.15 * p})`,
			}}
		>
			{children}
		</div>
	);
};
