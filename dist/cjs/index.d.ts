import React, { ChangeEvent, KeyboardEvent, PureComponent, CSSProperties } from 'react';
export declare type MoneyProps = {
    prefix?: string;
    name?: string;
    className?: string;
    id?: string;
    value?: number;
    defaultValue?: number;
    readOnly?: boolean;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    /** Maximum value as cents */
    max?: number;
    style?: CSSProperties;
    tabIndex?: number;
    title?: string;
    onChange?: (newValue: number) => void;
};
declare type MoneyState = {
    value: number;
};
export default class Money extends PureComponent<MoneyProps, MoneyState> {
    selectionStart: number | null;
    selectionEnd: number | null;
    inputRef: React.RefObject<HTMLInputElement>;
    constructor(props: MoneyProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    setValue(value: number): void;
    handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
    getCurrentValue(): number;
    formatedValue(): string;
    render(): JSX.Element;
}
export declare function deriveNewValueAndCursorPosition(currentValue: string, selectionStart: number, selectionEnd: number, key: string): [number, number];
export {};
