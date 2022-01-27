const fs = require('fs')
const EventEmitter=require('events')
const emitter= new EventEmitter();

  class DirService {
    constructor(dir) {
      
        this.dir=dir       
        
        process.on('uncaughtException', (err) => {
          if(err["filename"]==null)
          {
            emitter.emit('error',"watchers foulder was deleted")
          }
       });
    }    
    
      getFiles (dir, files_) {
        try{files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files) {
          var name = dir + "/" + files[i];
          if (fs.statSync(name).isDirectory()) {
            
          } else {
            files_.push(name);
          }
        }
        return files_;}catch{emitter.emit('error',"files getting error")}
       };


      on(request_event,request_function){
        if(request_event=="file_add"){return emitter.on('file_add',request_function)} 
        else if(request_event=="file_delete"){return emitter.on('file_delete',request_function)} 
        else if(request_event=="error"){return emitter.on('error',request_function)} 
        else{console.log("send write params")}     
        
      }
      start(){
        try{let array_on_start=this.getFiles(this.dir)
        let this_context=this
        this.watcher=fs.watch(this.dir, (eventType, filename) => { emitter.emit('files_changed',filename) })

        emitter.on('files_changed',function(){         
          let array_afterchange=this_context.getFiles(this_context.dir);         
          let  arr_of_new= array_afterchange.filter(n => array_on_start.indexOf(n) === -1);
          let arr_of_deleted = array_on_start.filter(n => array_afterchange.indexOf(n) === -1);
          arr_of_new.map(function(filename) {emitter.emit('file_add',filename)})
          arr_of_deleted.map(function(filename) {emitter.emit('file_delete',filename)})          
          array_on_start=array_afterchange         
          
      })
    }catch{emitter.emit('error',"files getting error")}
        
    }
    stop(){this.watcher.close() }
  }

 module.exports =DirService

