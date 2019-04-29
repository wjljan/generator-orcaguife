import React, {Component} from 'react';
import Placeholder from './Placeholder';

// Asynchronous load HOC.
export default dynamicImport =>  {
    return class AsyncComponent extends Component {
        constructor (props){
            super(props);
            this.state = {
                Component: null
            };
        }

        async componentDidMount (){
            // The parameter dynamicImport is an async function, it will return a promise
            // object, when it's resolved we can get an object with two keys:
            // key "default" points to the final exported component of this chunk file,
            // key "__esModule" is true.
            try {
                const {default: Component} = await dynamicImport();
                this.setState({Component});
            } catch(e){
                // console.log(e);
            }
        }

        render (){
            const {Component} = this.state;
            // If the async loading component is ready, render it, otherwise
            // presents a placeholder component instead.
            return Component ? <Component {...this.props} /> : <Placeholder />;
        }
    };
};