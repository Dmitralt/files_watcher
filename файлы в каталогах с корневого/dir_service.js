const fs = require('fs')
const EventEmitter=require('events')
const emitter= new EventEmitter();

class DirService {
    constructor(dir) {

      
        this.dir=dir
        this.array_of_watchers=[]
        process.on('uncaughtException', (err) => {
          if(err["filename"]==null)
          {
            emitter.emit('error',"watchers foulder was deleted")
          }
       });
        
    }    

       getFoulders_0 (dir, files_) {
        try{files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files) {
          var name = dir + "/" + files[i];
          if (fs.statSync(name).isDirectory()) {
            files_.push(name);
            this.getFoulders_0(name, files_);
          } else {
          }
        }
        return files_;}catch{emitter.emit('error',"foulder getting error")}
      };

      getFoulders(dir)
      {

       
        try{let answer=this.getFoulders_0(dir)
         
        answer.push(dir)
        return answer}catch{emitter.emit('error',"foulder getting error")}

      }
    
      getFiles (dir, files_) {
        try{files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files) {
          var name = dir + "/" + files[i];
          if (fs.statSync(name).isDirectory()) {
            this.getFiles(name, files_);
          } else {
            files_.push(name);
          }
        }
        return files_;}catch{emitter.emit('error',"files getting error")}
       };


       getFiles_and_Foulders (dir) {       
       return this.getFiles(dir).concat(this.getFoulders(this.dir))
      };

      on(request_event,request_function){


        if(request_event=="file_add"){return emitter.on('file_add',request_function)} 
        else if(request_event=="file_delete"){return emitter.on('file_delete',request_function)} 
        else if(request_event=="error"){return emitter.on('error',request_function)} 
        else{console.log("send write params")}
       
        
      }
      start(){
        
        try{let array_on_start=this.getFiles_and_Foulders(this.dir)
        let array_of_foulders=this.getFoulders(this.dir)
        
        
    
        this.array_of_watchers=[]

        let this_context=this
        
        
        array_of_foulders.map(function(curent_dir) {
          
         
           if(fs.existsSync(curent_dir)){
             
            this_context.array_of_watchers.push(
             
            fs.watch(curent_dir, (eventType, filename) => { emitter.emit('files_changed',filename) })
            
            ) }
          });
          
        emitter.on('files_changed',function(){

            this_context.array_of_watchers.map(function(curent_watcher) {curent_watcher.close()})
            this_context.array_of_watchers=[];
            let array_afterchange=this_context.getFiles_and_Foulders(this_context.dir);
            let  arr_of_new= array_afterchange.filter(n => array_on_start.indexOf(n) === -1);
            let arr_of_deleted = array_on_start.filter(n => array_afterchange.indexOf(n) === -1);
        
    
            arr_of_new.map(function(filename) {emitter.emit('file_add',filename)})
            arr_of_deleted.map(function(filename) {emitter.emit('file_delete',filename)})
            
            
            array_on_start=array_afterchange
    
    
           
            array_of_foulders=this_context.getFoulders(this_context.dir)
           
            array_of_foulders.map(function(curent_dir) {
                this_context.array_of_watchers.push(fs.watch(curent_dir, (eventType, filename) => { emitter.emit('files_changed',filename) }) )      
              });
            
        })
    
    }catch{emitter.emit('error',"set watchers error")}
       
    
    }
    stop(){
        this.array_of_watchers.map(function(curent_watcher) {curent_watcher.close()})
        

    }
   
  }

 module.exports =DirService

