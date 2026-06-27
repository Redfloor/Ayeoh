import styled from '@emotion/styled';
import { useAyeohStore } from '../../store/ayeohStore';
import { FUNCTION_ROW, MAIN_ROWS, NAV_ROWS, NUMPAD_ROWS, type KeyToken } from './keyboardLayout';

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1rem;
  border-radius: 12px;
  background: ${(props) => (props.theme.overlay ? 'transparent' : props.theme.surface)};
  border: ${(props) => (props.theme.overlay ? 'none' : `1px solid ${props.theme.border}`)};
`;

const Title = styled.h2`
  margin: 0 0 0.25rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.textMuted};
`;

const Board = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Cluster = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const Key = styled.div<{ flex: number; active: boolean; empty: boolean }>`
  flex: ${(props) => props.flex};
  visibility: ${(props) => (props.empty ? 'hidden' : 'visible')};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6rem;
  height: 1.8rem;
  border-radius: 4px;
  font-size: 0.7rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => (props.active ? props.theme.accent : props.theme.surface)};
  color: ${(props) => (props.active ? '#fff' : props.theme.text)};
  transition: background 60ms ease-out;
`;

function KeyCell({ token, active }: { token: KeyToken | null; active: boolean }): React.JSX.Element {
  if (token === null) {
    return <Key flex={1} active={false} empty />;
  }
  return (
    <Key flex={token.flex} active={active} empty={false}>
      {token.label}
    </Key>
  );
}

export function KeyboardView(): React.JSX.Element {
  const activeKeys = useAyeohStore((state) => state.activeKeys);

  return (
    <Panel aria-label="Keyboard">
      <Title>Keyboard</Title>
      <Cluster>
        <Row>
          {FUNCTION_ROW.map((token) => (
            <KeyCell key={token.key} token={token} active={activeKeys[token.key] ?? false} />
          ))}
        </Row>
      </Cluster>
      <Board>
        <Cluster style={{ flex: 1 }}>
          {MAIN_ROWS.map((row, rowIndex) => (
            <Row key={rowIndex}>
              {row.map((token) => (
                <KeyCell key={token.key} token={token} active={activeKeys[token.key] ?? false} />
              ))}
            </Row>
          ))}
        </Cluster>
        <Cluster>
          {NAV_ROWS.map((row, rowIndex) => (
            <Row key={rowIndex}>
              {row.map((token, tokenIndex) => (
                <KeyCell
                  key={token?.key ?? `empty-${rowIndex}-${tokenIndex}`}
                  token={token}
                  active={token !== null && (activeKeys[token.key] ?? false)}
                />
              ))}
            </Row>
          ))}
        </Cluster>
        <Cluster>
          {NUMPAD_ROWS.map((row, rowIndex) => (
            <Row key={rowIndex}>
              {row.map((token, tokenIndex) => (
                <KeyCell
                  key={token?.key ?? `empty-${rowIndex}-${tokenIndex}`}
                  token={token}
                  active={token !== null && (activeKeys[token.key] ?? false)}
                />
              ))}
            </Row>
          ))}
        </Cluster>
      </Board>
    </Panel>
  );
}
