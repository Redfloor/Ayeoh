import styled from '@emotion/styled';
import { useAyeohStore } from '../../store/ayeohStore';
import type { InputSource } from '../../input/types';

const SOURCES: InputSource[] = ['keyboard', 'mouse', 'gamepad', 'voice'];

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem;
  color: ${(props) => props.theme.text};
`;

const Heading = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Row = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  color: ${(props) => props.theme.textMuted};
  margin: 1.5rem 0 0.5rem;
`;

export function SettingsScreen(): React.JSX.Element {
  const settings = useAyeohStore((state) => state.settings);
  const setDarkMode = useAyeohStore((state) => state.setDarkMode);
  const toggleSourceMute = useAyeohStore((state) => state.toggleSourceMute);
  const setTtsVolume = useAyeohStore((state) => state.setTtsVolume);

  return (
    <Wrapper>
      <Heading>Settings</Heading>

      <Row>
        <span>Dark mode</span>
        <input
          type="checkbox"
          checked={settings.darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
      </Row>

      <SectionTitle>Input sources</SectionTitle>
      {SOURCES.map((source) => (
        <Row key={source}>
          <span style={{ textTransform: 'capitalize' }}>{source}</span>
          <input
            type="checkbox"
            checked={!settings.mutedSources[source]}
            onChange={() => toggleSourceMute(source)}
          />
        </Row>
      ))}

      <SectionTitle>Speech</SectionTitle>
      <Row>
        <span>Voice volume</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={settings.ttsVolume}
          onChange={(e) => setTtsVolume(Number(e.target.value))}
        />
      </Row>
    </Wrapper>
  );
}
