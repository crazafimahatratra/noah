import React from 'react';
import CDrawer from './Components/CDrawer';
import CAppBar from './Components/CAppBar';
import Http from '../Utils/Http';
import { UserContext } from '../AppContext';
import { useHistory, Switch, Route } from 'react-router-dom';
import { useTheme, useMediaQuery, makeStyles } from '@material-ui/core';
import MyDiary from '../MyDiary/MyDiary';
import Charts from '../Charts/Charts';
import Categories from '../Categories/Categories';

let http = new Http();

const styles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    main: {
        flexGrow: 1,
        padding: "70px 30px",
        [theme.breakpoints.down("xs")]: {
            padding: "70px 20px",
        }
    }
}));

export default function Home() {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.down("xs"));
    const [openDrawer, setOpenDrawer] = React.useState(true);
    const userContext = React.useContext(UserContext);
    const setUser = userContext.setUser
    const history = useHistory();

    React.useEffect(() => {
        http.get('me').then(user => {
            setUser(user.data);
        }).catch(() => {
            localStorage.removeItem("accessToken");
            history.replace("/auth");
        });
    }, [setUser, history]);
    React.useEffect(() => {
        setOpenDrawer(!xs);
    }, [xs])
    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    }
    const handleDrawerClose = () => {
        setOpenDrawer(false);
    }

    const classes = styles();
    return (
        <div className={classes.root}>
            <CAppBar onToggleMenu={handleDrawerOpen} />
            <CDrawer open={openDrawer} onClose={handleDrawerClose} />
                <main className={classes.main}>
                    <Switch>
                        <Route path="/categories">
                            <Categories/>
                        </Route>
                        <Route path="/charts">
                            <Charts/>
                        </Route>
                        <Route path="/">
                            <MyDiary />
                        </Route>
                    </Switch>
                </main>
        </div>
    );
}