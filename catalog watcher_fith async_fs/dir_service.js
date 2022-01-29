import fs from "fs";
const fsPromises = fs.promises;
import events from "events";
const emitter = new events();

class DirService {
  constructor(dir) {
    this.dir = dir;

    process.on("uncaughtException", (err) => {
      if (err["filename"] == null) {
        emitter.emit("error", "watchers foulder was deleted");
      }
    });
  }

  async getFiles(path) {
    let answer= await new Promise(res => {
      fs.readdir('./tmp', { withFileTypes: true }, (err, dirents) => {
          const filesNames = dirents
            .filter(dirent => dirent.isFile())//Only files, if commited then files&foulders
              .map(dirent => dirent.name);
              res(filesNames)
      })
   
  });
    return answer
  }
 
  on(request_event, request_function) {
    if (request_event == "file_created") {
      return emitter.on("file_created", request_function);
    } else if (request_event == "file_deleted") {
      return emitter.on("file_deleted", request_function);
    } else if (request_event == "error") {
      return emitter.on("error", request_function);
    } else {
      console.log("send write params");
    }
  }
  async start() {
    try {
      let array_on_start = await this.getFiles(this.dir);
      console.log(array_on_start)
      let this_context = this;
      this.watcher = fs.watch(this.dir, (eventType, filename) => {
        emitter.emit("files_changed", filename);
      });

      emitter.on("files_changed", async function () {
        let array_afterchange = await this_context.getFiles(this_context.dir);

        let arr_of_new = array_afterchange.filter(
          (n) => array_on_start.indexOf(n) === -1
        );
        let arr_of_deleted = array_on_start.filter(
          (n) => array_afterchange.indexOf(n) === -1
        );

        arr_of_new.map(function (filename) {
          emitter.emit("file_created", { filename: filename });
        });
        arr_of_deleted.map(function (filename) {
          emitter.emit("file_deleted", { filename: filename });
        });
        array_on_start = array_afterchange;
      });
    } catch {
      emitter.emit("error", "start error");
    }
  }
  stop() {
    this.watcher.close();
  }
}
export { DirService };
