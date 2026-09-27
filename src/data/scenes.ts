// =====================================================================
// シーンの時間管理（ここだけ直せば全体のタイミングが変わります）
// =====================================================================
//
// ・duration … シーンの長さ（秒）
// ・beats    … シーン内で「何秒目に何を出すか」（シーン開始からの秒数）
// ・narration… ナレーション原稿（TTS 作成用。`npm run narration` で一覧表示）
//
// 【TTS 音声を入れたあとの調整方法】
//  A) public/audio/narration.wav（1本の音声）を使う場合
//     → 音声を聞きながら、各シーンの duration と beats を書き換えるだけ。
//  B) public/audio/scenes/<シーン名>.wav（シーンごとの音声）を置いた場合
//     → 自動で duration が「音声の長さ + SCENE_AUDIO_PADDING」に変わり、
//        beats もその長さに合わせて自動で伸び縮みします。
// =====================================================================

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** シーンごとの音声を使う時、音声の後ろに足す余白（秒） */
export const SCENE_AUDIO_PADDING = 0.6;

export type Day = 1 | 2;

export type SceneDef = {
	/** Studio 上で分かりやすくするための名前 */
	label: string;
	/** 何日目か（ヘッダーの色分けに使う） */
	day?: Day;
	/** シーンの長さ（秒） */
	duration: number;
	/** 画面の出来事のタイミング（シーン開始からの秒） */
	beats: Record<string, number>;
	/** ナレーション原稿 */
	narration: string[];
};

export const SCENES = {
	intro: {
		label: 'SCENE1 オープニング',
		duration: 12,
		beats: {
			boatStart: 0.8, // ボートが奥から来る
			jump: 3.8, // 「シュッ！」とジャンプ
			land: 4.4, // 着地
			title: 4.6, // タイトル表示
			wave: 4.8, // 手を振る
			point: 7.6, // 荒川を指差す（ギャグ）
			jaan: 8.4, // 「ジャーン！」
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
		duration: 6,
		beats: {
			title: 0.3,
			jobs: 2.0, // 7つの仕事カードが並ぶ
		},
		narration: [
			'ここ、長瀞げんきプラザで、生活係は、みんなが気持ちよく過ごせるように動きます。',
			'仕事は、大きく7つあります。',
		],
	},
	linen: {
		label: 'SCENE3 ①リネンを配る',
		day: 1,
		duration: 11,
		beats: {
			title: 0,
			set: 3.0, // 1人1セット
			flow: 7.0, // リネン置き場 → 担当する部屋
			count: 8.6, // 人数を確認
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
		duration: 10,
		beats: {
			title: 0,
			lead: 2.6, // 生活係は…
			notAll: 3.4, // 全部やる
			rather: 4.6, // ではなく
			emphasis: 5.4, // 声かけ・確認
			help: 8.0, // 困っている人にはやさしく
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
		duration: 9,
		beats: {
			title: 0,
			check1: 2.4, // 掃除
			check2: 3.9, // 片付け
			check3: 5.4, // 忘れ物チェック
			together: 7.2, // 担当で協力
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
		duration: 14,
		beats: {
			title: 0,
			step1: 2.6, // 体温を測る
			step2: 4.6, // カードに書く
			step3: 7.2, // 生活係が集める
			step4: 10.2, // 担任へ渡す
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
		duration: 9,
		beats: {
			title: 0,
			sleepy: 0.8, // 眠そうな人
			call: 2.2, // 生活係が声をかける
			start: 3.6, // 荷物・布団整理開始
			gag: 5.4, // まだ夢の中…（ギャグ）
			alarm: 5.6, // 目覚まし時計の音
			wry: 6.6, // 苦笑い
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
		duration: 10,
		beats: {
			title: 0,
			step1: 1.2, // 担当する部屋
			step2: 2.6, // シーツ・枕カバーを回収
			step3: 4.6, // 3階
			step4: 5.8, // 青い返却袋
			bags: 7.0, // 返却袋の写真を大きく
			forget: 8.3, // 取り忘れチェック
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
		duration: 15,
		beats: {
			title: 0,
			list: 1.0, // チェック項目が順に出る（0.45秒間隔）
			gomi: 4.6, // ゴミ ✓
			wasuremono: 6.0, // 忘れ物 ✓
			futon: 7.6, // 布団・毛布 ✓
			rest: 10.6, // 残りの項目に順に ✓（0.45秒間隔）
			allDone: 13.0, // 全部OK
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
		duration: 11,
		beats: {
			title: 0,
			walk: 0.4, // 生活係が先生のところへ
			bubble: 2.2, // 「○○号室、終わりました！」
			inspect: 5.0, // 先生が部屋を確認
			fix: 6.6, // 直すところは直す
			ok: 8.4, // OK！
		},
		narration: [
			'全部できたら、担任の先生に、「○○号室、終わりました」と報告します。',
			'先生に確認してもらい、直すところがあれば直します。',
			'先生からOKをもらったら、生活係の仕事は完了です。',
		],
	},
	ending: {
		label: 'SCENE11 まとめ',
		duration: 8,
		beats: {
			msg1: 0.3,
			msg2: 3.0,
			msg3: 5.6,
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
