import React from 'react';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles((theme) => ({
    root: {
        fontSize: 32,
        marginBottom: 0,
        color: "black",
    },
    subtitle: {
        fontSize: 18,
        lineHeight: 0,
        color: theme.palette.grey[600],
        marginTop: theme.spacing(1),
        fontWeight: 400,
        marginBottom: theme.spacing(4),
    },
}));

/**
 * 
 * @param {{subtitle: string}} props 
 */
export default function CTitle(props) {
    const classes = styles();
    return (
        <div>
            <h1 className={classes.root}>{props.children}</h1>
            {props.subtitle && <h2 className={classes.subtitle}>{props.subtitle}</h2>}
        </div>
    )
}
