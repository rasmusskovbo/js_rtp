import express from "express"
import { getDBConnection } from "../public/database/connectDB.js"
import { isEmailValid } from "../util/validation.js"
import * as passwordRepository from "../public/database/repository/passwordRepository.js"
import * as userRepository from "../public/database/repository/userRepository.js"
import * as sleeperService from "../public/api/sleeper/sleeperService.js"

const router = express.Router()

// Possibly refactor all repo calls to a service layer (e.g. sleeperservice)

router.put("/profile/pw", async (req, res) => {
    const pwords = req.body
    if (pwords.pw1 == pwords.pw2) {
        const db = await getDBConnection()
        var userId = req.session.userId
    
        const passwordValidated = await passwordRepository.checkPassword(pwords.currentPw, userId)
    
        if (passwordValidated) {
            await passwordRepository.updatePassword(pwords.pw1, userId)  ? res.sendStatus(200) : res.sendStatus(500)
        } else {
            res.sendStatus(400)
        } 
    } else {
        res.sendStatus(400)
    }
     
})

// TODO validate email with regex use res.next(err) to break loop
router.put("/profile/email", async (req, res, next) => {
    const email = req.body.newEmail
    const userId = req.session.userId

    if (!isEmailValid(email)) {
        res.sendStatus(400)
        return next()
    }

    const db = await getDBConnection()

    const updateSuccessful = await userRepository.updateEmailById(email, userId)

    if (updateSuccessful) {
        req.session.currentUser = email
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
      
})

router.put("/profile/sleeper", async (req, res) => {
    const updateSuccessful = await sleeperService.fetchAndUpdateSleeperInfo(req.body.sleeperUser, req.session.userId)
    
    updateSuccessful ? res.sendStatus(200) : res.sendStatus(400)
    
})

router.get("/profile/sleeperAvatarUrl", async (req, res) => {
    const avatarUrl = await sleeperService.getSleeperAvatarUrlByUserId(req.session.userId)
    
    avatarUrl ? res.send(avatarUrl) : res.sendStatus(500)
})

router.get("/profile/userDetails", async (req, res) => {
    const userDetails = await userRepository.getUserDetailsByUserId(req.session.userId)

    console.log("Router", userDetails)

    userDetails ? res.send(userDetails) : res.sendStatus(500)
})


router.get("/logout", (req, res, next) => {
    req.session.isLoggedIn = false
    res.redirect("/")
    next()
})

export default router