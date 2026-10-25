const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export type Milestone = {
  ms: number;
  label: string;
  text: string;
};

// 一般に紹介されている禁煙後の体の変化の目安（個人差あり）
export const MILESTONES: Milestone[] = [
  { ms: 20 * MIN, label: "20分", text: "心拍数と血圧が下がり始める" },
  { ms: 12 * HOUR, label: "12時間", text: "血液中の一酸化炭素の濃度が正常に近づく" },
  { ms: 2 * DAY, label: "48時間", text: "味覚と嗅覚が回復し始める" },
  { ms: 3 * DAY, label: "72時間", text: "気管支がゆるみ、呼吸が楽になってくる" },
  { ms: 14 * DAY, label: "2週間", text: "血液の循環と肺の機能が改善し始める" },
  { ms: 30 * DAY, label: "1ヶ月", text: "咳や息切れが減り始める" },
  { ms: 90 * DAY, label: "3ヶ月", text: "肺の機能がさらに改善し、運動が楽になる" },
  { ms: 365 * DAY, label: "1年", text: "冠動脈疾患のリスクが喫煙者の約半分に" },
  { ms: 5 * 365 * DAY, label: "5年", text: "脳卒中のリスクが非喫煙者に近づく" },
  { ms: 10 * 365 * DAY, label: "10年", text: "肺がんで亡くなるリスクが喫煙者の約半分に" },
];
