import React from 'react';
import { AppBar, Toolbar, IconButton, makeStyles } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import clsx from 'clsx';
import MenuLang from '../../Components/MenuLang';
import MenuUser from '../../Components/MenuUser';
import useCommonStyles from '../../Theme';

const styles = makeStyles((theme) => ({
    appBar: {
        background: 'white',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        borderBottomColor: theme.palette.grey[200],
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
    },
}));

/**
 * 
 * @param {{onToggleMenu: () => {}}} props 
 */
export default function CAppBar(props) {
    const classes = styles();
    const commonClasses = useCommonStyles();
    return (
        <AppBar position="fixed" elevation={0} className={clsx(classes.appBar)}>
            <Toolbar variant="regular">
                <IconButton onClick={props.onToggleMenu} className={clsx(commonClasses.menuButton)}>
                    <Menu />
                </IconButton>
                <div style={{ flexGrow: 1 }}></div>
                <MenuLang />
                <MenuUser />
            </Toolbar>
        </AppBar>
    );
};