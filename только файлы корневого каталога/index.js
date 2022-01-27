const DirService=require('./dir_service.js')



let service  = new DirService("./for_watch");
  
  service.on('file_add',(filename) => console.log(`Created1: ${filename}`))
  service.on('file_delete',(filename) => console.log(`Deleted: ${filename}`))
  service.on('error',(message) => console.log(`Error: ${message}`))
 

service.start()
setTimeout(()=>service.stop(), 60000)