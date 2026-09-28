import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useBeats} from '../components/Contexts';
import {BigNumber, PhotoCard, PointCallout, StepLine} from '../design/Cards';
import {JobHeader} from '../design/JobHeader';
import {Eyebrow, Rise} from '../design/Kinetic';
import {LineIcon} from '../design/LineIcon';
import {StylishFrame} from '../design/StylishFrame';
import {afterSettle, SETTLE} from '../design/jobScene';
import {FONT_JP, INK} from '../design/tokens';

// SCENE 3 ①リネンを配る（1日目 17:00ごろ）
// 仕事名 → 内容（1人1セット：シーツ2枚・枕カバー1枚／置き場→部屋） → ポイント（人数を確認）

const A = INK.day1;

export const LinenScene: React.FC = () => {
	const b = useBeats();
	return (
		<StylishFrame
			accent={A}
			watermark="01"
			hud={<JobHeader n={1} title="リネンを配る" eyebrow="DAY 1  ·  17:00ごろ" accent={A} settleAt={SETTLE} />}
			camera={[
				{at: b('set', 0.4), zoom: 1.05, x: 1350, y: 460, ease: 18},
				{at: b('flow', -0.6), zoom: 1, x: 1350, y: 460, ease: 18},
			]}
		>
			<PhotoCard
				name="linenRack"
				at={afterSettle(b('rack'))}
				caption="LINEN ROOM  ·  リネン置き場（3階）"
				accent={A}
				fallbackIcon="rack"
				style={{left: 80, top: 230, width: 700, height: 470}}
			/>

			{/* 1人1セット */}
			<div style={{position: 'absolute', left: 880, top: 236, width: 960}}>
				<Eyebrow text="ONE SET  /  1人1セット" at={b('set')} color={A} size={28} />
				<div style={{display: 'flex', gap: 80, marginTop: 28}}>
					<Count at={b('sheets')} icon="sheet" label="シーツ" value="2" />
					<Count at={b('pillow')} icon="pillow" label="枕カバー" value="1" />
				</div>
			</div>

			<StepLine
				accent={A}
				left={80}
				top={750}
				width={700}
				node={120}
				labelSize={36}
				steps={[
					{label: 'リネン置き場', icon: 'rack', at: b('flow', -0.6)},
					{label: '担当する部屋', icon: 'door', at: b('flow')},
				]}
			/>

			<PointCallout at={b('count')} style={{left: 880, top: 800}} size={54}>
				人数を確認して、必要な分だけ
			</PointCallout>
		</StylishFrame>
	);
};

const Count: React.FC<{at: number; icon: 'sheet' | 'pillow'; label: string; value: string}> = ({at, icon, label, value}) => {
	const frame = useCurrentFrame();
	if (frame < at - 2) {
		return <div style={{width: 360}} />;
	}
	return (
		<Rise at={at} style={{width: 360}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
				<LineIcon name={icon} size={84} color={A} />
				<div style={{fontFamily: FONT_JP, fontWeight: 700, fontSize: 56, color: INK.white}}>{label}</div>
			</div>
			<div style={{display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 10}}>
				<BigNumber value={value} at={at + 4} size={250} color={A} />
				<div style={{fontFamily: FONT_JP, fontWeight: 700, fontSize: 80, color: INK.white, paddingBottom: 18}}>枚</div>
			</div>
		</Rise>
	);
};
