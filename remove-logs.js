/**
 * Anastasios Theodosiou
 * Scan for files with an extention for a give dir path!
 */
const path = require('path'),
  fs = require('fs');

const filePaths = [];
// const filesChanged = 0;

function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log('--ERROR: There is no directory \''+startPath+'\' !');
    return false;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename, filter); // recurse
    } else if (filename.indexOf(filter) >= 0) {
      console.log('-- found: ', filename);
      filePaths.push(filename);
    }
  }
  return true;
}

async function searchForLogs(file, string) {
  return new Promise((callback, reject) => {
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        console.log(err);
      }
      if (data.indexOf(string) >= 0) {
        const result = data.replace(/console\.log\(([^)]+)\);/gim, '');
        if (result) {
          fs.writeFile(file, result, 'utf8', function (err) {
            if (err) {
              throw new Error(err);
              return;
            } else {
              changed = true;
              callback('cleaned');
            }
          });
        } else {
          callback(true);
        }
      } else {
        callback(false);
      }
    });
  });
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const removeConsoleLogs = async () => {
  let count = 0;
  await asyncForEach(filePaths, async file => {
    const res = await searchForLogs(file, 'console.');
    if (res === 'cleaned') {
      count += 1;
    }
  });
  console.log('Changes: ' + count+'\n\nDone!');
};

//e.g: './src', '.js'
/**
 * Searching and removing 'console.log()' calls for the files with the givent 'extention' under the 'folderPath'.
 */
module.exports.removeLogs = function (folderPath,extention) {
  if(fromDir(folderPath,extention)){
    console.log('\nSearch proccess finished!\nFound ' + filePaths.length + ' files with the extention \''+extention+'\'.\n\nRemoving console.log() calls...');
    removeConsoleLogs();
  }  
}
