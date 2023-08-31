# Moneydew
This is a library for formatting currencies designed for frontend applications. Also has arithmetic capabilities. Arithmetic implementation is slow and not designed for large-scale backend applications.
To install it just run
```bash
npm install moneydew
```
or download the latest release as a zip file.

## Notes On Developing New Versions
First you need to clone the repo and install the dev-dependencies by running:
```bash
npm install
```
This if course requires you to install node.js first.
Once that has finished you should have all the necessary tools for development.

The files of the library can be found in the src folder. We are using webpack to
build and bundle these files. But you don't need to worry about that because
we will be using pre-configured npm scripts for development. These scripts can be
found in the package.json file.

At the moment we are building 3 different versions of the library from our sources.
Each version is intended for use in different scenarios so each one is imported in
different ways. See usage section for details. Keep in mind that you have to use the
webpack-dev-server for testing to avoid CORS policy errors.

Inside the tests folder you can write all your test cases. Keep them limited to that
folder and use the built files from the dist folder.

When adding new features or fixing bugs please keep in mind the current architecture of the software:

![UML class diagram](./uml-class-diagram.png?)
### Testing
Tests are written for jest inside the tests folder. Again, if you've installed the
dev-dependencies you should have everything set up. Jest is using ts-jest to compile
the typescript files on the run, so you don't have to compile the files with webpack
first and can test files individually. Just write your tests and run the test npm script.