const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const todoSchema = new mongoose.Schema({
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
    groups: [String],
});

function populateAuthor(next) {
    this.populate('author');
    next();
};

todoSchema.statics.getGroupList = function() {
    return this.aggregate([
        {$unwind: '$groups'},
        {$group: {_id: '$groups', count: {$sum: 1}}},
        {$sort: {count: -1}},
    ]);
};


todoSchema.pre('find', populateAuthor);
todoSchema.pre('findOne', populateAuthor);

module.exports = mongoose.model('Todo', todoSchema);

