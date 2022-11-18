const User = require("../models/user");
const bcrypt = require('bcrypt');

const UsersController = {
  New: (req, res) => {
    res.render("users/new", { loggedIn: req.session.loggedIn, username: req.session.username });
  },

  Create: (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    if (email != "" && password != "" && name != "") {
      User.findOne({ email: email }).then((user) => {
        if (!user) {
          bcrypt.hash(password, 10, function(err, hash) {
            req.body.password = hash
            const user = new User(req.body);
            user.save((err) => {
              if (err) {
                throw err;
              } else {
                req.session.loggedIn = true
                req.session.user = user;
                req.session.username = req.session.user.name;
                res.status(201).redirect("/posts");
              }
            });
          });
          
        } else {
          res.redirect("/users/new");
        }
      });
    } else {
      res.redirect("/users/new");
    }
  },
  //added index to display list of users on users/index
  Index: (req, res) => {
    User.find({ name: {$ne: req.session.username}}).exec((err, users) => {
      if (err) {
        throw err;
      }
        res.render("users/index", { users: users, loggedIn: req.session.loggedIn, username: req.session.username  });
      });
    }
};

module.exports = UsersController;
