import work from 'webworkify-webpack';
import {redirectRouterAfterFetch} from './fetchHelper';
// import {randomNumberBoth} from 'Services';

export default class FetchThreadPool {
    constructor (option = {}){
        const {
            inspectIntervalTime = 20 * 1000,
            maximumWorkTime = 60 * 1000
        } = option;
        // Get the CPU threads number of PC that the browser runs on as the maximumThreadsNumber
        // by default. This number is based on the CPU's cores number, if there's Hyper-Threading
        // Technology inside of it, the number will be double from cores number. If the hardwareConcurrency
        // property is not supported in lower version browsers, then set the value to 4 by default as
        // most of normal CPUs are like that.
        this.maximumThreadsNumber = window.navigator.hardwareConcurrency || 4;
        this.threads = [];
        this.inspectIntervalTime = inspectIntervalTime;
        this.maximumWorkTime = maximumWorkTime;
        this.init();
    }

    init (){
        for (let i = 0; i < this.maximumThreadsNumber; i ++){
            this.createThread(i);
        }
        setInterval(() => this.inspectAllThreads(), this.inspectIntervalTime);
    }

    createThread (i){
        // Initialize a webWorker and get its reference.
        const thread = work(require.resolve('./fetch.worker.js'));
        // Bind message handler.
        thread.addEventListener('message', event => {
            this.threadMessageHandler(event, thread);
        });
        // Bind error handler.
        thread.addEventListener('error', () => {
            this.terminateZombieThread(thread);
        });
        // Stick the id tag into thread object.
        thread['id'] = i;
        // To flag the thread working status, busy or idle.
        thread['busy'] = false;
        // Record all fetch tasks of this thread, currently it is aimed to record reqPromise.
        thread['taskMap'] = {};
        // The id tag mentioned above is the same with the index of this thread in threads array.
        this.threads[i] = thread;
    }

    haveIdleThread (){
        return !!this.getIdleThread();
    }

    getIdleThread (){
        return this.threads.find(thread => !thread.busy);
    }

    dispatchThread ({url, options}, reqPromise){
        // Firstly get the idle thread in pools.
        let thread = this.getIdleThread();
        /*
        // Will judge it before trigger fetch.
        // If there is no idle thread, get a thread by random.
        if (!thread){
            thread = this.threads[randomNumberBoth(0, this.threads.length - 1)];
        }
        */
        // Stick the reqPromise into taskMap of thread.
        let taskId = Date.now();
        thread.taskMap[taskId] = reqPromise;
        // Dispatch fetch work to thread.
        thread.postMessage({
            channel: 'fetch',
            data: {url, options, taskId}
        });
        thread.busy = true;
    }

    inspectAllThreads (){
        if (this.threads.length > 0){
            this.threads.forEach(thread => {
                thread.postMessage({
                    channel: 'inspection',
                    data: {id: thread.id}
                });
            });
        }
    }

    terminateZombieThread (thread){
        // Keep the index of zombie thread.
        let id = thread.id;
        // Remove the thread object from thread array.
        this.threads.splice(id, 1, null);
        // Terminate the thread, and recover the occupied memory.
        thread.terminate();
        // GC the space of the variable.
        thread = null;
        // Create a new worker thread will take the place of zombie thread.
        this.createThread(id);
    }

    threadMessageHandler (event, thread){
        let {channel, threadCode, threadData, threadMsg} = event.data;
        // Message from worker thread is ok.
        if (threadCode === 0){
            switch (channel){
                case 'fetch':
                    this.fetchHandler(thread, threadData);
                    break;

                case 'inspection':
                    this.inspectionHandler(thread, threadData);
                    break;

                default:
                    break;
            }
        } else {
            // Message from worker thread comes with error.
            if (threadData){
                let {taskId} = threadData;
                // Set the thread status to idle.
                thread.busy = false;
                let reqPromise = thread.taskMap[taskId];
                if (reqPromise){
                    reqPromise.reject({code: threadCode, msg: threadMsg});
                }
            }
        }
    }
    
    fetchHandler (thread, threadData){
        let {taskId, code, data, msg} = threadData;
        let reqPromise = thread.taskMap[taskId];
        if (reqPromise){
            // Handle the upper fetch promise call;
            if (code === 0){
                reqPromise.resolve(data);
            } else {
                reqPromise.reject({code, msg});
            }
            // Remove this fetch task from taskMap of this thread.
            thread.taskMap[taskId] = null;
        }
        // Set the thread status to idle.
        thread.busy = false;
        redirectRouterAfterFetch();
    }
    
    inspectionHandler (thread, threadData){
        // Give some tips about abnormal worker thread.
        let {isWorking, workTimeElapse} = threadData;
        if (isWorking && (workTimeElapse > this.maximumWorkTime)){
            console.warn(`Worker thread (ID: ${thread.id}) has been doing a task for a long time, it is considered as a zombie thread and will be terminated soon. See details: \n ${JSON.stringify(threadData)}.`);
            this.terminateZombieThread(thread);
        }
    }
}