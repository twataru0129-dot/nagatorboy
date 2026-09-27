// =====================================================================
// シーンの時間管理（ここだけ直せば全体のタイミングが変わります）
// =====================================================================
//
// ・audioDelay … シーンが始まってから、ナレーションが始まるまでの秒数
// ・duration   … シーンの長さ（秒）。public/audio/scenes/<シーン名>.wav がある場合は
//                 「audioDelay + 音声の長さ + tailPadding」に自動で置き換わります
// ・beats      … 「ナレーション開始から何秒後に何を出すか」（マイナスは話し始める前）
// ・narration  … ナレーション原稿（`npm run narration` で一覧表示）
//
// beats の秒数は、実際の音声（public/audio/scenes/*.wav）の文の区切りに合わせてあります。
// 音声を作り直したときは、ここの秒数を聞きながら直してください。
// =====================================================================

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** ナレーションが終わってから次のシーンへ移るまでの余裕（秒） */
export const SCENE_AUDIO_PADDING = 0.5;
/** ふつうのシーンで、ナレーションが始まるまでの秒数 */
const DELAY = 0.2;

export type Day = 1 | 2;

export type SceneDef = {
	/** Studio 上で分かりやすくするための名前 */
	label: string;
	/** 何日目か（ヘッダーの色分けに使う） */
	day?: Day;
	/** シーン開始からナレーション開始までの秒数 */
	audioDelay: number;
	/** ナレーション後の余裕（省略時は SCENE_AUDIO_PADDING） */
	tailPadding?: number;
	/** シーンの長さ（秒）。音声があれば自動計算される */
	duration: number;
	/** 画面の出来事のタイミング（ナレーション開始からの秒） */
	beats: Record<string, number>;
	/** ナレーション原稿 */
	narration: string[];
};

