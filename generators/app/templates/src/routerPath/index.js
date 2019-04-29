const index = {
    // example codes:

    // top class router
    Root: '/',

    // not initialized
    Initialization: '/initialization',

    // initialized but not logged in (or login session is invalid)
    Login: '/login',

    // error page
    Error: '/error',

    // sub class router
    Test: '/test',
};

export default index;

export const pathToMenu = {
    Test: [index.Test],
};