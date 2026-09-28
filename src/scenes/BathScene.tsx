import React from 'react';
import {useBeats} from '../components/Contexts';
import {CheckRow, Glass, PointCallout} from '../design/Cards';
import {JobHeader} from '../design/JobHeader';
import {Eyebrow, RevealText} from '../design/Kinetic';
import {LineIcon} from '../design/LineIcon';
import {StylishFrame} from '../design/StylishFrame';
import {SETTLE} from '../design/jobScene';
import {FONT_JP, INK} from '../design/tokens';

// SCENE 5 ③お風呂掃除（入浴後）
// 仕事名 → 内容（掃除・片付け・忘れ物チェック） → ポイント（担当の人で協力）

const A = INK.day1;

export const BathScene: React.FC = () => {
	const b = useBeats();
	return (
		<StylishFrame
			accent={A}
			watermark="03"
			hud={<JobHeader n={3} title="お風呂掃除" eyebrow="DAY 1  ·  入浴後" accent={A} settleAt={SETTLE} />}
			camera={[
				{at: b('together', 0.3), zoom: 1.05, x: 600, y: 880, ease: 16},
				{at: b('together', 2.8), zoom: 1, x: 600, y: 880, ease: 20},
			]}
		>
			<div style={{position: 'absolute', left: 80, top: 250, display: 'flex', flexDirection: 'column', gap: 26}}>
				<CheckRow label="掃除" icon="broom" appearAt={b('check1', -0.5)} checkAt={b('check1')} accent={A} size={76} />
				<CheckRow label="片付け" icon="box" appearAt={b('check2', -0.5)} checkAt={b('check2')} accent={A} size={76} />
				<CheckRow label="忘れ物チェック" icon="search" appearAt={b('check3', -0.5)} checkAt={b('check3')} accent={A} size={76} />
			</div>

			<Glass at={SETTLE} accent={A} style={{left: 1180, top: 250, width: 660, height: 470, padding: '40px 48px'}}>
				<Eyebrow text="AFTER BATH" at={SETTLE + 4} color={A} />
				<div style={{display: 'flex', justifyContent: 'center', marginTop: 26}}>
					<LineIcon name="bath" size={220} color={A} stroke={4} />
				</div>
				<RevealText text={'入浴が終わったら\nお風呂掃除'} at={SETTLE + 6} size={52} align="center" style={{marginTop: 16}} />
			</Glass>

			<PointCallout at={b('together')} style={{left: 80, top: 830}} size={60}>
				<span style={{display: 'inline-flex', alignItems: 'center', gap: 20}}>
					<LineIcon name="people" size={72} color={INK.point} />
					<span style={{fontFamily: FONT_JP}}>担当の人で協力して行う</span>
				</span>
			</PointCallout>
		</StylishFrame>
	);
};
