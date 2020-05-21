import React from 'react';

/**
 * 
 * @param {{for: string}} props 
 */
export default function CLabel(props) {
    return (
        <label style={{fontSize: 14, marginBottom: 3, display: "block"}} htmlFor={props.for}>{props.children}</label>
    );
}
