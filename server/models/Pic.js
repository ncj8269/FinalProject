const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let PicModel = {};

// mongoose.Types.ObjectID is a function that converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();

const PicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  height: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

PicSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  age: doc.age,
  height: doc.height,
});

PicSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PicModel.find(search).select('title age height').lean().exec(callback);
};

PicModel = mongoose.model('Pic', PicSchema);

module.exports.PicModel = PicModel;
module.exports.PicSchema = PicSchema;
