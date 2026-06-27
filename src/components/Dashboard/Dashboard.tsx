import styled from '@emotion/styled';
import { KeyboardView } from '../KeyboardView/KeyboardView';
import { MouseView } from '../MouseView/MouseView';
import { ControllerPanel } from '../ControllerView/ControllerPanel';
import { VoiceView } from '../VoiceView/VoiceView';

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  padding: 1rem;
  overflow: auto;
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Column = styled.div`
  flex: 1;
  min-width: 0;
`;

export function Dashboard(): React.JSX.Element {
  return (
    <Grid>
      <KeyboardView />
      <Row>
        <Column>
          <MouseView />
        </Column>
        <Column style={{ flex: 1.5 }}>
          <ControllerPanel />
        </Column>
        <Column>
          <VoiceView />
        </Column>
      </Row>
    </Grid>
  );
}
