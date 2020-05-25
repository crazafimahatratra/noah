import React from 'react';
import { Drawer, makeStyles, IconButton, useTheme, useMediaQuery, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Logo from '../../Images/Logo-long.svg';
import { ChevronLeft, Dashboard, ShoppingCartOutlined, BubbleChart } from '@material-ui/icons';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const styles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        transitionProperty: "width",
        transitionDuration: "300 ms",
    },
    drawerPaper: {
        width: drawerWidth,
        transitionProperty: "width",
        transitionDuration: "300 ms",
    },
    close: {
        width: 0
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'space-between',
        "& img": {
            maxWidth: 170,
        }
    },
    listItemIcon: {
        minWidth: 0,
        marginRight: theme.spacing(1),
    },
    listItemText: {
        fontWeight: 500,
        fontSize: 14,
    },
    iconExpand: {
        transform: "rotate(-90deg)",
        transitionProperty: "transform",
    },
    iconExpandExpanded: {
        transform: "rotate(0deg)"
    },
    subMenu: {
    },
    subMenuItem: {
        paddingLeft: theme.spacing(8),
    },
    subMenuItemText: {
        fontSize: 14,
    },
}))

/**
 * 
 * @param {{open: boolean, onClose: () => {}}} props 
 */
export default function CDrawer(props) {
    const classes = styles();
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.down("xs"));
    const [t,] = useTranslation();
    const history = useHistory();
    const location = useLocation();

    const handleClick = (url) => () => {
        history.push(url);
        if (props.onClose && xs) props.onClose();
    };
    return (
        <Drawer className={clsx(classes.drawer, { [classes.close]: !props.open })}
            classes={{ paper: clsx(classes.drawerPaper, { [classes.close]: !props.open }) }}
            open={props.open} variant={xs ? "temporary" : "permanent"}
            onClose={props.onClose}
        >
            <div className={classes.drawerHeader}>
                <img src={Logo} alt="Logo" />
                <IconButton onClick={props.onClose}>
                    <ChevronLeft />
                </IconButton>
            </div>
            <List>
                <ListItem button onClick={handleClick("/")} selected={location.pathname === "/"}>
                    <ListItemIcon className={classes.listItemIcon}><Dashboard /></ListItemIcon>
                    <ListItemText classes={{ primary: classes.listItemText }} primary={t("menus.my-diary")} />
                </ListItem>
                <ListItem button onClick={handleClick("/products")} selected={location.pathname === "/products"}>
                    <ListItemIcon className={classes.listItemIcon}><ShoppingCartOutlined /></ListItemIcon>
                    <ListItemText classes={{ primary: classes.listItemText }} primary={t("menus.my-products")} />
                </ListItem>
                <ListItem button onClick={handleClick("/charts")} selected={location.pathname === "/charts"}>
                    <ListItemIcon className={classes.listItemIcon}><BubbleChart /></ListItemIcon>
                    <ListItemText classes={{ primary: classes.listItemText }} primary={t("menus.charts")} />
                </ListItem>
            </List>
        </Drawer>
    );
}