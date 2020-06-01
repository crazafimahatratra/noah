import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, makeStyles, Popover, List, Button, useTheme, ListItem, ListItemText, useMediaQuery, Divider, ListItemIcon } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Menu, KeyboardArrowDown } from '@material-ui/icons';
import { UserContext } from '../../AppContext';
import { useHistory } from 'react-router-dom';
import Session from '../../Auth/Session';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import MenuLang from '../../Components/MenuLang';

const session = new Session();

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
    menuButton: {
        color: theme.palette.grey[600],
        textTransform: "none",
        "& svg": {
            color: theme.palette.grey[700],
        },
    },
    menuItem: {
        color: theme.palette.text.primary,
    },
}));

const MenuUser = () => {
    const classes = styles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.down("xs"));
    const userContext = useContext(UserContext);
    const history = useHistory();
    const [t,] = useTranslation();

    /**
     * 
     * @param {Event} evt 
     */
    const handleClick = (evt) => {
        setAnchorEl(evt.target);
    };

    const handleDisconnect = () => {
        session.clear();
        history.replace("/auth");
    };

    const handleMyAccount = () => {
        setAnchorEl(null);
        history.push("/my-account");
    }
    return (
        <>
            <Button onClick={handleClick} className={classes.menuButton}>
                <AccountCircle style={{ marginRight: theme.spacing(1) }} />
                <span>{userContext.user.firstname}</span>
                <KeyboardArrowDown />
            </Button>
            <Popover anchorEl={anchorEl} open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <List>
                    {xs &&
                        <>
                            <ListItem disabled>
                                <ListItemIcon><AccountCircle /></ListItemIcon>
                                <ListItemText className={classes.menuItem} primary={userContext.user.firstname} />
                            </ListItem>
                            <Divider />
                        </>
                    }
                    <ListItem button onClick={handleMyAccount}>
                        <ListItemText className={classes.menuItem} primary={t("appbar.my-account")} />
                    </ListItem>
                    <ListItem button onClick={handleDisconnect}>
                        <ListItemText className={classes.menuItem} primary={t("appbar.logout")} />
                    </ListItem>
                </List>
            </Popover>
        </>
    );
};

/**
 * 
 * @param {{onToggleMenu: () => {}}} props 
 */
export default function CAppBar(props) {
    const classes = styles();
    return (
        <AppBar position="fixed" elevation={0} className={clsx(classes.appBar)}>
            <Toolbar variant="regular">
                <IconButton onClick={props.onToggleMenu} className={clsx(classes.menuButton)}>
                    <Menu className={classes.menuButton} />
                </IconButton>
                <div style={{ flexGrow: 1 }}></div>
                <MenuLang className={classes.menuButton} />
                <MenuUser />
            </Toolbar>
        </AppBar>
    );
};