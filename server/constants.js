const path = require('path');

exports.IN_PROGRESS = 'En proceso';
exports.CONVERTED = 'Convertida';
exports.UPLOAD_PATH = path.join('/mnt/nfs/var/nfs/', '/audio/uploads/');
exports.CONVERTED_PATH = path.join('/mnt/nfs/var/nfs/', '/audio/converted/');
exports.CONVERSION_FORMAT = 'mp3';

exports.IMAGE_PATH = path.join('/mnt/nfs/var/nfs/', '/images/');
