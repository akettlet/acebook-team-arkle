const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");

router.get("/new", UsersController.New);
router.post("/", UsersController.Create);
router.get("/index", UsersController.Index);
//adding a post route for friend requests
router.post("/friend", UsersController.NewRequest);
//adding a post route to approve friend requests
router.post("/approve", UsersController.ApproveRequest);


module.exports = router;
