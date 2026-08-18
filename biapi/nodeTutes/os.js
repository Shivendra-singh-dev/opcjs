import os from 'os';

console.log('Operating System : ', os.platform());
console.log('Windows : ',os.arch());
console.log('CPU : ',os.cpus());
console.log('CPU Configure : ',os.cpus()[0].model);
console.log('Total Memory : ',os.totalmem());
console.log('Total Free Memory : ',os.freemem());
console.log('Your Host Name : ',os.hostname());
console.log('File Location(Home Directory) : ',os.homedir());


// console.log('Operating System:', os.platform());
// console.log('CPU:', os.cpus()[0].model);
// console.log('Total Memory:', os.totalmem());
// console.log('Free Memory:', os.freemem());