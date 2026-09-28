# 宿泊学習 生活係の仕事（説明動画 / Remotion）

特別支援学校高等部1年生向けの「宿泊学習 生活係の仕事」説明動画です。
教室の大型モニターで見ることを想定しています（1920×1080 / 30fps / 約115秒）。

## はじめかた

```bash
npm install
npm run dev        # Remotion Studio が開きます（LifeRoleVideo を選んで再生）
```

MP4 を書き出すとき（今は不要）:

```bash
npm run render     # out/life-role-video.mp4
```

## シーン構成

ナレーション音声（`public/audio/scenes/*.wav`）の長さに合わせて、全体は約3分50秒です。

| # | シーン | 時間 | 内容 |
| --- | --- | --- | --- |
| 1 | intro | 0:00〜0:17 | 荒川ラフティング → ジャンプ → タイトル（ギャグあり） |
| 2 | facility | 0:17〜0:27 | 長瀞げんきプラザ／仕事は7つ |
| 3 | linen | 0:27〜0:44 | 1日目 17:00ごろ ①リネンを配る |
| 4 | bed | 0:44〜1:08 | ②ベッド・布団の準備（声かけ・確認） |
| 5 | bath | 1:08〜1:24 | 入浴後 ③お風呂掃除 |
| 6 | health | 1:24〜1:48 | 21:50ごろ ④健康チェックカード |
| 7 | morning | 1:48〜2:03 | 2日目 6:00ごろ ⑤荷物・布団整理の声かけ（ギャグあり） |
| 8 | returnLinen | 2:03〜2:21 | ⑥リネンを回収して返す |
| 9 | roomCheck | 2:21〜2:41 | ⑦部屋の自主点検 |
| 10 | report | 2:41〜3:03 | 担任へ報告 → OK！ → 完了 |
| 11 | ending | 3:03〜3:38 | まとめ → 7つの仕事をもう一度 → 先生アップで締め |

1日目は **青**、2日目は **緑** で色分けしています。

## 素材

- 画像は `public/assets/` に置きます（一覧は `public/assets/README.md`）。
  **ファイルがなくても動画は止まりません**（代わりのイラストが表示されます）。
- `teacher.png`（説明役の人物）は描き直さず、そのまま位置・大きさ・回転・上下移動だけで動かしています。
  背景が透明な PNG にすると、川やボートにきれいに合成されます。
- 効果音は `public/sfx/` にあります（プログラムで合成した音なので、著作権の心配はありません）。
  作り直すときは `npm run sfx`。
- 文字は読みやすいユニバーサルデザインフォント「BIZ UDPゴシック」（SIL OFL 1.1、`public/fonts/`）を使っています。

## タイミングの調整（ナレーション音声）

シーンの長さとタイミングは **`src/data/scenes.ts` の1か所** で管理しています。

```ts
linen: {
  audioDelay: 0.2,       // シーン開始からナレーション開始までの秒数
  duration: 17.2,        // シーンの長さ（音声があれば自動計算）
  beats: {
    rack: 2.7,           // ナレーション開始から何秒後に出すか
    set: 5.2,            // 「1人分は、」→ 1人1セット
    sheets: 6.7,         // 「シーツ2枚と、」
    ...
  },
  narration: [...],      // ナレーション原稿
},
```

- `public/audio/scenes/<シーン名>.wav` があると、シーンの長さは
  「audioDelay ＋ 音声の長さ ＋ 0.5秒」に自動で決まります（まとめだけ最後に1.5秒）。
- `beats` の秒数は、今の音声の文の区切りに合わせてあります。
  音声を作り直したときは、音声を聞きながら `beats` の秒数を直してください。
- シーン1は、ボート・ジャンプを見せてから話し始めるように `audioDelay: 4.0` にしています。
- ナレーション原稿の一覧: `npm run narration`

### BGM

`public/audio/bgm.mp3` を置くと、小さい音量で自動ループ再生します。
音量は `src/data/assets.ts` の `VOLUME` で変更できます（効果音も同じ場所）。

## フォルダ構成

```
src/
  Root.tsx               … コンポジション登録・素材の自動チェック・音声長の自動調整
  LifeRoleVideo.tsx      … シーンを順番に並べる本体
  data/scenes.ts         … ★シーンの長さ・タイミング・ナレーション原稿
  data/assets.ts         … 画像・音声のパスと音量
  scenes/                … 各シーン（11個）
  components/            … 時計・チェック項目・矢印・人物などの部品
scripts/
  generate-sfx.mjs       … 効果音の生成
  print-narration.mjs    … ナレーション原稿の表示
```

