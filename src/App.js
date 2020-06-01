import React from 'react';
import 'typeface-roboto';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home/Home';
import Auth from './Auth/Auth';
import {theme} from './Theme';
import { UserContext } from './AppContext';

function App() {
    const [user, setUser] = React.useState({});
    const userValue = { user, setUser };
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <UserContext.Provider value={userValue}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/auth">
                            <Auth />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </UserContext.Provider>
        </ThemeProvider>
    );
}

export default App;
