import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import {useMemo, useState} from "react";

const plugins = [Paragraph];

export default function Editor() {
    const editor = useMemo(() => createYooptaEditor(), []);
    const [value, setValue] = useState();
    const onChange = (value, options) => {
        setValue(value);
    };

    return (
        <div>
            <YooptaEditor
                editor={editor}
                placeholder="Type text.."
                value={value}
                onChange={onChange}
                // here we go
                plugins={plugins}
            />
        </div>
    );
}
