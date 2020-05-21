import React from 'react';
import Spinner from '../Icons/Spinner';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles(() => ({
    root: {
        display: "flex",
        height: "50vh",
        alignItems: "center",
        justifyContent: "center",
        "& svg": {
            width: 50,
            height: 50,
        },
    }
}))

export default function Loader(props) {
    const classes = styles();
    return (
        <div className={classes.root}>
            <Spinner/>
        </div>
    );
};
