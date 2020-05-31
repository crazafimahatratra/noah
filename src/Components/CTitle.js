import React from 'react';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down("xs")]: {
            width: "100%"
        }
    },
    title: {
        marginBottom: 0,
        color: "black",
        [theme.breakpoints.down("xs")]: {
            margin: 0,
        }
    },
    subtitle: {
        lineHeight: 0,
        color: "#829299",
        marginTop: theme.spacing(1),
        fontWeight: 400,
        marginBottom: theme.spacing(2)
    },
}));

/**
 * 
 * @param {{subtitle: string}} props 
 */
export default function CTitle(props) {
    const classes = styles();
    return (
        <div className={classes.root}>
            <h1 className={classes.title}>{props.children}</h1>
            {props.subtitle && <h2 className={classes.subtitle}>{props.subtitle}</h2>}
        </div>
    )
}
