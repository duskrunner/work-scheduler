const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');

const siteSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Введите номер площадки',
    },
    slug: String,
    description: {
        type: String,
        trim: true,
    },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: [{
            type: Number,
            required: 'Введите координаты',
        }],
        address: {
            type: String,
            required: 'Введите адресс',
        },

    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },

}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

siteSchema.index({name: 'text'});
siteSchema.index({location: '2dsphere'});

siteSchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        next();
        return;
    }
    this.slug = slug(this.name);
    const regEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const sitesWithSlug = await this.constructor.find({slug: regEx});
    if (sitesWithSlug.length) {
        this.slug = `${this.slug}-${sitesWithSlug.length + 1}`;
    }
    next();
});

siteSchema.virtual('todos', {
    ref: 'Todo',
    localField: '_id',
    foreignField: 'site',

});

module.exports = mongoose.model('Site', siteSchema);
