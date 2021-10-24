var chai = require('chai')
  , Strategy = require('../lib/strategy');


describe('Strategy', function() {
    
  describe('passing request to verify callback', function() {
    var strategy = new Strategy({ passReqToCallback: true }, function(req, token, done) {
      if (token == 'vF9dft4qmT') { 
        return done(null, { id: '1234' }, { scope: 'read', foo: req.headers['x-foo'] });
      }
      return done(null, false);
    });
  
    describe('handling a request with valid token', function() {
      var user
        , info;
    
      before(function(done) {
        chai.passport.use(strategy)
          .success(function(u, i) {
            user = u;
            info = i;
            done();
          })
          .request(function(req) {
            req.headers.authorization = 'Bearer vF9dft4qmT';
            req.headers['x-foo'] = 'hello';
          })
          .authenticate();
      });
    
      it('should supply user', function() {
        expect(user).to.be.an.object;
        expect(user.id).to.equal('1234');
      });
    
      it('should supply info', function() {
        expect(info).to.be.an.object;
        expect(info.scope).to.equal('read');
      });
    
      it('should supply request header in info', function() {
        expect(info.foo).to.equal('hello');
      });
    });
  });
  
});
