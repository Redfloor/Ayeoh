import styled from '@emotion/styled';
import { useAyeohStore } from '../../store/ayeohStore';
import { ControllerView } from './ControllerView';
import type { GamepadSnapshot } from '../../input/types';

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

const Hint = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.textMuted};
`;

const PREVIEW_GAMEPAD: GamepadSnapshot = {
  index: -1,
  id: 'Preview (no controller connected)',
  buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })),
  axes: [0, 0, 0, 0],
};

export function ControllerPanel(): React.JSX.Element {
  const gamepads = useAyeohStore((state) => state.gamepads);
  const controllerLayout = useAyeohStore((state) => state.settings.controllerLayout);

  const showPreview = gamepads.length === 0;
  const displayedGamepads = showPreview ? [PREVIEW_GAMEPAD] : gamepads;

  return (
    <Panel aria-label="Controllers">
      <Title>Controller</Title>
      {showPreview && <Hint>No controller connected — showing layout preview.</Hint>}
      {displayedGamepads.map((gamepad) => (
        <ControllerView key={gamepad.index} gamepad={gamepad} layout={controllerLayout} />
      ))}
    </Panel>
  );
}
