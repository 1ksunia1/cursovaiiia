const PageService = require("../services/PageService");

class PageController {
    static async authorization(req, res) {
        res.render("authorization", { user: req.user });
    }

    static async registration(req, res) {
        res.render("registration", { user: req.user });
    }

    
}

module.exports = PageController;