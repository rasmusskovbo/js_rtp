import fetch from 'node-fetch'
import { getDBConnection } from "../database/connectDB.js";

const BASEURL_SLEEPER_USER_INFO = "https://api.sleeper.app/v1/user/" // + <username>

export async function updateSleeperInfo(sleeperUserName, userId) {
    
    return await new Promise((resolve, reject) => {
    
        const url = BASEURL_SLEEPER_USER_INFO + sleeperUserName


        // refactor async await instead of then: https://github.com/node-fetch/node-fetch
        await fetch(url)
        .then(res => res.json())
        .then(data => {
            try {
                const db = await getDBConnection()

                db.execute(`
                        INSERT INTO sleeperInfo
                        (sleeper_username, sleeper_userid, sleeper_avatar_url, user_id)
                        VALUES
                        (?, ?, ?, ?);
                    `,
                    [data.display_name, data.user_id, data.avatar, userId]
                )

                resolve(true)

            } catch (err) {
                reject(false)
            }
        })

    })
}

/*
function login() {
    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            email: document.getElementById("email").value,
            pw1: document.getElementById("pw").value
        })
    }).then(res => {
        console.log("Response: " + res.status)
        if (res.status == 200) {
            toastr.success("Logging in...")
            setTimeout(() => location.href= "/profile", 1500);
        }
        if (res.status == 400) {
            toastr.info("Email or password not found. Please check and try again")
        }
        if (res.status == 500) {
            toastr.info("Login currently unavailable, try again later")
        }
    }) 
}


document.getElementById("login-button").addEventListener("click", login)
*/