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

    async login(email, password) {
        const res = await this.axios.post("api/v1/auth/login", {
            email,
            password,
            token_name: "this argument is useless"
        })
        if (res.status !== 200) {
            return false
        }
        this.setToken(res.data.user.access_token)
        return res.data
    }
}

module.exports = CloudAPI
