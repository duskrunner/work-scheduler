const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: 'Пожалуйста, введите Email!',
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Неверный Email!'],
    },
    name: {
        type: String,
        trim: true,
        required: 'Пожалуйста, введите имя!',
    },
    ip: String,
    level: Number,

});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
