import { ThemeProvider } from '@emotion/react';
import { useAyeohStore } from './store/ayeohStore';
import { darkTheme, lightTheme } from './theme/theme';
import { InputProvider } from './input/InputProvider';
import { useTts } from './input/useTts';
import { Layout } from './components/Layout/Layout';

function TtsBridge(): null {
  useTts();
  return null;
}

export default function App(): React.JSX.Element {
  const darkMode = useAyeohStore((state) => state.settings.darkMode);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <InputProvider>
        <TtsBridge />
        <Layout />
      </InputProvider>
    </ThemeProvider>
  );
}
