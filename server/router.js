const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPics', mid.requiresLogin, controllers.Pic.getPics);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/changePass', mid.requiresSecure, controllers.Account.changePassPage);
  app.post('/changePass', mid.requiresSecure, controllers.Account.changePass);
  app.get('/purchace', mid.requiresSecure, controllers.Account.purchacePage);
  app.post('/purchace', mid.requiresSecure, controllers.Account.purchace);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Pic.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Pic.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
