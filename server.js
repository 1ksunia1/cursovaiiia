require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const cookies = require("cookie-parser");
const Middleware = require("./middleware"); // Импортируйте здесь

const app = express();

// Логирование заголовков ответа
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log('Response headers:', res.getHeaders()); // Логирование заголовков
    });
    next();
});

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Позволяет инлайн-скрипты
            "https://code.jquery.com",
            "https://cdn.jsdelivr.net",
            "https://stackpath.bootstrapcdn.com",
            "https://getbootstrap.com"
        ],
        scriptSrcElem: [
            "'self'",
            "https://code.jquery.com",
            "https://cdn.jsdelivr.net",
            "https://stackpath.bootstrapcdn.com"
        ],
        styleSrc: ["'self'", "'unsafe-inline'"], // Позволяет инлайн-стили
        imgSrc: ["'self'", "data:"] // Позволяет загрузку изображений с data URL
    }
}));

morgan.token("remote_addr", (req) => req.ip || req.socket.remoteAddress);

const logs_dir = path.join(__dirname, "logs");
if (!fs.existsSync(logs_dir))
    fs.mkdirSync(logs_dir);

const lstream = fs.createWriteStream(path.join(logs_dir, "req.log"), { flags: "a" });

app.use(morgan(':remote_addr - - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', { stream: lstream }));

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookies());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

// Логирование middleware
console.log('ContentUnlock middleware:', Middleware.contentUnlock);
console.log('Ident middleware:', Middleware.ident); // Проверяем, что это не undefined

// Подключите middleware
app.use(Middleware.contentUnlock);
app.use(Middleware.ident); // Убедитесь, что этот middleware вызывается перед маршрутизацией

// Подключите маршруты
app.use(require(path.join(__dirname, "routes", "routes")));

app.get('/', (req, res) => {
    res.render('index', { user: req.user }); // Передайте данные о пользователе
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});



app.get('/courses', (req, res) => {
    // Логирование пользователя
    console.log('User in courses route:', req.user);
    res.render('courses', { user: req.user, courses: courses }); // Передаём user и courses
});


app.get('/registration', (req, res) => {
    res.render('register');
});

app.get('/authorization', (req, res) => {
    res.render('login');
});
const routes = require('./routes/routes');

