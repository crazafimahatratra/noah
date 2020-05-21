import React from 'react';

export default function EllipsisSpan(props) {
    return (
        <span style={{display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
            {props.children}
        </span>
    );
}
