import thunk from 'Redux/middleware/thunk';

describe('Redux middleware thunk', () => {
    // Mock inject middlewareAPI.
    let reformedDispatchCreator = thunk({
        dispatch: jest.fn(),
        getState: jest.fn()
    });
    let next = jest.fn();
    // Mock called in compose chain and return a finally reformed dispatch function.
    let reformedDispatch = reformedDispatchCreator(next);

    it('Dispatch a plain object', () => {
        reformedDispatch({
            type: 'CHANGE_PASSWORD',
            password: '123456'
        });
    });

    it('Dispatch a function', () => {
        reformedDispatch(async (dispatch/*, getState, extraArgument*/) => {
            let password = await new Promise(resolve => {
                setTimeout(() => {
                    resolve('123456');
                }, 1000);
            });
            dispatch({
                type: 'CHANGE_PASSWORD',
                password
            });
        });
    });
});