export const SCENES = {
	intro: {
		label: 'SCENE1 オープニング',
		// 川の風景 → ボート → ジャンプ・着地のあとで「みなさん、こんにちは！」
		audioDelay: 4.0,
		duration: 17.7,
		beats: {
			boatStart: -3.6, // ボートが奥から来る
			jump: -1.3, // 「シュッ！」とジャンプ
			land: -0.7, // 着地
			wave: -0.5, // 手を振る
			title: 1.5, // 「今日は、…生活係の仕事を」→ タイトル
			point: 7.7, // 「流れが速いのは荒川だけじゃない！」（ギャグ）
			jaan: 10.4, // 「生活係の仕事の流れも、しっかりつかもう！」＋ジャーン
		},
		narration: [
			'みなさん、こんにちは！',
			'今日は、宿泊学習での生活係の仕事を教えるよ！',
			'みんなに生活係としての仕事を教えるから、しっかり覚えてね！',
			'流れが速いのは荒川だけじゃない！生活係の仕事の流れも、しっかりつかもう！',
		],
	},
	facility: {
		label: 'SCENE2 長瀞げんきプラザ',
		audioDelay: DELAY,
		duration: 9.5,
		beats: {
			place: 0.2, // 「ここ、長瀞げんきプラザで」
			role: 1.1, // 「生活係は、」
			comfort: 3.9, // 「みんなが気持ちよく過ごせるように動きます」
			jobs: 6.8, // 「仕事は、大きく7つあります」→ 7つのカード
		},
		narration: [
			'ここ、長瀞げんきプラザで、生活係は、みんなが気持ちよく過ごせるように動きます。',
			'仕事は、大きく7つあります。',
		],
	},
	linen: {
		label: 'SCENE3 ①リネンを配る',
		day: 1,
		audioDelay: DELAY,
		duration: 17.2,
		beats: {
			rack: 2.7, // 「リネンを配ります」→ リネン置き場の写真
			set: 5.2, // 「1人分は、」→ 1人1セット
			sheets: 6.7, // 「シーツ2枚と、」
			pillow: 9.0, // 「枕カバー1枚です」
			flow: 12.4, // 「担当する部屋の人数を確認して」→ 置き場 → 部屋
			count: 13.2, // 人数を確認！
			enough: 14.75, // 「必要な分だけ配りましょう」
		},
		narration: [
			'まず、1日目の夕方は、リネンを配ります。',
			'1人分は、シーツ2枚と、枕カバー1枚です。',
			'担当する部屋の人数を確認して、必要な分だけ配りましょう。',
		],
	},
	bed: {
		label: 'SCENE4 ②ベッド・布団の準備',
		day: 1,
		audioDelay: DELAY,
		duration: 23.9,
		beats: {
			photo: 1.2, // 「ベッドや布団の準備です」
			lead: 5.2, // 「生活係は、」
			notAll: 6.0, // 「全部を自分でやる」
			rather: 7.6, // 「のではありません」
			call: 10.3, // 「部屋のみんなに声をかけたり」→ 声かけ
			check: 15.05, // 「できているか確認したりします」→ 確認
			help: 19.97, // 「困っている人がいたら、」
			teach: 21.54, // 「やさしく教えてあげましょう」
		},
		narration: [
			'次は、ベッドや布団の準備です。',
			'生活係は、全部を自分でやるのではありません。',
			'部屋のみんなに声をかけたり、できているか確認したりします。',
			'困っている人がいたら、やさしく教えてあげましょう。',
		],
	},
	bath: {
		label: 'SCENE5 ③お風呂掃除',
		day: 1,
		audioDelay: DELAY,
		duration: 16.4,
		beats: {
			afterBath: 0.1, // 「入浴が終わったら」→ 入浴後
			check1: 4.2, // 「浴場をきれいにして」→ 掃除
			check2: 6.8, // 「片付けをします」
			check3: 9.4, // 「忘れ物がないかも確認しましょう」
			together: 12.1, // 「担当の人で協力して行います」
		},
		narration: [
			'入浴が終わったら、お風呂掃除です。',
			'浴場をきれいにして、片付けをします。',
			'最後に、忘れ物がないかも確認しましょう。',
			'担当の人で協力して行います。',
		],
	},
	health: {
		label: 'SCENE6 ④健康チェックカード',
		day: 1,
		audioDelay: DELAY,
		duration: 24.1,
		beats: {
			night: 0.24, // 「夜、寝る前には」
			step1: 4.43, // 「みんなが体温を測って」
			step2: 7.8, // 「健康チェックカードに記入します」
			step3: 13.0, // 「書き終わったら、生活係が担当する部屋を回って集めます」
			step4: 19.2, // 「最後に、クラス分をまとめて」
			step5: 21.7, // 「担任の先生へ渡します」
		},
		narration: [
			'夜、寝る前には健康チェックがあります。',
			'みんなが体温を測って、健康チェックカードに記入します。',
			'書き終わったら、生活係が担当する部屋を回って集めます。',
			'最後に、クラス分をまとめて担任の先生へ渡します。',
		],
	},
	morning: {
		label: 'SCENE7 ⑤荷物・布団整理の声かけ',
		day: 2,
		audioDelay: DELAY,
		duration: 14.7,
		beats: {
			sleepy: 0.2, // 「2日目の朝は」→ 眠そうな人
			call: 1.8, // 「荷物や布団の整理の声かけをします」
			start: 4.85, // 「部屋のみんなが片付けを始められるように」
			callAgain: 8.0, // 「声をかけましょう」
			gag: 9.9, // 「まだ夢の中の人がいたら、」（ギャグ）
			alarm: 10.1, // 目覚まし時計の音
			wry: 12.07, // 「やさしく現実に戻してあげよう」→ 苦笑い
		},
		narration: [
			'2日目の朝は、荷物や布団の整理の声かけをします。',
			'部屋のみんなが片付けを始められるように、声をかけましょう。',
			'まだ夢の中の人がいたら、やさしく現実に戻してあげよう。',
		],
	},
	returnLinen: {
		label: 'SCENE8 ⑥リネンを回収して返す',
		day: 2,
		audioDelay: DELAY,
		duration: 18.5,
		beats: {
			used: 1.24, // 「使ったリネンを回収します」
			step1: 4.95, // 「担当する部屋を回って」
			step2: 6.63, // 「シーツと枕カバーを集めます」
			step3: 9.93, // 「集めたリネンは、3階の」
			step4: 11.6, // 「返却場所へ持っていきます」
			bags: 12.4, // 返却袋の写真を大きく
			forget: 15.27, // 「取り忘れがないか、しっかり確認しましょう」
		},
		narration: [
			'次は、使ったリネンを回収します。',
			'担当する部屋を回って、シーツと枕カバーを集めます。',
			'集めたリネンは、3階の返却場所へ持っていきます。',
			'取り忘れがないか、しっかり確認しましょう。',
		],
	},
	roomCheck: {
		label: 'SCENE9 ⑦部屋の自主点検',
		day: 2,
		audioDelay: DELAY,
		duration: 19.8,
		beats: {
			sheet: 0.2, // 「部屋の片付けが終わったら」→ 点検表
			last: 2.1, // 「生活係が最後の確認をします」
			gomi: 6.6, // 「ゴミはないか」
			wasuremono: 8.0, // 「忘れ物はないか」
			futon: 10.37, // 「布団や毛布は、」
			futonCheck: 12.17, // 「決められた通りに片付いているか」
			rest: 15.36, // 「担当する部屋を」→ 残りの項目（0.4秒間隔）
			allDone: 16.72, // 「しっかり確認しましょう」→ 全部チェック
		},
		narration: [
			'部屋の片付けが終わったら、生活係が最後の確認をします。',
			'ゴミはないか。',
			'忘れ物はないか。',
			'布団や毛布は、決められた通りに片付いているか。',
			'担当する部屋を、しっかり確認しましょう。',
		],
	},
	report: {
		label: 'SCENE10 担任へ報告',
		day: 2,
		audioDelay: DELAY,
		duration: 21.9,
		beats: {
			walk: 0.2, // 「全部できたら、担任の先生に」→ 先生のところへ
			bubble: 4.59, // 「○○号室、終わりました」
			inspect: 10.34, // 「先生に確認してもらい」
			fix: 12.1, // 「直すところがあれば直します」
			ok: 16.16, // 「OKをもらったら」
			complete: 18.89, // 「生活係の仕事は完了です」
		},
		narration: [
			'全部できたら、担任の先生に、「○○号室、終わりました」と報告します。',
			'先生に確認してもらい、直すところがあれば直します。',
			'先生からOKをもらったら、生活係の仕事は完了です。',
		],
	},
	ending: {
		label: 'SCENE11 まとめ',
		audioDelay: DELAY,
		tailPadding: 1.5,
		duration: 16.8,
		beats: {
			msg1: 0.14, // 「生活係は、」
			msg1b: 1.74, // 「みんなが気持ちよく宿泊するための」
			msg1c: 3.0, // 「大切な係です」
			msg2: 4.31, // 「自分の担当を確認して、」
			msg2b: 6.65, // 「分からなくなったら」
			msg2c: 8.74, // 「プリントを見ましょう」
			msg3: 12.11, // 「みんなで協力して、楽しい宿泊学習にしよう！」
		},
		narration: [
			'生活係は、みんなが気持ちよく宿泊するための大切な係です。',
			'自分の担当を確認して、分からなくなったらプリントを見ましょう。',
			'みんなで協力して、楽しい宿泊学習にしよう！',
		],
	},
} satisfies Record<string, SceneDef>;

