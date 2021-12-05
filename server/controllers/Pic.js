const models = require('../models');

const { Pic } = models;

const makerPage = (req, res) => {
  Pic.PicModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), pics: docs });
  });
};

const makePic = (req, res) => {
  if (!req.body.title || !req.body.rating || !req.body.tags) {
    return res.status(400).json({ error: 'Title rating and tags are required' });
  }

  const picData = {
    title: req.body.title,
    rating: req.body.rating,
    tags: req.body.tags,
    owner: req.session.account._id,
  };

  const newPic = new Pic.PicModel(picData);

  const picPromise = newPic.save();

  picPromise.then(() => res.json({ redirect: '/maker' }));

  picPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Pic already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return picPromise;
};

const getPics = (request, response) => {
  const req = request;
  const res = response;

  return Pic.PicModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ pics: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getPics = getPics;
module.exports.make = makePic;
