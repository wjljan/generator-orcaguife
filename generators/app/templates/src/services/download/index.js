export const downloadFile = (url, fileName) => {
    let downloadLinkDOM = document.createElement('a');
    if ('download' in downloadLinkDOM){
        // HTML5 new feature
        downloadLinkDOM.href = url;
        downloadLinkDOM.download = fileName;
        downloadLinkDOM.style.display = 'none';
        document.body.appendChild(downloadLinkDOM);
        downloadLinkDOM.click();
        document.body.removeChild(downloadLinkDOM);
    } else {
        // Normal way, as most of browsers will intercept the pop of a new window created by current
        // web page, it is just a security policy and can't be controlled by JavaScript codes, and
        // needs user to agree and click some options instead. So, this is actually not a good solution.
        window.open(url);
    }
    downloadLinkDOM = null;
};