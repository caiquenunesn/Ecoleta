import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './Home';
import CreatePoint from './CreatePoints';

function Routes(){
    return (
        <BrowserRouter>
            <Route component={Home} exact path="/" />
            <Route component={CreatePoint} exact path="/creat-point" />
        </BrowserRouter>
    );
}

export default Routes;