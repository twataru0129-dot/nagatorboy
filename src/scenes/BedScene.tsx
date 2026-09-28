import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useBeats} from '../components/Contexts';
import {PhotoCard, PointCallout} from '../design/Cards';
import {JobHeader} from '../design/JobHeader';
import {RevealText, Rise} from '../design/Kinetic';
import {StylishFrame} from '../design/StylishFrame';
import {afterSettle, SETTLE} from '../design/jobScene';
import {FONT_JP, INK} from '../design/tokens';

// SCENE 4 ②ベッド・布団の準備
// 仕事名 → 内容（全部やるのではなく「声かけ・確認」） → ポイント（困っている人にはやさしく）

const A = INK.day1;

export const BedScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const strike = interpolate(frame, [b('rather'), b('rather') + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<StylishFrame
			accent={A}
			watermark="02"
			variant={2}
			hud={<JobHeader n={2} title="ベッド・布団の準備" eyebrow="DAY 1  ·  夕食後" accent={A} settleAt={SETTLE} />}
			camera={[
				{at: b('call', 0.3), zoom: 1.04, x: 1200, y: 560, ease: 16},
				{at: b('help', -0.4), zoom: 1, x: 1200, y: 560, ease: 20},
			]}
		>
			<PhotoCard
				name="bedMaking"
				at={afterSettle(b('photo'))}
				caption="COMPLETE  ·  ベッドメイキング完成図"
				accent={A}
				fallbackIcon="futon"
				style={{left: 80, top: 240, width: 800, height: 450}}
			/>

			<div style={{position: 'absolute', left: 960, top: 236, width: 900}}>
				<Rise at={b('lead')}>
					<div style={{fontFamily: FONT_JP, fontWeight: 700, fontSize: 56, color: INK.mute}}>生活係は…</div>
				</Rise>
				{frame >= b('notAll') ? (
					<div style={{display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 10}}>
						<div style={{position: 'relative'}}>
							<RevealText text="全部やる" at={b('notAll')} size={92} color={frame >= b('rather') ? 'rgba(255,255,255,0.45)' : INK.white} />
							<div
								style={{
									position: 'absolute',
									left: -8,
									top: '52%',
									height: 8,
									width: `${strike * 106}%`,
									background: INK.point,
									borderRadius: 4,
								}}
							/>
						</div>
						{frame >= b('rather') ? <RevealText text="のではなく" at={b('rather')} size={52} color={INK.mute} /> : null}
					</div>
				) : null}
				{frame >= b('call') ? (
					<div style={{marginTop: 30}}>
						<RevealText text="声かけ" at={b('call')} size={170} color={A} stagger={2} lineHeight={1.05} />
						{frame >= b('check') ? (
							<RevealText text="＋ 確認" at={b('check')} size={170} color={A} stagger={2} lineHeight={1.05} />
						) : null}
					</div>
				) : null}
			</div>

			<PointCallout at={b('help')} style={{left: 80, top: 790}} size={56}>
				困っている人には、<span style={{opacity: interpolate(frame, [b('teach'), b('teach') + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>やさしく教える</span>
			</PointCallout>
		</StylishFrame>
	);
};
