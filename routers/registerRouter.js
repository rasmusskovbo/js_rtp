import express from "express"
import { getDBConnection } from "../public/database/connectDB.js"
import { registerPassword } from "../public/database/repository/passwordRepository.js"
import { isEmailValid } from "../util/validation.js"
const router = express.Router();

// refactor to use userRepository
router.post("/register/user", async (req, res, next) => {
    if (!isEmailValid(req.body.email)) {
        console.log(req.body.email)
        res.sendStatus(403)
        return next()
    }

    if (req.body.pw1 == req.body.pw2) {
        const db = await getDBConnection()
        
        
        const [results, fields] = await db.execute(`
            SELECT * FROM users WHERE email = ?
            `,
            [req.body.email]
        )
        if (results.length <= 0) {
            try {
                const [results, fields] = await db.execute(`
                    INSERT INTO users 
                    (email, username)
                    VALUES
                    (?, ?);
                    `,
                    [req.body.email, req.body.username]
                )
                await registerPassword(req.body.pw1, results.insertId) ? res.sendStatus(200) : res.sendStatus(500)
            } catch (error) {
                console.log(error)
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(409)
        }
    } else {
        res.sendStatus(400)
    }
})
 
export default router