import React, {Component} from 'react';
import {connect} from 'react-redux';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import {LocaleProvider} from 'antd';
import asyncLoad from '../AsyncLoad/asyncLoad';
import routerPath from 'RouterPath';

const Initialization = asyncLoad(() => import('../Initialization/Initialization'));
const Test = asyncLoad(() => import('../Test/Test'));

export default class App extends Component {
    constructor (props){
        super(props);
        let defaultPath = '';
        const [isInitialized] = getSystemStatusInCookie(['init']);
        if (isInitialized){
            defaultPath = routerPath.Test;
        } else {
            defaultPath = routerPath.Init;
        }
        this.state = {
            defaultPath
        };
    }

    render (){
        return (
            <HashRouter>
                <Switch>
                    <Route path={routerPath.Initialization} component={Initialization} />
                    <Route path={routerPath.Test} component={Test} />
                    <Redirect from={routerPath.Root} to={this.state.defaultPath} />
                </Switch>
            </HashRouter>
        );
    }
}