// Because of some compatibility issues of microsoft's browser series, such as: IE、Edge,
// we couldn't initialize a fetch or a xhr request even if we can access the fetch method.
// So if needs your APP be adapt to these browsers, you should not use this way.
// This is also applicable to the WebSocket protocol.

export default self => {
    let isWorking = false;
    let startWorkingTime = 0;
    let tasks = [];
    self.addEventListener('message', async event => {
        const {channel, data} = event.data;
        switch (channel){
            case 'fetch':
                isWorking = true;
                // Every new task joins, refresh the value of startWorkingTime.
                startWorkingTime = Date.now();
                let {url, options, taskId} = data;
                tasks.push({url, options, taskId});
                try {
                    let response = await fetch(self.origin + url, options);
                    if (response.ok){
                        let {code, data, msg} = await response.json();
                        self.postMessage({
                            threadCode: 0,
                            channel: 'fetch',
                            threadData: {taskId, code, data, msg},
                        });
                    } else {
                        const {status, statusText} = response;
                        self.postMessage({
                            threadCode: 0,
                            channel: 'fetch',
                            threadData: {taskId, code: status, msg: statusText || `http error, code: ${status}`},
                        });
                        console.info(`%c HTTP error, code: ${status}`, 'color: #CC0033');
                    }
                } catch (e){
                   self.postMessage({
                       threadCode: 1,
                       threadData: {taskId},
                       threadMsg: `Fetch Web Worker Error: ${e}`
                   });
                }
                isWorking = false;
                startWorkingTime = 0;
                tasks = tasks.filter(task => task.taskId !== taskId);
                break;

            case 'inspection':
                // console.info(`Receive inspection thread ${data.id}.`);
                self.postMessage({
                    threadCode: 0,
                    channel: 'inspection',
                    threadData: {
                        isWorking,
                        startWorkingTime,
                        workTimeElapse: isWorking ? (Date.now() - startWorkingTime) : 0,
                        tasks
                    },
                });
                break;

            default:
                self.postMessage({
                    threadCode: 1,
                    threadMsg: `Fetch Web Worker Error: unknown message channel: ${channel}}.`
                });
                break;
        }
    });
};