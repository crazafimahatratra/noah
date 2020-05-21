import React from 'react';
import { Drawer, makeStyles, IconButton, useTheme, useMediaQuery, List, ListItem, ListItemIcon, ListItemText, Collapse } from "@material-ui/core";
import Logo from '../../Images/Logo-long.svg';
import { ChevronLeft, Dashboard, ExpandMore, Group, Settings, CalendarToday } from '@material-ui/icons';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { UserContext } from '../../AppContext';

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
            maxWidth: 150,
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
    const ctx = React.useContext(UserContext);

    const [expanded, setExpanded] = React.useState([true, true, true]);
    const handleExpand = (index) => () => {
        expanded[index] = !expanded[index];
        setExpanded([...expanded]);
    }

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
                    <ListItemText classes={{primary: classes.listItemText}} primary={t("menus.dashboard")} />
                </ListItem>
                <ListItem button onClick={handleExpand(0)}>
                    <ListItemIcon className={classes.listItemIcon}><Group /></ListItemIcon>
                    <ListItemText classes={{primary: classes.listItemText}} primary={t("menus.directory")} />
                    <ExpandMore className={clsx(classes.iconExpand, { [classes.iconExpandExpanded]: expanded[0] })} />
                </ListItem>
                <Collapse in={expanded[0]}>
                    <List component="div" disablePadding className={classes.subMenu}>
                        <ListItem button className={classes.subMenuItem} onClick={handleClick("/employes")} selected={location.pathname === "/employes"}>
                            <ListItemText classes={{primary: classes.subMenuItemText}} primary={t("menus.employes")} />
                        </ListItem>
                    </List>
                </Collapse>
                <ListItem button onClick={handleExpand(1)}>
                    <ListItemIcon className={classes.listItemIcon}><CalendarToday /></ListItemIcon>
                    <ListItemText classes={{primary: classes.listItemText}} primary={t("menus.leaves")} />
                    <ExpandMore className={clsx(classes.iconExpand, { [classes.iconExpandExpanded]: expanded[1] })} />
                </ListItem>
                <Collapse in={expanded[1]}>
                    <List component="div" disablePadding className={classes.subMenu}>
                        <ListItem button className={classes.subMenuItem} onClick={handleClick("/leavings/my-demands")} selected={location.pathname === "/leavings/my-demands"}>
                            <ListItemText classes={{primary: classes.subMenuItemText}} primary={t("menus.my-demands")} />
                        </ListItem>
                    </List>
                </Collapse>
                {(ctx.user.userType === "A") &&
                    <>
                        <ListItem button onClick={handleExpand(2)}>
                            <ListItemIcon className={classes.listItemIcon}><Settings /></ListItemIcon>
                            <ListItemText classes={{primary: classes.listItemText}} primary={t("menus.settings")} />
                            <ExpandMore className={clsx(classes.iconExpand, { [classes.iconExpandExpanded]: expanded[2] })} />
                        </ListItem>
                        <Collapse in={expanded[2]}>
                            <List component="div" disablePadding className={classes.subMenu}>
                                <ListItem button className={classes.subMenuItem} onClick={handleClick("/departments")} selected={location.pathname === "/departments"}>
                                    <ListItemText classes={{primary: classes.subMenuItemText}} primary={t("menus.departments")} />
                                </ListItem>
                                <ListItem button className={classes.subMenuItem} onClick={handleClick("/qualifications")} selected={location.pathname === "/qualifications"}>
                                    <ListItemText classes={{primary: classes.subMenuItemText}} primary={t("menus.qualifications")} />
                                </ListItem>
                                <ListItem button className={classes.subMenuItem} onClick={handleClick("/leaving-types")} selected={location.pathname === "/leaving-types"}>
                                    <ListItemText classes={{primary: classes.subMenuItemText}} primary={t("menus.leaves-types")} />
                                </ListItem>
                            </List>
                        </Collapse>
                    </>}
            </List>
        </Drawer>
    );
}