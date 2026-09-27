import React from 'react';
import {useCurrentFrame} from 'remotion';
import {appear} from '../components/anim';
import {CheckItem} from '../components/CheckItem';
import {TimeLabel} from '../components/Clock';
import {useBeats} from '../components/Contexts';
import {BathIcon, BoxIcon, BroomIcon, PersonIcon, SearchIcon} from '../components/Icons';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS} from '../theme';

// SCENE 5 入浴後 ③お風呂掃除

export const BathScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();

	return (
		<SceneFrame>
			<SceneHeader
				day={1}
				number={3}
				title="お風呂掃除"
				time={<TimeLabel text="入浴後" day={1} start={4} icon={<BathIcon size={100} />} />}
			/>

			<div style={{position: 'absolute', left: 140, top: 280, display: 'flex', flexDirection: 'column', gap: 34}}>
				<CheckItem label="掃除" icon={<BroomIcon size={96} />} appearAt={b('check1', -0.5)} checkAt={b('check1')} fontSize={84} />
				<CheckItem label="片付け" icon={<BoxIcon size={96} />} appearAt={b('check2', -0.5)} checkAt={b('check2')} fontSize={84} />
				<CheckItem label="忘れ物チェック" icon={<SearchIcon size={96} />} appearAt={b('check3', -0.5)} checkAt={b('check3')} fontSize={84} />
			</div>

			<div
				style={{
					position: 'absolute',
					left: 140,
					top: 900,
					display: 'flex',
					alignItems: 'center',
					gap: 20,
					background: COLORS.blueLight,
					border: `5px solid ${COLORS.blue}`,
					borderRadius: 999,
					padding: '10px 40px 10px 24px',
					...appear(frame, b('together')),
				}}
			>
				<div style={{display: 'flex'}}>
					<PersonIcon size={70} color={COLORS.blue} />
					<PersonIcon size={70} color={COLORS.green} style={{marginLeft: -20}} />
					<PersonIcon size={70} color={COLORS.orange} style={{marginLeft: -20}} />
				</div>
				<span style={{fontSize: 52, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap'}}>担当の人で協力</span>
			</div>

			<TeacherCharacter height={700} motion="nod" motionStart={b('check3')} style={{right: 60, bottom: -20}} />
		</SceneFrame>
	);
};
