var expect = require("chai").expect;
var request = require("supertest");
var app = require("../index");
var db = require("../models");

before(function(done) {
  db.sequelize.sync({
    force: true
  }).then(function() {
    done();
  });
});

describe("User Model", function() {
  describe("Creating new users", function() {
    it("should create new users", function(done) {
      db.user.findOrCreate({
        where: {
          email: "user@gmail.com"
        },
        defaults: {
          name: "User Userton",
          password: "regularoldpassword"
        }
      }).spread(function(user, created) {
        expect(created).to.equal(true);
        expect(user.email).to.equal("user@gmail.com");
        expect(user.name).to.equal("User Userton");
        // remember that you bcrypted the password. we can test for appropriate password length in other ways (see below)
        done();
      });
    });

    it("should prevent duplicate accounts from being created", function(done) {
      db.user.findOrCreate({
        where: {
          email: "user@gmail.com" // this was created in the previous test
        },
        defaults: {
          name: "Dupe Dupeton",
          password: "regularoldpassword"
        }
      }).spread(function(user, created) {
        expect(created).to.equal(false);
        expect(user.email).to.equal("user@gmail.com");
        expect(user.name).to.equal("User Userton");
        done();
      });
    });

    it("should reject invalid email format", function(done) {
      db.user.findOrCreate({
        where: {
          email: "nopenopenope"
        },
        defaults: {
          name: "Invalid Emailton",
          password: "regularoldpassword"
        }
      }).spread(function(user, created) {
        expect(created).to.equal(false);
        expect(user).to.equal(null);
        done();
      }).catch(function(error) {
        expect(error.message).to.equal("Validation error: Invalid email address.");
        done();
      });
    });

    it("should reject short names", function(done) {
      db.user.findOrCreate({
        where: {
          email: "short@name.com"
        },
        defaults: {
          name: "",
          password: "regularoldpassword"
        }
      }).spread(function(user, created) {
        expect(created).to.equal(false);
        expect(user).to.equal(null);
        done();
      }).catch(function(error) {
        expect(error.message).to.equal("Validation error: Name must be between 1 and 99 characters long.");
        done();
      });
    });

    it("should reject long names", function(done) {
      db.user.findOrCreate({
        where: {
          email: "long@name.com"
        },
        defaults: {
          name: "Long Namedottir11111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
          password: "regularoldpassword"
        }
      }).spread(function(user, created) {
        expect(created).to.equal(false);
        expect(user).to.equal(null);
        done();
      }).catch(function(error) {
        expect(error.message).to.equal("Validation error: Name must be between 1 and 99 characters long.");
        done();
      });
    });

    it("should reject short passwords", function(done) {
      db.user.findOrCreate({
        where: {
          email: "short@password.com"
        },
        defaults: {
          name: "Short Passwordson",
          password: "1234567"
        }
      }).spread(function(user, created) {
        expect(created).to.equal(false);
        expect(user).to.equal(null);
        done();
      }).catch(function(error) {
        expect(error.message).to.equal("Validation error: Password must be between 8 and 99 characters long.");
        done();
      });
    });

    it("should reject long passwords", function(done) {
      db.user.findOrCreate({
        where: {
          email: "long@password.com"
        },
        defaults: {
          name: "Long O'Password",
          password: "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
        }
      }).spread(function(user, created) {
        expect(created).to.equal(false);
        expect(user).to.equal(null);
        done();
      }).catch(function(error) {
        expect(error.message).to.equal("Validation error: Password must be between 8 and 99 characters long.");
        done();
      });
    });
  });
});
