import { useState } from 'react';
import styled from '@emotion/styled';
import { useAyeohStore } from '../../store/ayeohStore';
import { Dashboard } from '../Dashboard/Dashboard';
import { InputLog } from '../InputLog/InputLog';
import { SettingsScreen } from '../SettingsScreen/SettingsScreen';

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${(props) => (props.theme.overlay ? 'transparent' : props.theme.background)};
`;

const TopBar = styled.header<{ overlay: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: ${(props) => (props.overlay ? 'transparent' : 'none')};
  border-bottom: ${(props) => (props.overlay ? 'none' : `1px solid ${props.theme.border}`)};
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CloseButton = styled(NavButton)`
  &:hover {
    background: #e5484d;
    border-color: #e5484d;
    color: #fff;
  }
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export function Layout(): React.JSX.Element {
  const [showSettings, setShowSettings] = useState(false);
  const overlayMode = useAyeohStore((state) => state.settings.overlayMode);
  const showLog = useAyeohStore((state) => state.settings.visiblePanels.log);

  return (
    <Shell>
      <TopBar overlay={overlayMode}>
        <Title>Ayeoh</Title>
        <ButtonGroup>
          <NavButton onClick={() => setShowSettings((value) => !value)}>
            {showSettings ? 'Back' : 'Settings'}
          </NavButton>
          <CloseButton aria-label="Close Ayeoh" onClick={() => window.ayeoh?.quitApp()}>
            ✕
          </CloseButton>
        </ButtonGroup>
      </TopBar>
      {showSettings ? (
        <SettingsScreen />
      ) : (
        <Body>
          <Dashboard />
          {showLog && <InputLog />}
        </Body>
      )}
    </Shell>
  );
}
