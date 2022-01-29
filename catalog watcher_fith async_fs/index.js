import {DirService} from './dir_service.js'

import fs from 'fs'

const PATH = './tmp'//absolute or relative path
const service = new DirService(PATH)
service.on('file_created', (e) => console.log(`Created: ${e.filename}`))  
service.on('file_deleted', (e) => console.log(`Deleted: ${e.filename}`))  
service.on('error', console.error)
service.start()
setTimeout(()=>service.stop(), 10000)



