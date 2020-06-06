import React from 'react';
import { makeStyles, Button, Popover, List, ListItem, ListItemText } from "@material-ui/core";
import { AccountCircle, KeyboardArrowDown } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../AppContext';
import useCommonStyles from '../Theme';
import Session from '../Auth/Session';

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
    menuItem: {
        color: theme.palette.text.primary,
    },
}));

export default function MenuUser () {
    const classes = styles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const userContext = React.useContext(UserContext);
    const history = useHistory();
    const commonClasses = useCommonStyles();
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
            <Button onClick={handleClick} className={commonClasses.menuButton}>
                <AccountCircle />
                <span>{userContext.user.firstname}</span>
                <KeyboardArrowDown />
            </Button>
            <Popover anchorEl={anchorEl} open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <List>
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
