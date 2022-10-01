# React Currency Input

## Installation

```bash
npm install --save @jonnsl/react-currency-input
```

## Examples

```javascript
import React, { useState } from "react";
import Money from "@jonnsl/react-currency-input";

function BRLInput (props) {
  const [value, setValue] = useState(0);

  return <Money prefix="R$" max={99999999} onChange={(v) => setValue(v)} value={value} />;
}

export default BRLInput;
```

## Props

| Props | Options | Default | Description |
| - | - | - | - |
| prefix | string | undefined | String to be added before the formatted number. |
| name | string | undefined | Attribute name for the html input |
| className | string | undefined | A string variable representing the class or space-separated classes of the current element. |
| id | string | undefined | the element's identifier |
| value | number | undefined | Input value |
| defaultValue | strnumbering | undefined | Initial value for the input when the component is first mounted.  |
| readOnly | boolean | undefined | indicates that the element is not editable, but is otherwise operable. |
| disabled | boolean | undefined | element is perceivable but disabled, so it is not editable or otherwise operable. |
| required | boolean | undefined |  indicates that user input is required on the element before a form may be submitted. |
| placeholder | string | undefined | defines a short hint intended to aid the user with data entry when the control has no value. |
| max | number | undefined | defines the maximum allowed value for the input. |
| style | CSSProperties | undefined | CSS styling declarations to be applied to the input element. |
| tabIndex | number | undefined | indicates that its element can be focused, and where it participates in sequential keyboard navigation (usually with the Tab key, hence the name). |
| title | string | undefined | text representing advisory information related to the element it belongs to. |
| onChange | (newValue: number) => void | undefined | The change event is fired when the user modifies the input's value. |

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
