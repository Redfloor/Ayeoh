import styled from '@emotion/styled';
import { useAyeohStore } from '../../store/ayeohStore';
import { ControllerView } from './ControllerView';

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

const Empty = styled.div`
  font-size: 0.85rem;
  color: ${(props) => props.theme.textMuted};
`;

export function ControllerPanel(): React.JSX.Element {
  const gamepads = useAyeohStore((state) => state.gamepads);
  const controllerLayout = useAyeohStore((state) => state.settings.controllerLayout);

  return (
    <Panel aria-label="Controllers">
      <Title>Controller</Title>
      {gamepads.length === 0 ? (
        <Empty>No controller connected.</Empty>
      ) : (
        gamepads.map((gamepad) => (
          <ControllerView key={gamepad.index} gamepad={gamepad} layout={controllerLayout} />
        ))
      )}
    </Panel>
  );
}
