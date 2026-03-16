const {Router} = require('express');
const authcontroller = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = Router();

router.post("/register",authcontroller.registerUser)

router.post("/login",authcontroller.loginUser)

router.get("get-me",authMiddleware.authUser, authcontroller.getMe )

router.get("/logout",authcontroller.logoutUser)

module.exports = router;