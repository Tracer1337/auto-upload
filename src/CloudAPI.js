const API = require("./API")

class CloudAPI extends API {
    constructor() {
        super({
            baseURL: "https://cloud2go.tk/"
        })
    }

    async register(email, password) {
        const res = await this.axios.post("api/v1/auth/register", {
            email,
            password,
            password_confirmation: password
        })
        return res.status === 200
    }
}

module.exports = CloudAPI
