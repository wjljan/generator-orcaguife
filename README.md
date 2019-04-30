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
  
4.  Wanna integrate generator into other GUI tools(not a terminal like), check `yeoman-environment` documents.