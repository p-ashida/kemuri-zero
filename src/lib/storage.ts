export type Trigger = "食後" | "ストレス" | "飲酒" | "休憩" | "起床" | "その他";

export const TRIGGERS: Trigger[] = ["食後", "ストレス", "飲酒", "休憩", "起床", "その他"];

export type Craving = {
  at: string; // ISO
  trigger: Trigger;
};

export type Profile = {
  quitAt: string; // ISO
  cigsPerDay: number;
  pricePerPack: number;
  cigsPerPack: number;
  goalName: string;
  goalPrice: number;
  cravings: Craving[];
};

const KEY = "kemuri-zero:v1";

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // ストレージが使えない環境では保存しない
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
