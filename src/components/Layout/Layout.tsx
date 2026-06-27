import { useState } from 'react';
import styled from '@emotion/styled';
import { InputFeedback } from '../InputFeedback/InputFeedback';
import { InputLog } from '../InputLog/InputLog';
import { SettingsScreen } from '../SettingsScreen/SettingsScreen';

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${(props) => props.theme.background};
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

const Title = styled.h1`
  font-size: 1.1rem;
  color: ${(props) => props.theme.text};
  margin: 0;
`;

const NavButton = styled.button`
  background: none;
  border: 1px solid ${(props) => props.theme.border};
  color: ${(props) => props.theme.text};
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export function Layout(): React.JSX.Element {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Shell>
      <TopBar>
        <Title>Ayeoh</Title>
        <NavButton onClick={() => setShowSettings((value) => !value)}>
          {showSettings ? 'Back' : 'Settings'}
        </NavButton>
      </TopBar>
      {showSettings ? (
        <SettingsScreen />
      ) : (
        <Body>
          <InputFeedback />
          <InputLog />
        </Body>
      )}
    </Shell>
  );
}
