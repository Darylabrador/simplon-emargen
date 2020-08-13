const fs = require('fs');

/**
 * Delete files
 * @param {String} filePath 
 */
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw (err);
        }
    });
}

exports.deleteFile = deleteFile;