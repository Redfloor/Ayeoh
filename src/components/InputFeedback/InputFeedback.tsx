import styled from '@emotion/styled';
import { useAyeohStore } from '../../store/ayeohStore';
import type { InputSource } from '../../input/types';

const SOURCE_ICON: Record<InputSource, string> = {
  keyboard: '⌨️',
  mouse: '🖱️',
  gamepad: '🎮',
  voice: '🎤',
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex: 1;
  padding: 2rem;
`;

const Icon = styled.div`
  font-size: 8rem;
  line-height: 1;
`;

const Label = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${(props) => props.theme.text};
  text-align: center;
`;

const Empty = styled.div`
  font-size: 1.5rem;
  color: ${(props) => props.theme.textMuted};
`;

export function InputFeedback(): React.JSX.Element {
  const latest = useAyeohStore((state) => state.latest);

  if (latest === null) {
    return (
      <Wrapper>
        <Empty>Press a key, move the mouse, use a controller, or speak.</Empty>
      </Wrapper>
    );
  }

  return (
    <Wrapper key={latest.id}>
      <Icon aria-hidden="true">{SOURCE_ICON[latest.source]}</Icon>
      <Label>{latest.label}</Label>
    </Wrapper>
  );
}
