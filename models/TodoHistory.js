const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const todoHistorySchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    site: {
        type: mongoose.Schema.ObjectId,
        ref: 'Site',
    },
    text: {
        type: String,
        required: 'Введите текст',
    },
    priority: {
        type: Number,
        min: 0,
        max: 1,
    },
    status: {
        type: String,
        default: 'Запланирована',
    },
    groups: [String],
    closedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    closedDate: {
        type: Date,
    },
});

module.exports = mongoose.model('TodoHistory', todoHistorySchema);

