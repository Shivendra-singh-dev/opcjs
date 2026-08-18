import fs from 'fs';

// fs.writeFile('hello.txt', 'hello shiva this is test the project about node js starting', 'utf8', (err) => {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     console.log('File written successfully!');
// });

// fs.readFile('hellotest/hello.txt','utf8',(err,data)=>{
//     if(err){
//         console.log('something wrong pls check..')
//         return;
//     }else{
//         console.log('Record founded: '+data)
//     }

// })
// fs.mkdir('hellotest', { recursive: true }, (err) => {
//     if (err) {
//         console.log('something wrong, please check..');
//         return;
//     }

//     fs.writeFile('hellotest/hello.txt','hello shiva file created using folder','utf8',
//         (err) => {
//             if (err) {
//                 console.log('something wrong please...');
//                 return;
//             }

//             console.log('folder and file created successfully...');
//         }
//     );
// });

// fs.mkdir('hellotest', { recursive: true }, (err) => {
//     if (err) {
//         console.log('something wrong, please check..');
//         return;
//     }

//     fs.appendFile('hellotest/hello.txt','NEW TEXT APPEND DATA hello shiva file created using folder','utf8',
//         (err) => {
//             if (err) {
//                 console.log('something wrong please...');
//                 return;
//             }

//             console.log('uppend the record of data and file created successfully...');
//         }
//     );
// });

// fs.rename('hellotest/newtext.txt', 'hellotest/text.txt', (err) => {
//     if(err){
//      console.log('something worng pls check...')   
//      return;
//     }
//     console.log('rename file successfully...')
// }
// )

// fs.unlink('hellotest/hello.txt',(err)=>{
//     if(err){
//         console.log('something wrong pls check...')
//         return;
//     }
//     console.log('file deleted succesfully...')
// })

// fs.renameSync('hellotest/text.txt','hellotest/newtxt.txt','utf8',(err)=>{
//     if(err){
//         console.log('something wrong pls check')
//         return;
//     }else{
//         console.log('rename file name successfullly...')
//     }
// })

// fs.rename('hellotest','nodeTutes',(err)=>{
//     if(err){
//         console.log('something wrong pls check...')
//         return;
//     }else{
//         console.log('folder name changed successfully...')
//     }
// })
// fs.mkdir('nodeTutes/app1',{ recursive: true },(err)=>{
//     if(err){
//         console.log('something worng pls check')
//         return;
//     }else{
//         console.log('success create folders')
//     }
// })

