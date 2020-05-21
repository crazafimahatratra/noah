import React from 'react';
import { makeStyles } from '@material-ui/core';
import CTooltip from './CTooltip';

const styles = makeStyles((theme) => ({
    root: {
        display: 'inline-flex',
        color: theme.palette.grey[400],
        fontWeight: 700,
        fontSize: 10,
        borderWidth: 1,
        borderStyle: "solid",
        padding: [[2, 6]],
        cursor: "default",
        textTransform: "uppercase",
        height: 21,
    },
}))

/**
 * 
 * @param {{label: string, full: boolean}} props 
 */
export default function SmallTag(props) {
    const classes = styles();
    return (
        <CTooltip arrow title={props.label}>
            <div className={classes.root}>
                {props.label ? (props.full ? props.label : props.label.substr(0, 1).toUpperCase()) : ""}
            </div>
        </CTooltip>
    )
}
