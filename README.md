### Orca UI FE yeoman generator

For setting up **Orca UI FE** project quickly. For others projects, you can also use it if like.

Encapsulated from create-react-app with a lot of custom modifications.
    
#### Usage:
1.  Install yeoman:
    ```shell
    $ npm i yeoman -g
    ```
2.  Use this generator:
    ```shell
    $ mkdir yourApp
    $ cd yourApp
    $ npm i generator-orcaguife -g
    $ yo orcaguife
    ````
3.  How to modify this generator with your custom functionality and templates:
    1.  Clone or download and unzip this project, and then modify it as you want, but remember to follow the yeoman-generator rules.
    2.  Publish the modified copy as a new yeoman-generator node module to NPM platform with your own unique module name. Notice: Make sure that your NPM's registry is "https://registry.npmjs.org".
    3.  If you just wanna keep the modified copy in your PC, just run `$ npm link` under the root folder of it. 
    4.  Run the shell commands of previous step 2 .
  
4.  Wanna integrate generator into other GUI tools(not terminal like), check [yeoman-environment](https://www.npmjs.com/package/yeoman-environment).

6.  The main versions of dependencies of this ancient CRA we use:

    `webpack` `3.8.1`
    
    `webpack-dev-server` `2.9.4`
    
    `babel-core` `6.26.0`
    
    `react` `16.2.0` Significant changes since version 16.3.
    
    `redux` `3.7.2`
    
    `react-redux` `5.0.5`
    
    `react-router` `4.2.0` A truly dynamic, component-based router.
    
    `antd` `3.12.4`  Don't forget the 2018 Christmas Egg.
    
    We will do the upgrade if we have the time, or handle it by yourself :).

5. The configurations and features we modified and introduced to the raw CRA for `webpack` and `babel` are as below:
    1.  Introduce `less-loader` to handle less files.
    2.  Introduce `HappyPack` to change the compiling ways of some types of files, and optimize compiling speed.
    3.  Introduce reverse proxy server configuration when running `dev` environment, usage: `$ npm run start -- --rp http:// 192.168.100.100`. So do not need to set it `pakage.json` which way you will modify the code frequently.
    4.  Introduce module import as required for `antd`, change some configurations in `.babelrc`.
    5.  Introduce `transform-decorators-legacy` plugins in `.babelrc` for the decorator syntax for EcmaScript. If you upgrade your `babel` version to 7.X, there's another plugin instead.
    6.  Introduce  `stage-2` preset in `.babelrc` for some new syntax of EcmaScript.
    7.  Some other little changes, etc.