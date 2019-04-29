import React, {Component} from 'react';
import {Icon, Spin} from 'antd';

export default class Placeholder extends Component {
    render (){
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    backgroundColor: '#fff',
                }}
            >
                <Spin indicator={<Icon type="loading" spin />} />
            </div>
        );
    }
}