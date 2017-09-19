# Navads Checker
## Instruction to run checker
clone project and enter into the directory
### add configs files: 
- db config will be collected from environment variables as mentioned on readme of jobs
- for dev and test(NODE_ENV=dev|test): db.json to have database configs following the format as db.sample.js
- config.json containing required settings following the format as config.sample.js
- default value of settings is config


### Commands to run the app:
```
npm install
settings=config NODE_ENV=dev node app.js
```
`DEBUG=checker:* node .` will run the checker and show checker console log messages.

### Command to test app
``` npm test ```

## Summary of work flow of the proejct
main file app.js call run method of a factory module in src/app.js, run takes checker name and starter.
starter is also a simple function to call checker starter factory, based on checker name, it will load respective checker, then cheker will do the required process.
src/app.js will call src/services/builder to build all required helper services and will inject those services into checker through checker factory via starter.
Get functionalites and behaviours of services, checkers and others in test files.

## Details work flow and documentation
.......................
