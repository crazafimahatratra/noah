import React from 'react';
import 'typeface-roboto';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home/Home';
import Auth from './Auth/Auth';

function App() {
    return (
        <CssBaseline>
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
        </CssBaseline>
    );
}

export default App;
