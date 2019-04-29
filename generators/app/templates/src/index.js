import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {Provider} from 'react-redux';
import store from 'Store';
import {Modal} from 'antd';
import 'StyleSheets';
import App from 'Views/App/App';
import {lsGet} from 'Services';
import 'Socket';
import cronJob from 'Http/cronJob';

const NODE_ENV = process.env.NODE_ENV;

// Initialize cronJob and run playbook.
cronJob.requestImmediately().runPlaybook();

// Create App.
const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component />
            </Provider>
        </AppContainer>,
        document.getElementById('root'),
    );
};

// Render App.
render(App);

// Hot module replacement, will re-render the App when
// the modifications of components occur.
if (module && module.hot){
    module.hot.accept('Views/App/App', () => render(App));
}

// Present couple of warning tips on console tab when
// the App is running in production environment.
if (NODE_ENV === 'production'){
    let language = lsGet('language');
    console.info(
        language === 'english' ?
        '%c Warning: For the stable and security of data of the system, if you are not the operation and maintenance personnel of OrcaFS, don\'t do anything in Developer Tool!' :
        '%c 警告：为了系统的稳定与数据安全，如果您非OrcaFS的运维人员请勿在开发者工具里执行任何操作！',
        'color: #f15cfd'
    );
}