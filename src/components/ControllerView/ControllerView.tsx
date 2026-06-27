import styled from '@emotion/styled';
import type { ControllerLayout } from '../../store/ayeohStore';
import type { GamepadSnapshot } from '../../input/types';
import { GAMEPAD_BUTTON_LABELS } from '../../input/normalize';

const BUTTON_INDEX = {
  a: 0,
  b: 1,
  x: 2,
  y: 3,
  lb: 4,
  rb: 5,
  lt: 6,
  rt: 7,
  select: 8,
  start: 9,
  leftStickClick: 10,
  rightStickClick: 11,
  dpadUp: 12,
  dpadDown: 13,
  dpadLeft: 14,
  dpadRight: 15,
  home: 16,
} as const;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 10px;
  background: ${(props) => (props.theme.overlay ? 'transparent' : props.theme.background)};
`;

const Label = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.textMuted};
`;

const Button = styled.div<{ active: boolean; size?: number }>`
  width: ${(props) => props.size ?? 2}rem;
  height: ${(props) => props.size ?? 2}rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => (props.active ? props.theme.accent : props.theme.surface)};
  color: ${(props) => (props.active ? '#fff' : props.theme.text)};
`;

const Bar = styled.div<{ active: boolean }>`
  width: 2.5rem;
  height: 0.9rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => (props.active ? props.theme.accent : props.theme.surface)};
  color: ${(props) => (props.active ? '#fff' : props.theme.text)};
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClusterRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DpadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1.6rem);
  grid-template-rows: repeat(3, 1.6rem);
  gap: 0.15rem;
`;

const FaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1.8rem);
  grid-template-rows: repeat(3, 1.8rem);
  gap: 0.15rem;
`;

const StickArea = styled.div`
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.surface};
`;

const StickDot = styled.div<{ active: boolean; x: number; y: number }>`
  position: absolute;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: ${(props) => (props.active ? props.theme.accent : props.theme.textMuted)};
  left: calc(50% + ${(props) => props.x * 0.9}rem - 0.5rem);
  top: calc(50% + ${(props) => props.y * 0.9}rem - 0.5rem);
`;

const StickStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const SticksRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const GenericList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const GenericEntry = styled.li<{ active: boolean }>`
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => (props.active ? props.theme.accent : props.theme.surface)};
  color: ${(props) => (props.active ? '#fff' : props.theme.text)};
`;

function isPressed(gamepad: GamepadSnapshot, index: number): boolean {
  return gamepad.buttons[index]?.pressed ?? false;
}

function GenericLayout({ gamepad }: { gamepad: GamepadSnapshot }): React.JSX.Element {
  return (
    <GenericList>
      {gamepad.buttons.map((button, index) => (
        <GenericEntry key={index} active={button.pressed}>
          {GAMEPAD_BUTTON_LABELS[index] ?? `Button ${index}`}
        </GenericEntry>
      ))}
      {gamepad.axes.map((value, index) => (
        <GenericEntry key={`axis-${index}`} active={Math.abs(value) > 0.5}>
          Axis {index}: {value.toFixed(2)}
        </GenericEntry>
      ))}
    </GenericList>
  );
}

function XboxLayout({ gamepad }: { gamepad: GamepadSnapshot }): React.JSX.Element {
  const leftStickActive = isPressed(gamepad, BUTTON_INDEX.leftStickClick);
  const rightStickActive = isPressed(gamepad, BUTTON_INDEX.rightStickClick);

  return (
    <>
      <TopRow>
        <Bar active={isPressed(gamepad, BUTTON_INDEX.lt)}>LT</Bar>
        <Bar active={isPressed(gamepad, BUTTON_INDEX.lb)}>LB</Bar>
        <Button active={isPressed(gamepad, BUTTON_INDEX.select)} size={1.3}>
          ⧉
        </Button>
        <Button active={isPressed(gamepad, BUTTON_INDEX.home)} size={1.3}>
          ⏻
        </Button>
        <Button active={isPressed(gamepad, BUTTON_INDEX.start)} size={1.3}>
          ☰
        </Button>
        <Bar active={isPressed(gamepad, BUTTON_INDEX.rb)}>RB</Bar>
        <Bar active={isPressed(gamepad, BUTTON_INDEX.rt)}>RT</Bar>
      </TopRow>

      <ClusterRow>
        <DpadGrid>
          <div />
          <Button active={isPressed(gamepad, BUTTON_INDEX.dpadUp)}>↑</Button>
          <div />
          <Button active={isPressed(gamepad, BUTTON_INDEX.dpadLeft)}>←</Button>
          <div />
          <Button active={isPressed(gamepad, BUTTON_INDEX.dpadRight)}>→</Button>
          <div />
          <Button active={isPressed(gamepad, BUTTON_INDEX.dpadDown)}>↓</Button>
          <div />
        </DpadGrid>

        <FaceGrid>
          <div />
          <Button active={isPressed(gamepad, BUTTON_INDEX.y)}>Y</Button>
          <div />
          <Button active={isPressed(gamepad, BUTTON_INDEX.x)}>X</Button>
          <div />
          <Button active={isPressed(gamepad, BUTTON_INDEX.b)}>B</Button>
          <div />
          <Button active={isPressed(gamepad, BUTTON_INDEX.a)}>A</Button>
          <div />
        </FaceGrid>
      </ClusterRow>

      <SticksRow>
        <StickStack>
          <StickArea>
            <StickDot
              active={leftStickActive}
              x={gamepad.axes[0] ?? 0}
              y={gamepad.axes[1] ?? 0}
            />
          </StickArea>
          <Label>L Stick</Label>
        </StickStack>
        <StickStack>
          <StickArea>
            <StickDot
              active={rightStickActive}
              x={gamepad.axes[2] ?? 0}
              y={gamepad.axes[3] ?? 0}
            />
          </StickArea>
          <Label>R Stick</Label>
        </StickStack>
      </SticksRow>
    </>
  );
}

export function ControllerView({
  gamepad,
  layout,
}: {
  gamepad: GamepadSnapshot;
  layout: ControllerLayout;
}): React.JSX.Element {
  return (
    <Wrapper aria-label={`Controller ${gamepad.index}`}>
      <Label>{gamepad.id}</Label>
      {layout === 'xbox' ? <XboxLayout gamepad={gamepad} /> : <GenericLayout gamepad={gamepad} />}
    </Wrapper>
  );
}
