import fs from 'fs';
import BigBrotherWatcher from './index';

const token = fs.readFileSync('./keys/token.key', 'utf8');

const watcher = new BigBrotherWatcher(token);
setInterval(() => {
  console.log('send');
  watcher.Watch({
    httpMethod: 'get',
    httpPath: '/api/wrule/getInfo',
  });
}, 2000);
