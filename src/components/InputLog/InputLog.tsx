import styled from '@emotion/styled';
import { useAyeohStore } from '../../store/ayeohStore';

const Wrapper = styled.aside`
  width: 260px;
  border-left: ${(props) => (props.theme.overlay ? 'none' : `1px solid ${props.theme.border}`)};
  background: ${(props) => (props.theme.overlay ? 'transparent' : props.theme.surface)};
  overflow-y: auto;
  padding: 1rem;
`;

const Heading = styled.h2`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.textMuted};
  margin: 0 0 0.75rem;
`;

const Entry = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid ${(props) => props.theme.border};
  color: ${(props) => props.theme.text};
  font-size: 0.85rem;
`;

const Time = styled.span`
  color: ${(props) => props.theme.textMuted};
  font-size: 0.75rem;
  white-space: nowrap;
`;

export function InputLog(): React.JSX.Element {
  const history = useAyeohStore((state) => state.history);

  return (
    <Wrapper aria-label="Recent input history">
      <Heading>Recent Input</Heading>
      {history.map((event) => (
        <Entry key={event.id}>
          <span>{event.label}</span>
          <Time>{new Date(event.timestamp).toLocaleTimeString()}</Time>
        </Entry>
      ))}
    </Wrapper>
  );
}
