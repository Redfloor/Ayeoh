export interface KeyToken {
  key: string;
  label: string;
  flex: number;
}

function k(key: string, label?: string, flex = 1): KeyToken {
  return { key, label: label ?? key, flex };
}

export const FUNCTION_ROW: KeyToken[] = [
  k('Escape', 'Esc'),
  k('F1'),
  k('F2'),
  k('F3'),
  k('F4'),
  k('F5'),
  k('F6'),
  k('F7'),
  k('F8'),
  k('F9'),
  k('F10'),
  k('F11'),
  k('F12'),
];

export const MAIN_ROWS: KeyToken[][] = [
  [
    k('Backquote', '`'),
    k('1'),
    k('2'),
    k('3'),
    k('4'),
    k('5'),
    k('6'),
    k('7'),
    k('8'),
    k('9'),
    k('0'),
    k('Minus', '-'),
    k('Equal', '='),
    k('Backspace', '⌫', 2),
  ],
  [
    k('Tab', 'Tab', 1.5),
    k('Q'),
    k('W'),
    k('E'),
    k('R'),
    k('T'),
    k('Y'),
    k('U'),
    k('I'),
    k('O'),
    k('P'),
    k('BracketLeft', '['),
    k('BracketRight', ']'),
    k('Backslash', '\\', 1.5),
  ],
  [
    k('CapsLock', 'Caps', 1.75),
    k('A'),
    k('S'),
    k('D'),
    k('F'),
    k('G'),
    k('H'),
    k('J'),
    k('K'),
    k('L'),
    k('Semicolon', ';'),
    k('Quote', "'"),
    k('Enter', 'Enter', 2.25),
  ],
  [
    k('Shift', 'Shift', 2.25),
    k('Z'),
    k('X'),
    k('C'),
    k('V'),
    k('B'),
    k('N'),
    k('M'),
    k('Comma', ','),
    k('Period', '.'),
    k('Slash', '/'),
    k('ShiftRight', 'Shift', 2.75),
  ],
  [
    k('Ctrl', 'Ctrl', 1.5),
    k('Meta', 'Win'),
    k('Alt', 'Alt'),
    k('Space', '', 6),
    k('AltRight', 'Alt'),
    k('MetaRight', 'Win'),
    k('CtrlRight', 'Ctrl', 1.5),
  ],
];

export const NAV_ROWS: (KeyToken | null)[][] = [
  [k('PrintScreen', 'PrtSc'), k('ScrollLock', 'ScrLk')],
  [k('Insert', 'Ins'), k('Home', 'Home'), k('PageUp', 'PgUp')],
  [k('Delete', 'Del'), k('End', 'End'), k('PageDown', 'PgDn')],
  [null, null, null],
  [null, k('ArrowUp', '↑'), null],
  [k('ArrowLeft', '←'), k('ArrowDown', '↓'), k('ArrowRight', '→')],
];

export const NUMPAD_ROWS: (KeyToken | null)[][] = [
  [k('NumLock', 'Num'), k('NumpadDivide', '/'), k('NumpadMultiply', '*'), k('NumpadSubtract', '-')],
  [k('Numpad7', '7'), k('Numpad8', '8'), k('Numpad9', '9'), k('NumpadAdd', '+')],
  [k('Numpad4', '4'), k('Numpad5', '5'), k('Numpad6', '6'), null],
  [k('Numpad1', '1'), k('Numpad2', '2'), k('Numpad3', '3'), k('NumpadEnter', 'Enter')],
  [k('Numpad0', '0'), null, k('NumpadDecimal', '.'), null],
];
