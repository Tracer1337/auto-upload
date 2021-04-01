const API = require("./API")
const { sleep } = require("./utils")

class MailAPI extends API {
    constructor() {
        super({
            baseURL: "https://10minutemail.com/",
            withCookieJar: true
        })
    }

    async getAddress() {
        const res = await this.axios.get("session/address")
        return res.data.address
    }

    async getEmails() {
        const res = await this.axios.get("messages/messagesAfter/0")
        return res.data
    }

    async awaitEmail() {
        let email

        while (!email) {
            const emails = await this.getEmails()
            email = emails[0]

            if (!email) {
                await sleep(3000)
            }
        }

        return email
    }
}

module.exports = MailAPI
