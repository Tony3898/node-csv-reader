const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


class Stores {

  readCSVFile(path) {
    try {
      let file = fs.readFileSync(path, 'ascii');
      let fileData = []
      let lines = file.split('\n');
      let keys = lines[0].split(',')
      lines.map((line, i) => {
        if (i !== 0) {
          let data = {}
          let lineData = line.split(',')
          lineData.map((ld, li) => {
            if (keys[li].toLowerCase() === 'amount')
              data[keys[li]] = Number(ld)
            else
              data[keys[li]] = ld
          })
          fileData.push(data)
        }
      })
      rl.close();
      return fileData
    } catch (e) {
      throw new Error(e.message)
    }
  }

  readCSVFiles(files) {
    try {
      if (!Array.isArray(files)) {
        throw new Error('please provide valid file array')
      }
      let filesData = []

      files.map(f => {
        let filePathArray = f.split('/')
        let fileName = filePathArray[filePathArray.length - 1].split(".")[0]
        let fileData = this.readCSVFile(f)
        filesData.push({path: f, name: fileName, data: fileData})
      })
      return filesData
    } catch (e) {
      throw new Error(e.message)
    }
  }
}

module.exports = new Stores()