#### Technology Stack

1. Project is initialized through 'create-react-app' which is provided by Facebook React.js authorities, and we eject the tool configs from node_modules, <br />
so we can control it by ourselves, add track it through Git. This tool will initialize a webpack based project with modularization support. It uses 'less' as css preprocessor, and 'auto-prefix' as postprocessor. <br />
Also for webpack project, dev server is certainly support. Based on this, we introduce module HRM into CLI project for a better development experience. <br />
At the same time, the HTTP proxy provided by webpack dev-server is also indispensable: <br />
[https://github.com/facebookincubator/create-react-app](https://github.com/facebookincubator/create-react-app) <br />
Also the Code Splitting is provided to improved the loading performance: <br />
[https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html](https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html) <br />

2. The current popular state management framework is Redux which is inspired by Flux and powered by Dan Abramov. As for React.js we use 'react-redux' instead: <br />
[https://redux.js.org](https://redux.js.org) <br />

3. For router implementation we use 'react-router': <br />
[https://reacttraining.com/react-router/web/example/basic](https://reacttraining.com/react-router/web/example/basic) <br />

4. We use the 'antd' as UI component library that is refined by Ant Financial R&D team(UED team): <br />
This framework supplies a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently. <br />
[https://ant.design](https://ant.design)

####  Folder Directory Structure

 - __./config__            - configurations for cli tools
 - __./public__            - production build destination
 - __./scripts__           - npm scripts for running cli tools
 - __./src__               - source code and static resource for webpack
 - __|- component__     - common and high-level abstractions of mature business-view components
 - __|- http__          - all http server APIs, and cronjob
 - __|- images__        - image resources
 - __|- redux__         - state management framework
 - __|- routerPath__    - record the map for current router paths
 - __|- services__      - useful functions and local data/map
 - __|- socket__        - socket.io client
 - __|- styleSheets__   - less style sheets for common usage and specific components
 - __|- tests__         - all test suits and cases of unit testing
 - __|- views__         - business-view components placed by module or category
 - __|- index.js__      - the build portal of whole frontend project for webpack