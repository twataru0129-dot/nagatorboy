import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useBeats} from '../components/Contexts';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {PointCallout, StepLine} from '../design/Cards';
import {JobHeader} from '../design/JobHeader';
import {Eyebrow, RevealText} from '../design/Kinetic';
import {StylishFrame} from '../design/StylishFrame';
import {afterSettle, SETTLE} from '../design/jobScene';
import {INK} from '../design/tokens';

// SCENE 6 ④健康チェックカード（21:50ごろ）
// 仕事名 → 内容（5つの手順を線でつなぐ） → ポイント（まとめて担任へ）

const A = INK.day1;

export const HealthScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	return (
		<StylishFrame
			accent={A}
			watermark="04"
			variant={1}
			hud={<JobHeader n={4} title="健康チェックカード" eyebrow="DAY 1  ·  21:50ごろ" accent={A} settleAt={SETTLE} />}
		>
			<Eyebrow text="BEFORE BED  /  寝る前に" at={afterSettle(b('night'))} color={A} size={30} style={{position: 'absolute', left: 80, top: 260}} />
			{/* 「夜、寝る前には健康チェックがあります」：手順が出るまで大きく */}
			{frame < b('step1') ? (
				<div
					style={{
						position: 'absolute',
						left: 80,
						top: 360,
						opacity: interpolate(frame, [b('step1', -0.35), b('step1')], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					<RevealText text={'寝る前に\n健康チェック'} at={afterSettle(b('night'))} size={140} highlight={[{text: '健康チェック', color: A}]} />
				</div>
			) : null}
			<StepLine
				accent={A}
				left={80}
				top={350}
				width={1760}
				node={150}
				labelSize={40}
				steps={[
					{label: <>体温を<br />測る</>, icon: 'thermo', at: b('step1')},
					{label: <>カードに<br />記入</>, icon: 'card', at: b('step2')},
					{label: <><span style={{color: A}}>生活係</span>が<br />部屋を回って集める</>, icon: 'stack', at: b('step3')},
					{label: <>クラス分を<br />まとめる</>, icon: 'stack', at: b('step4')},
					{label: <>担任の先生へ<br />渡す</>, icon: 'person', at: b('step5')},
				]}
			/>
			<PointCallout at={b('step5', 0.4)} style={{left: 80, top: 830}} size={58}>
				最後は、クラス分をまとめて担任へ
			</PointCallout>
			<TeacherCharacter
				height={260}
				shot="close"
				expression="serious"
				pose="check"
				cues={[{at: b('step5', 0.6), expression: 'smile'}]}
				nods={[b('step1'), b('step2'), b('step3', 1.0), b('step4'), b('step5')]}
				calm
				style={{right: 50, bottom: 0}}
			/>
		</StylishFrame>
	);
};
