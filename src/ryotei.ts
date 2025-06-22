// 三宅島の中心座標（例: 34.0806, 139.5272）
export const miyakeCenter: [number, number] = [34.0806, 139.5272];
const kairaku: [number, number] = [34.068258696261104, 139.48270738381026];

export type Item = {
  time: string;
  label: string;
  position?: [number, number];
};

type Items = Item[];

// 工程表データ（ryotei.mdより抜粋、地名ごとに緯度経度を割り当て）
const itinerary: Items = [
  { time: "5:00", label: "三宅島到着", position: [34.068533, 139.4782826] },
  {
    time: "5:30",
    label: "レンタカーを借りる",
    position: [34.0636676533408, 139.54998903697486],
  },
  { time: "5:30", label: "宿「海楽」着", position: kairaku },
  { time: "6:00", label: "朝食" },
  { time: "7:00", label: "釣り開始", position: [34.068533, 139.4782826] },
  {
    time: "11:00",
    label: "昼ご飯調達",
    position: [34.06824005115279, 139.48231185594008],
  },
  {
    time: "12:00",
    label: "七島展望台",
    position: [34.069312870803344, 139.50880243241116],
  },
  {
    time: "13:00",
    label: "御祭神社付近散策",
    position: [34.095948, 139.4919867],
  },
  {
    time: "14:00",
    label: "釜の尻海岸",
    position: [34.11396110313305, 139.55372608858184],
  },
  {
    time: "14:30",
    label: "椎取神社",
    position: [34.10767092607141, 139.55804545123274],
  },
  {
    time: "15:00",
    label: "赤場暁・ひょうたん山付近散策",
    position: [34.10340158470537, 139.5594634707836],
  },
  {
    time: "16:00",
    label: "レンタカー返却",
    position: [34.0636676533408, 139.54998903697486],
  },
  {
    time: "16:30",
    label: "宿「海楽」戻り",
    position: kairaku,
  },
  {
    time: "17:00",
    label: "スーパー土屋で買い出し (19:00 まで営業)",
    position: [34.068242, 139.4813055],
  },
  {
    time: "17:00",
    label: "錆ヶ浜海水浴場付近散策",
    position: [34.07123177296746, 139.47980353154648],
  },
  { time: "18:00", label: "夕食" },
  {
    time: "19:00",
    label: "温泉「みやけの湯」(21:00 まで営業)",
    position: [34.07411546262252, 139.4780275133753],
  },
  { time: "20:00", label: "宿でゆっくり" },
];

// 日付ラベルと工程の対応
export const dateSections: { date: string; items: Items }[] = [
  {
    date: "1日目",
    items: [{ time: "22:30", label: "竹芝桟橋発" }],
  },
  {
    date: "2日目",
    items: itinerary,
  },
  {
    date: "3日目",
    items: [
      { time: "7:00", label: "朝食" },
      {
        time: "8:00",
        label: "錆ヶ浜散策",
        position: [34.07123177296746, 139.47980353154648],
      },
      {
        time: "9:00",
        label: "火山体験遊歩道散策",
        position: [34.07908775336427, 139.48072336495062],
      },
      { time: "13:45", label: "三宅島発", position: [34.068533, 139.4782826] },
      { time: "19:45", label: "竹芝桟橋着" },
    ],
  },
];
