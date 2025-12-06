// src/config/version.ts
// This file contains the application version information
// Update this file with each release

export const APP_VERSION = {
  major: 1,
  minor: 0,
  patch: 0,
  build: '2025.12.06',

  // Full version string
  get full(): string {
    return `${this.major}.${this.minor}.${this.patch}`;
  },

  // Version with build date
  get display(): string {
    return `v${this.major}.${this.minor}.${this.patch} (${this.build})`;
  },
};

export default APP_VERSION;
