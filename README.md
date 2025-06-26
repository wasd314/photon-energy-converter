# Photon energy converter

A Progressive Web App (PWA) for converting between electromagnetic wave properties including photon energy, wavelength, frequency, and other related physical quantities.

電磁波を特徴づける各種物理量（およびエネルギーと関連するその他の物理量）たちの間の単位変換を行う PWA アプリ．

Visit: https://photon-energy-converter.vercel.app/

## 対応する単位

- 光子エネルギー (Energy) $E$
  - $\mathrm{J}$
  - $\mathrm{eV}$
- モルエネルギー (Molar energy) $E_\text{m}$
  - $\mathrm{kJ} \, \mathrm{mol}^{-1}$
  - $\mathrm{kcal} \, \mathrm{mol}^{-1}$
- 波長 (Wavelength) $\lambda$
  - $\mathrm{m}$
  - $\mathrm{nm}$
- 波数 (Wavenumber) $\tilde{\nu}$
  - $\mathrm{cm}^{-1}$
  - **note**: 角波数 (Angular wavenumber) $k = 2 \pi \tilde{\nu} \, [\mathrm{rad} \, \mathrm{m}^{-1}]$ ではない
- 周期 (Period) $\tau$
  - $\mathrm{s}$
  - $\mathrm{fs}$
- 周波数 (Frequency) $\nu$
  - $\mathrm{Hz}$
  - $\mathrm{THz}$
- 角周波数 (Angular frequency) $\omega$
  - $\mathrm{rad} \, \mathrm{s}^{-1}$
  - $\mathrm{rad} \, \mathrm{fs}^{-1}$
- 温度 (Temperature) $T$
  - $\mathrm{K}$
- 磁束密度 (Magnetic flux density) $B$
  - $\mathrm{T}$

## その他機能

- 物理量名，変換公式の表示/非表示を切り替える
- 値のクリア
- PWA: ローカルにインストールしてオフライン動作

## 使ったもの

- npm/npx
- React
- TypeScript
- Vite
  - `vite-plugin-pwa`
  - `@vite-pwa/assets-generator`
- MUI
- ESLint
- Prettier
