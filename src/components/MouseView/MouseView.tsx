import styled from '@emotion/styled';
import { useAyeohStore } from '../../store/ayeohStore';

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem;
  border-radius: 12px;
  background: ${(props) => (props.theme.overlay ? 'transparent' : props.theme.surface)};
  border: ${(props) => (props.theme.overlay ? 'none' : `1px solid ${props.theme.border}`)};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.textMuted};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const ButtonShape = styled.div<{ active: boolean }>`
  flex: 1;
  padding: 0.6rem;
  text-align: center;
  border-radius: 8px;
  font-size: 0.75rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => (props.active ? props.theme.accent : props.theme.surface)};
  color: ${(props) => (props.active ? '#fff' : props.theme.text)};
`;

const ScrollLine = styled.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme.textMuted};
`;

const MOUSE_BUTTONS: { button: number; label: string }[] = [
  { button: 1, label: 'Left' },
  { button: 3, label: 'Middle' },
  { button: 2, label: 'Right' },
];

export function MouseView(): React.JSX.Element {
  const activeMouseButtons = useAyeohStore((state) => state.activeMouseButtons);
  const history = useAyeohStore((state) => state.history);

  const lastWheelEvent = history.find(
    (event) => event.source === 'mouse' && event.kind === 'wheel',
  );

  return (
    <Panel aria-label="Mouse">
      <Title>Mouse</Title>
      <ButtonRow>
        {MOUSE_BUTTONS.map(({ button, label }) => (
          <ButtonShape key={button} active={activeMouseButtons[button] ?? false}>
            {label}
          </ButtonShape>
        ))}
      </ButtonRow>
      <ScrollLine>{lastWheelEvent ? lastWheelEvent.label : 'No scroll yet'}</ScrollLine>
    </Panel>
  );
}
