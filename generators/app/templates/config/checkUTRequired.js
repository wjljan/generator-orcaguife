const processArgs = process.argv;

module.exports = function() {
    let execUTArgIndex = processArgs.findIndex(arg => arg === '--ut');
    if (execUTArgIndex !== -1){
        let execUTArgValue = processArgs[execUTArgIndex + 1];
        return execUTArgValue === undefined ||
            (!!execUTArgValue && !execUTArgValue.startsWith('--') && (execUTArgValue !== 'false') && (execUTArgValue !== '0'));
    } else {
        return false;
    }
};

// Usage example: "$ npm run build -- --ut" or "$ npm run build -- --ut 1".

// At present, we just check whether the unit testing is passed ot not. Want to check the coverage
// rate after the testing is passed in future, needs to introduce a more command arg such as '--utcr'
// and its related logic code to adjudge whether the unit testing coverage rate reaches the point
// configured in command or not.