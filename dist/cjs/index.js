"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveNewValueAndCursorPosition = void 0;
const react_1 = __importStar(require("react"));
class Money extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.selectionStart = null;
        this.selectionEnd = null;
        this.handleChange = (event) => {
            this.setValue(parseValue(event.target.value));
        };
        this.handleKeyDown = (event) => {
            // Pressed key won't change the value...
            if (event.ctrlKey || isNavigationKey(event.key) || isFunctionKey(event.key) || event.key === 'Enter' || event.key === 'Tab') {
                // ...nothing to be done
                return;
            }
            event.preventDefault();
            // Pressed key is not a number or a predefined key (Backspace, delete, Tab, etc...)
            if (!isPredefinedKeys(event.key) && !isInt(event.key)) {
                return;
            }
            // selectionStart and selectionEnd is only available for inputs of types: text, search, url, tel, and password.
            // TypeScript is not aware that the input is of type text and these properties are never null so we need to add this check even though it's unnecessary.
            if (event.currentTarget.selectionStart === null || event.currentTarget.selectionEnd === null) {
                return;
            }
            const prefix = this.props.prefix;
            const currentValue = this.getCurrentValue();
            const currentValueAsString = event.currentTarget.value;
            const prefixLength = prefix === undefined ? 0 : prefix.length + 1;
            const currentValueNoPrefix = prefix !== undefined && currentValueAsString.indexOf(prefix) === 0 ? currentValueAsString.substring(prefixLength) : currentValueAsString;
            const selectionStart = event.currentTarget.selectionStart - prefixLength;
            const selectionEnd = event.currentTarget.selectionEnd - prefixLength;
            const [newValue, selection] = deriveNewValueAndCursorPosition(currentValueNoPrefix, selectionStart, selectionEnd, event.key);
            const selectionPlusPrefix = selection + prefixLength;
            const maxValue = this.props.max !== undefined ? this.props.max : Number.MAX_SAFE_INTEGER;
            if ((currentValue !== newValue || event.currentTarget.selectionEnd !== selectionPlusPrefix) && newValue <= maxValue) {
                this.selectionStart = this.selectionEnd = selectionPlusPrefix;
                this.setValue(newValue);
            }
        };
        this.state = {
            value: props.defaultValue || 0
        };
        this.inputRef = react_1.default.createRef();
    }
    componentDidMount() {
        const { value, readOnly, onChange } = this.props;
        if (value !== undefined && (onChange === undefined && (readOnly === undefined || readOnly === false))) {
            console.warn('Warning: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.');
        }
    }
    componentDidUpdate() {
        if (this.inputRef.current !== null && this.selectionStart !== null && this.selectionEnd !== null) {
            this.inputRef.current.selectionStart = this.selectionStart;
            this.inputRef.current.selectionEnd = this.selectionEnd;
            this.selectionStart = this.selectionEnd = null;
        }
    }
    setValue(value) {
        if (this.props.value === undefined) { // Uncontrolled input
            this.setState({ value });
        }
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
    getCurrentValue() {
        return this.props.value !== undefined ? this.props.value : this.state.value;
    }
    formatedValue() {
        const value = centavosToPtBr(this.getCurrentValue());
        return (this.props.prefix) ? `${this.props.prefix} ${value}` : `${value}`;
    }
    render() {
        return (react_1.default.createElement("input", { ref: this.inputRef, id: this.props.id, name: this.props.name, className: this.props.className, readOnly: this.props.readOnly, disabled: this.props.disabled, placeholder: this.props.placeholder, required: this.props.required, style: this.props.style, tabIndex: this.props.tabIndex, title: this.props.title, type: "text", inputMode: "decimal", value: this.formatedValue(), onKeyDown: this.handleKeyDown, onChange: this.handleChange }));
    }
}
exports.default = Money;
function parseValue(value) {
    const valueAsNumber = parseInt(value.replace(/\D/g, ''), 10);
    return Number.isNaN(valueAsNumber) ? 0 : valueAsNumber;
}
const functionKeys = [
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
];
const navigationKeys = [
    'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home', 'PageDown',
    'PageUp',
];
const predefinedKeys = [
    'Backspace', 'Clear', 'Copy', 'CrSel', 'Cut', 'Delete', 'EraseEof', 'ExSel',
    'Insert', 'Paste', 'Redo', 'Undo', 'Tab',
];
function isFunctionKey(key) {
    return functionKeys.indexOf(key) !== -1;
}
function isNavigationKey(key) {
    return navigationKeys.indexOf(key) !== -1;
}
function isPredefinedKeys(key) {
    return predefinedKeys.indexOf(key) !== -1;
}
function deriveNewValueAndCursorPosition(currentValue, selectionStart, selectionEnd, key) {
    if (selectionStart > selectionEnd) {
        throw new Error('The start of the selection cannot be after the end of the selection.');
    }
    if (selectionStart > currentValue.length) {
        throw new Error('The start of the selection cannot be after the available text.');
    }
    const charBeforeCursor = currentValue.substring(selectionStart - 1, selectionStart);
    const charAfterCursor = currentValue.substring(selectionEnd, selectionEnd + 1);
    const adjustedSelectionStart = charBeforeCursor === ',' || charBeforeCursor === '.' ? selectionStart - 1 : selectionStart;
    const adjustedSelectionEnd = charAfterCursor === ',' || charAfterCursor === '.' ? selectionEnd + 1 : selectionEnd;
    const isJustACursor = selectionStart === selectionEnd; // i.e. no text actually sellected
    const start = key === 'Backspace' && isJustACursor ? Math.max(0, adjustedSelectionStart - 1) : adjustedSelectionStart;
    const end = key === 'Delete' && isJustACursor ? Math.min(currentValue.length, adjustedSelectionEnd + 1) : adjustedSelectionEnd;
    const cursorPositionFromLeft = end;
    const cursorPositionFromRight = currentValue.length - cursorPositionFromLeft;
    const pre = currentValue.substring(0, start); // String before the cursor
    const mid = isInt(key) ? key : '';
    const pos = currentValue.substring(end); // String after the cursor
    const nextNumber = parseValue(pre + mid + pos);
    const nextValue = centavosToPtBr(nextNumber);
    const nextCursorPosition = Math.max(0, nextValue.length - cursorPositionFromRight);
    return [nextNumber, nextCursorPosition];
}
exports.deriveNewValueAndCursorPosition = deriveNewValueAndCursorPosition;
function isInt(str) {
    return str === '0' || str === '1' || str === '2' || str === '3' || str === '4' || str === '5' || str === '6' || str === '7' || str === '8' || str === '9';
    // return !Number.isNaN(parseInt(str, 10)) // 21% slower
    // const charCode = str.charCodeAt(0); return charCode >= 48 && charCode <= 57 // 15% slower
    // return /^\d$/.test(str) // 62% slower
    // return str >= '0' && str <= '9' // 36% slower
}
function centavosToPtBr(centavos) {
    const formatter = new Intl.NumberFormat('pt-BR', {
        minimumIntegerDigits: 1,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatter.format(centavos / 100);
}
