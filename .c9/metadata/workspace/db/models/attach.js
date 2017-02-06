{"filter":false,"title":"attach.js","tooltip":"/db/models/attach.js","undoManager":{"mark":1,"position":1,"stack":[[{"start":{"row":0,"column":0},"end":{"row":26,"column":50},"action":"insert","lines":["/**"," * Модель файлов вложений, которые загружаются во время экзамена"," */","var mongoose = require('mongoose');","var Schema = mongoose.Schema;","var Attach = new Schema({","    _id: false,","    // Идентификатор файла в GridFS","    fileId: {","        type: Schema.Types.ObjectId,","        required: true","    },","    // Оригинальное имя файла","    filename: {","        type: String","    },","    // Время загрузки","    created: {","        type: Date,","        default: Date.now","    },","    // Описание вложения","    description: {","        type: String","    }","});","module.exports = mongoose.model('Attach', Attach);"],"id":1}],[{"start":{"row":1,"column":25},"end":{"row":1,"column":64},"action":"remove","lines":[", которые загружаются во время экзамена"],"id":2}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":1,"column":25},"end":{"row":1,"column":25},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1486245685395,"hash":"39aa797084430d3c2eefe803a7069c690592bf28"}