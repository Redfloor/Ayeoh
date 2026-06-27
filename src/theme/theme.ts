export interface AyeohTheme {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  border: string;
}

export const lightTheme: AyeohTheme = {
  background: '#f4f4f6',
  surface: '#ffffff',
  text: '#1a1a1f',
  textMuted: '#5a5a66',
  accent: '#3b6fed',
  border: '#d8d8e0',
};

export const darkTheme: AyeohTheme = {
  background: '#15151a',
  surface: '#1f1f27',
  text: '#f4f4f6',
  textMuted: '#9a9aa6',
  accent: '#6ea0ff',
  border: '#33333e',
};

declare module '@emotion/react' {
  export interface Theme extends AyeohTheme {}
}
