import React from 'react';
import { Select, MenuItem, makeStyles } from '@material-ui/core';

const styles = makeStyles(() => ({
    root: {
        borderRadius: 0,
        "& fieldset": {
            borderWidth: 0,
        },
    },
    select: {
        paddingTop: 10,
        paddingBottom: 10,
    }
}))

/**
 * 
 * @param {{value: 'fmg'|'ar', onChange: () => {}}} props 
 */
export default function MenuCurrency(props) {
    const classes = styles();
    return (
        <Select value={props.value} onChange={props.onChange} variant="outlined" className={classes.root} 
        classes={{select: classes.select}}>
            <MenuItem value={"fmg"}>Fmg</MenuItem>
            <MenuItem value={"ar"}>Ar</MenuItem>
        </Select>
    );
}
