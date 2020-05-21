import React from 'react';

/**
 * 
 * @param {{value: number, index: number}} props 
 */
export default function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div {...other} hidden={value !== index}>
            {value === index && children}
        </div>
    );
}
