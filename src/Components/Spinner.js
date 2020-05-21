import React from 'react';
import { SvgIcon, makeStyles, useTheme } from '@material-ui/core';

const styles = makeStyles(() => ({
    "@keyframes rotate": {
        from: {
            transform: "rotate(0deg)"
        },
        to: {
            transform: "rotate(360deg)"
        }
    },
    animationRotate: {
        animation: "$rotate",
        animationDuration: "1s",
        animationIterationCount: "infinite",
        animationTimingFunction: "linear"
    },
}));

/**
 * 
 * @param {{color: string}} props 
 */
export default function Spinner(props) {
    const classes = styles();
    const theme = useTheme();
    return (
        <SvgIcon className={classes.animationRotate} {...props} width="200px" height="200px" viewBox="0 0 100 100">
            <circle cx="50" cy="50" fill="none" stroke={props.color ? props.color : theme.palette.primary.dark} strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="matrix(1,0,0,1,0,0)" ></circle>
        </SvgIcon>
    );
};