export type SceneKey = keyof typeof SCENES;

/** 再生順 */
export const SCENE_ORDER: SceneKey[] = [
	'intro',
	'facility',
	'linen',
	'bed',
	'bath',
	'health',
	'morning',
	'returnLinen',
	'roomCheck',
	'report',
	'ending',
];

export type SceneDurations = Record<SceneKey, number>;

export const DEFAULT_DURATIONS = Object.fromEntries(
	SCENE_ORDER.map((key) => [key, SCENES[key].duration]),
) as SceneDurations;

export type TimelineEntry = {
	key: SceneKey;
	from: number;
	durationInFrames: number;
};

/** 秒 → フレーム */
export const sec = (s: number) => Math.round(s * FPS);

/** シーンの開始フレームと長さを計算 */
export const buildTimeline = (durations: SceneDurations): TimelineEntry[] => {
	let from = 0;
	return SCENE_ORDER.map((key) => {
		const durationInFrames = sec(durations[key]);
		const entry = {key, from, durationInFrames};
		from += durationInFrames;
		return entry;
	});
};

export const totalFrames = (durations: SceneDurations) =>
	buildTimeline(durations).reduce((sum, s) => sum + s.durationInFrames, 0);

/** シーン開始からナレーション開始までの秒数 */
export const sceneDelay = (key: SceneKey) => (SCENES[key] as SceneDef).audioDelay;

/** ナレーション後の余裕（秒） */
export const sceneTail = (key: SceneKey) => (SCENES[key] as SceneDef).tailPadding ?? SCENE_AUDIO_PADDING;
