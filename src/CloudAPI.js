const FormData = require("form-data")
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
            return null
        }
        this.setToken(res.data.user.access_token)
        return res.data
    }

    async upload(file) {
        const formData = new FormData()
        formData.append("file", file)
        const res = await this.axios.post("api/v1/uploads", formData, {
            headers: formData.getHeaders()
        })
        return res.status !== 201 ? null : res.data.fileEntry
    }

    async createFolder(name) {
        const res = await this.axios.post("api/v1/folders", { name })
        return res.status !== 200 ? null : res.data.folder
    }

    async copyFiles(files, dest) {
        const entryIds = files.map(file => file.id)
        const res = await this.axios.post("api/v1/entries/copy", {
            entryIds,
            destination: dest.id
        })
        return res.status === 200
    }
}

module.exports = CloudAPI
