import {CronJob} from 'cron';
import httpRequests from './requests';
import {getSystemStatusInCookie} from 'Services';
import routerPath from 'RouterPath';

// Keep the cronJob always running, but whether to fetch data or not is determined
// by playbook status, system status and the URL hash(router path).

class FSCronJob {
    constructor (){
        this.cronJob = null;
        this.enablePlaybook = false;
        this.systemStatusOk = false;
        this.initCronJob();
    }

    initCronJob (){
        // Firstly check the system status from cookie.
        this.checkSystemStatus();
        // Request every 15 seconds.
        this.cronJob = new CronJob('*/15 * * * * *', this.executePlaybook.bind(this), null, true);
    }

    checkSystemStatus (){
        // code examples:
        /*
        const {isInitialized, isLogin, isDeInit, isClusterConfigRecovering, isReInit, isRollingBack, isSettingParameter, isClusterConfigExporting} = getSystemStatusInCookie();
        this.systemStatusOk = isInitialized && isLogin && !isDeInit && !isClusterConfigRecovering && !isReInit && !isRollingBack && !isSettingParameter && !isClusterConfigExporting ;
        */
        return this;
    }

    requestImmediately (){
        // code examples:
        /*
        // Request immediately.
        // Put fetch the system version and system task here temporarily.
        if (this.systemStatusOk){
            httpRequests.getSystemTaskList();
        }
        */
        return this;
    }

    runPlaybook () {
        this.enablePlaybook = true;
    }

    pausePlaybook (){
        this.enablePlaybook = false;
    }

    executePlaybook (){
        // code examples:
        /*
        if (this.enablePlaybook && this.systemStatusOk){
            const routerHash = window.location.hash.replace('#', '');
            const main = routerPath.Main; // as '/'

            // dashboard
            if (routerHash === main + routerPath.Dashboard){
                httpRequests.getClusterDetail();
            }
        }
        */
    }

    destroyCronJob (){
        this.enablePlaybook = false;
        this.cronJob = null;
    }
}

const cronJob = new FSCronJob();

export default cronJob;