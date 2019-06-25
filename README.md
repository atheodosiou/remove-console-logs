## Remove Console Logs Utility

### Description
Remove logs module, is a simple utility from a developer to developers, helping them to remove all those unnecessary console log calls ( usually used for debugging ) by executing one line of code. Utiliy, will scan the given directory for those functions and delete them massively.

### Installation
npm i remove-logs --save

### API
```javascript
removeLogs(dirPath,fileExtention);
```

### Usage
```javascript
const { removeLogs } = require('./remove-logs');

const dirPath = './src';
const fileExtention = '.js';

removeLogs(dirPath,fileExtention);
```
