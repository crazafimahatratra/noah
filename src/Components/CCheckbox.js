import React from 'react';
import { FormControlLabel, Checkbox, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const styles = makeStyles((theme) => ({
    fullWidth: {
        width: "100%",
    }
}))

/**
 * 
 * @param {{label: string, fullWidth: boolean, className: string}} props 
 */
export default function CCheckbox(props) {
    const classes = styles();
    return (
        <FormControlLabel className={clsx(classes.root, {[classes.fullWidth]: props.fullWidth}, props.className)} label={props.label} control={<Checkbox/>}/>
    );
}