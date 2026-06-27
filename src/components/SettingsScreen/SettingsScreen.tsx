import styled from '@emotion/styled';
import { useAyeohStore, type ControllerLayout, type PanelKey } from '../../store/ayeohStore';
import type { InputSource } from '../../input/types';

const SOURCES: InputSource[] = ['keyboard', 'mouse', 'gamepad', 'voice'];
const CONTROLLER_LAYOUTS: ControllerLayout[] = ['xbox', 'generic'];
const PANELS: { key: PanelKey; label: string }[] = [
  { key: 'keyboard', label: 'Keyboard' },
  { key: 'mouse', label: 'Mouse' },
  { key: 'controller', label: 'Controller' },
  { key: 'voice', label: 'Voice' },
  { key: 'log', label: 'Recent inputs' },
];

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
  const setOverlayMode = useAyeohStore((state) => state.setOverlayMode);
  const setControllerLayout = useAyeohStore((state) => state.setControllerLayout);
  const toggleSourceMute = useAyeohStore((state) => state.toggleSourceMute);
  const togglePanelVisibility = useAyeohStore((state) => state.togglePanelVisibility);
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

      <Row>
        <span>Overlay mode (transparent background)</span>
        <input
          type="checkbox"
          checked={settings.overlayMode}
          onChange={(e) => setOverlayMode(e.target.checked)}
        />
      </Row>

      <SectionTitle>Speak aloud</SectionTitle>
      {SOURCES.map((source) => (
        <Row key={source}>
          <span style={{ textTransform: 'capitalize' }}>{source} (speak aloud)</span>
          <input
            type="checkbox"
            checked={!settings.mutedSources[source]}
            onChange={() => toggleSourceMute(source)}
          />
        </Row>
      ))}

      <SectionTitle>Displayed panels</SectionTitle>
      {PANELS.map(({ key, label }) => (
        <Row key={key}>
          <span>{label} (show panel)</span>
          <input
            type="checkbox"
            checked={settings.visiblePanels[key]}
            onChange={() => togglePanelVisibility(key)}
          />
        </Row>
      ))}

      <SectionTitle>Controller</SectionTitle>
      <Row>
        <span>Layout</span>
        <select
          value={settings.controllerLayout}
          onChange={(e) => setControllerLayout(e.target.value as ControllerLayout)}
        >
          {CONTROLLER_LAYOUTS.map((layout) => (
            <option key={layout} value={layout}>
              {layout === 'xbox' ? 'Xbox-style' : 'Generic'}
            </option>
          ))}
        </select>
      </Row>

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
