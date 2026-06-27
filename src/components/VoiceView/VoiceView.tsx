import styled from '@emotion/styled';
import { useAyeohStore } from '../../store/ayeohStore';

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  background: ${(props) => (props.theme.overlay ? 'transparent' : props.theme.surface)};
  border: ${(props) => (props.theme.overlay ? 'none' : `1px solid ${props.theme.border}`)};
  min-height: 6rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.textMuted};
`;

const Transcript = styled.div`
  font-size: 0.85rem;
  color: ${(props) => props.theme.text};
`;

const Empty = styled.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme.textMuted};
`;

const VOICE_HISTORY_LIMIT = 5;

export function VoiceView(): React.JSX.Element {
  const history = useAyeohStore((state) => state.history);
  const voiceEvents = history.filter((event) => event.source === 'voice').slice(0, VOICE_HISTORY_LIMIT);

  return (
    <Panel aria-label="Voice">
      <Title>Voice</Title>
      {voiceEvents.length === 0 ? (
        <Empty>Nothing heard yet.</Empty>
      ) : (
        voiceEvents.map((event) => <Transcript key={event.id}>{event.label}</Transcript>)
      )}
    </Panel>
  );
}
