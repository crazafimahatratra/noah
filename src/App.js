import React from 'react';
import 'typeface-roboto';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home/Home';
import Auth from './Auth/Auth';
import {theme} from './Theme';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
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
        </ThemeProvider>
    );
}

export default App;
