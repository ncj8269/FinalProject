const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const changePassPage = (req, res) => {
  res.render('changePass', { csrfToken: req.csrfToken() });
};

const purchacePage = (req, res) => {
  res.render('purchace', { csrfToken: req.csrfToken() });
};

// const signupPage = (req, res) => {
//   res.render('signup', { csrfToken: req.csrfToken() });
// };

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const changePass = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;
  const newPassword = `${req.body.newPass}`;

  if (!username || !password || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    // change pass here, currently doesnt work

    // const newPassAccountData = {
    //   username: req.body.username,
    //   salt,
    //   password: req.body.newPass,
    // };

    // const newPassAccount = new Account.AccountModel(newPassAccountData);

    // const savePromise = newPassAccount.save();

    // savePromise.then(() => {
    //   req.session.account = Account.AccountModel.toAPI(newPassAccount);
    //   return res.json({ redirect: '/maker' });
    // });

    // savePromise.catch((err) => {
    //   console.log(err);

    //   return res.status(400).json({ error: 'An error occurred' });
    // });

    // req.session.account = Account.AccountModel.toAPI(newPassAccountData);

    return res.json({ redirect: '/maker' });
  });
};

const purchace = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    // increase image limit here

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.changePassPage = changePassPage;
module.exports.changePass = changePass;
module.exports.purchacePage = purchacePage;
module.exports.purchace = purchace;
module.exports.logout = logout;
// module.exports.signupPage = signupPage;
module.exports.getToken = getToken;
module.exports.signup = signup;
