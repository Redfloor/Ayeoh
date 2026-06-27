export type InputSource = 'keyboard' | 'mouse' | 'gamepad' | 'voice';

interface BaseInputEvent {
  id: string;
  source: InputSource;
  label: string;
  timestamp: number;
}

export interface KeyboardInputEvent extends BaseInputEvent {
  source: 'keyboard';
  key: string;
}

export interface MouseInputEvent extends BaseInputEvent {
  source: 'mouse';
  kind: 'button' | 'move' | 'wheel';
  button?: number;
}

export interface GamepadInputEvent extends BaseInputEvent {
  source: 'gamepad';
  kind: 'button' | 'axis';
  gamepadIndex: number;
  controlIndex: number;
}

export interface VoiceInputEvent extends BaseInputEvent {
  source: 'voice';
  transcript: string;
}

export type InputEvent =
  | KeyboardInputEvent
  | MouseInputEvent
  | GamepadInputEvent
  | VoiceInputEvent;

export interface RawKeyboardPayload {
  key: string;
  direction: 'down' | 'up';
}

export interface RawMousePayload {
  kind: 'button' | 'move' | 'wheel';
  button?: number;
  x?: number;
  y?: number;
  direction?: 'down' | 'up';
}

export interface RawVoicePayload {
  transcript: string;
}
