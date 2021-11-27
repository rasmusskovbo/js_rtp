import express from "express";
import bcrypt from "bcrypt";
import { checkPassword } from "../public/database/passwordService.js";
import { getDBConnection } from "../public/database/connectDB.js";
const router = express.Router();

// todo investigate proper use of response/express to avoid sending multiple res.status through without use of flag
router.post("/login", async (req, res) => {
    const db = await getDBConnection()
    const password = req.body.pw
    var userId = -1
    var validationHasFailed = false

    // Get user id by email
    
    try {
        const [results, fields] = await db.execute(`
            SELECT id FROM users WHERE email = ?
            `, 
            [req.body.email]
        )

        userId = results[0].id
    } catch (err) {
        validationHasFailed = true
        res.sendStatus(400)
    }       

    if (!validationHasFailed) {
        await checkPassword(password, userId) ? res.sendStatus(200) : res.sendStatus(400)
    }
    
})

// todo toastr then timeout (make sure toastr cdns are in header and footer)
router.get("/logout", (req, res) => {
    req.session.loggedIn = false;
    res.redirect("/")
})

export default router