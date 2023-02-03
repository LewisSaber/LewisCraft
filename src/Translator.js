export default function TranslateName(name) {
    return TranslationTable.EN.get(name) || name.capitalize()
}
export function TranslateRarity(rarity = 0) {
    return RarityList.get(rarity, "Common")
}


const RarityList = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]
const TranslationTable = {}
TranslationTable.EN = {
    "MOVE_FORWARD": "Move Up",
    "MOVE_BACK": "Move Down",
    "MOVE_LEFT": "Move Left",
    "MOVE_RIGHT": "Move Rigth",
    "OPEN_INVENTORY": "Open Inventory",
    "logoak": "Oak Log",
    "planksoak": "Oak Planks",
    'smallbackpack': "Small Backpack"
}

export function TranslateKeyCode(KeyCode) {
    return KeyCodes.get(KeyCode) || KeyCode
}
const KeyCodes = {
    "KeyQ": "Q",
    "KeyW": "W",
    "KeyE": "E",
    "KeyR": "R",
    "KeyT": "T",
    "KeyY": "Y",
    "KeyU": "U",
    "KeyI": "I",
    "KeyO": "O",
    "KeyP": "P",
    "KeyA": "A",
    "KeyS": "S",
    "KeyD": "D",
    "KeyF": "F",
    "KeyG": "G",
    "KeyH": "H",
    "KeyJ": "J",
    "KeyK": "K",
    "KeyL": "L",
    "KeyZ": "Z",
    "KeyX": "X",
    "KeyC": "C",
    "KeyV": "V",
    "KeyB": "B",
    "KeyN": "N",
    "KeyM": "M",
    "Numpad0": "Num0",
    "Numpad1": "Num1",
    "Numpad2": "Num2",
    "Numpad3": "Num3",
    "Numpad4": "Num4",
    "Numpad5": "Num5",
    "Numpad6": "Num6",
    "Numpad7": "Num7",
    "Numpad8": "Num8",
    "Numpad9": "Num9",
    "NumpadDivide": "NumDiv",
    "NumpadMultiply": "NumMul",
    "NumpadSubstract": "NumSub",
    "NumpadAdd": "NumAdd",
    "NumpadEnter": "NumEnter",
    "ShiftLeft": "Left Shift",
    "ShiftRight": "Right Shift",
    "Backquote": "Grave",
    "ControlLeft": "CtrlLeft",
    "ControlRight": "CtrlRight",
    "Minus": "-",
    "Equal": "=",
    "ArrowUp": "🠕",
    "ArrowLeft": "🠔",
    "ArrowRight": "🠖",
    "ArrowDown": "🠗",
    "Backslash": "\\",
    "Comma": ",",
    "Peridot": ".",
    "Slash": "/",
    "Quote": '"',
    "Semicolon": ";",
    "BracketLeft": "[",
    "BracketRight": "]",
    "none": "None"
}
