import React from 'react';
import { Breadcrumbs, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Home, KeyboardArrowRight } from '@material-ui/icons';
import clsx from 'clsx';

const styles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
    },
    li: {
        fontSize: 12,
    },
    separator: {
        fontSize: 12,
    },
    link: {
        textDecoration: "none",
        color: theme.palette.grey[500],
    },
    current: {
        color: theme.palette.grey[800],
        cursor: "default"
    },
}));

/**
 * 
 * @param {{links: [{link: string, label: string}]}} props 
 */
export default function CBreadcrumbs(props) {
    const classes = styles();
    return (
        <Breadcrumbs separator={<KeyboardArrowRight />} classes={{ li: classes.li, separator: classes.separator, root: classes.root }}>
            <Link className={classes.link} to="/"><Home /></Link>
            {Array.isArray(props.links) && props.links.map((link, i) =>
                <Link className={clsx(classes.link, { [classes.current]: i === (props.links.length - 1) })} key={`link-${i}`} to={link.link}>{link.label}</Link>
            )}
        </Breadcrumbs>
    );
}