## 人物（TeacherCharacter）の表情・ポーズ・寄り

`teacher.png` の絵は描き直さず、次の方法で表情やポーズを表現しています。

- **expression**（表情）…「漫符」と体の動きで表現
  `smile`（キラッ）/ `happy`（キラキラ＋ぴょこっ）/ `serious`（眼鏡がキラッ）/
  `thinking`（？＋首かしげ）/ `surprised`（！＋びくっ）/ `gentle`（♪＋ゆったり）/ `neutral`
- **pose**（ポーズ）… 傾き・ゆれと手元の小物で表現
  `wave`（手を振る）/ `point`（指差し矢印）/ `explain`（説明の身ぶり）/
  `check`（チェック表）/ `thumbsUp`（グッ！＋キラッ）/ `normal`
- **shot**（寄り）… `full`（全身）/ `waist`（上半身）/ `close`（顔アップ）
- `cues` で「何フレーム目から切り替えるか」を並べます。`nods` でうなずき、`bounceAt` で着地の「ぽよん」。

```tsx
<TeacherCharacter
  height={700}
  expression="smile"
  cues={[
    {at: b('set'), pose: 'explain'},
    {at: b('count'), pose: 'check', expression: 'serious'},
    {at: b('enough'), pose: 'normal', expression: 'happy'},
  ]}
  nods={[b('sheets', 0.3)]}
/>
```

カメラ（寄り・戻り）は `SceneFrame` の `camera` に、見出しや時計は `hud` に渡します（`src/components/Camera.tsx`）。

## まとめ（ending）のナレーションについて

- `public/audio/scenes/ending.wav` が新しいまとめの音声です（「先生に聞く」「7つの仕事をもう一度」を含む）。
  `ending.beats` の秒数は、この音声の文の区切りに合わせてあります。
- `public/audio/scenes/ending-parts/` は、`ending.wav` がない時だけ使う予備です。
- 前の録音は `public/audio/archive/ending-v1.wav` に残してあります。

## 読む時間の確保（holdAfter）

`scenes.ts` の `holdAfter` で、「ある beat のあと最低何秒は画面を見せるか」を指定できます。
長瀞げんきプラザのシーンでは、7つの仕事カードがすべて出た後（`allShown`）に約8秒の確認時間をとっています。
音声の長さが変わっても、この時間は自動で確保されます。

## GitHub Pages 用の preview.mp4 を作り直す

```bash
npm run preview
```

`preview.mp4`（1280×720・30fps・H.264＋AAC）と `poster.jpg` が更新されます。
コミットして `main` に取り込むと、GitHub Pages のページに反映されます。

## スタイリッシュ版（feature/stylish-version）

ナレーション・説明内容・7つの仕事はそのままに、映像をモーションデザイン寄りに作り直した版です。

- **色**：深いネイビー（ベース）＋白＋アクセント（1日目＝ブルー、2日目＝ミント）。「覚えてほしいポイント」だけアンバー。
- **文字**：和文は BIZ UDPゴシック、英字ラベル（DAY 1 / JOB 01 / POINT など）は Montserrat（SIL OFL、`public/fonts/`）。
- **各仕事の見せ方**：大きな「番号＋仕事名」→ 左上の見出しへ移動 → 内容 → POINT（覚えてほしいこと）。

共通部品は `src/design/` にあります。

| ファイル | 役割 |
| --- | --- |
| `tokens.ts` | 色・フォント・7つの仕事の名前 |
| `Backdrop.tsx` | 奥行きのある背景（光・ドット・透かし数字・パララックス）、ビネット、スポットライト |
| `Kinetic.tsx` | キネティックタイポ（1文字ずつせり上がる）、ラベル、下線 |
| `JobHeader.tsx` | 仕事タイトル（大 → 見出し）と「JOB 01 / 07」の目盛り |
| `Cards.tsx` | パネル、写真カード、POINT、手順ライン、チェック行、ふきだし、大きな数字 |
| `LineIcon.tsx` | 線だけのシンプルなアイコン |
| `StylishFrame.tsx` | シーン共通の枠（背景・開始トランジション・効果音・カメラ） |

効果音は小さめ（`src/data/assets.ts` の `VOLUME`）で、シーンの切り替わりに軽い「シュッ」が入ります。
`public/audio/bgm.mp3` を置くと、BGMも小さく流れます。
