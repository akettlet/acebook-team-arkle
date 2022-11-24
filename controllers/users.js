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
                req.session.userId = user._id;
                req.session.requests = user.requests;
                req.session.friends = user.friends;
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
      users.forEach(myFunction);
        function myFunction(record) {
          if (record.requests.includes(req.session.userId)) {            
            record.requested = "Request Sent!";
          }else {
            record.requested = "Add Friend";
            record.url = "/users/friend";
          }
          if (req.session.requests.includes(record._id.toString())) {
            record.requested = "Approve Friend Request!";
            record.url = "/users/approve";
          }
          if (req.session.friends.includes(record._id.toString())) {
            record.requested = "UnFriend";
            record.url = "/users/remove";
          }
        }
      res.render("users/index", { users: users, loggedIn: req.session.loggedIn, username: req.session.username});
    });
  },
  //added NewRequest to add friend requests to Database
  NewRequest: (req, res) => {
    const requester = req.session.userId;  //user who is making the request 
    const requestee = req.body.requestee;  //user for whom the request is made against
    // select user document that matches the requestee id and add requester id to array of requests
    if (req.session.loggedIn === true) { 
      User.findOne({_id: requestee}).then((user) => {
        let requestList = user.requests;
        requestList.push(requester);
        user.requests = requestList;
        user.save((err) => {
          if (err) {
            throw err;
          } else {
            res.redirect("/users/index");
          }
       });
      });
    }  
  },
// added ApproveRequest to handle approving friend requests 
  ApproveRequest: (req, res) => {
    const current_user = req.session.userId;  //user who is logged in currently
    const other_user = req.body.requestee;  //user from whom there is a pending request
    function arrayRemove(arr, value) { 
      return arr.filter(function(ele){ 
          return ele != value; 
      });
    }
    //
    if (req.session.loggedIn === true) { 
      User.findOne({_id: current_user}).then((user) => {
        let requestList = user.requests;
        user.requests = arrayRemove(requestList, other_user);
        let friendList = user.friends;
        friendList.push(other_user);
        user.save((err) => {
          if (err) {
            throw err;
          } else {
            req.session.requests = user.requests;
          }
       });
      });
      User.findOne({_id: other_user}).then((user) => {
        let friendList = user.friends;
        friendList.push(current_user);
        user.save((err) => {
          if (err) {
            throw err;
          } else {
            req.session.friends = user.friends;
            res.redirect("/users/index");
          }
       });
      });
    }  
  }
}

module.exports = UsersController;
