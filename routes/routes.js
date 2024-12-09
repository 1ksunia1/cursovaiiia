const router = require("express").Router();


const PageController = require("../controllers/PageController");
const AuthController = require("../controllers/AuthController");
const { register, login } = require('../controllers/AuthController');

const Middleware = require("../middleware");
const UserRepository = require("../repositories/UserRepository");
router.use(Middleware.contentUnlock);

router.get("/", (req, res) => {
    res.redirect('/index'); // перенаправление на новую главную страницу
});

router.get("/authorization", PageController.authorization);
router.get("/registration", PageController.registration);
router.get("/index", (req, res) => {
    res.render("index", { user: req.user }); // передайте данные пользователя, если необходимо
});


console.log('Register method:', AuthController.register);
console.log('Login method:', AuthController.login);
console.log('Logout method:', AuthController.logout);


router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.post("/login", AuthController.login);



module.exports = router;