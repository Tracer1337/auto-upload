const axios = require("axios").default
const axiosCookieJarSupport = require("axios-cookiejar-support").default
const tough = require("tough-cookie")
const EventEmitter = require("events")

class API extends EventEmitter {
    constructor({ baseURL, withCookieJar }) {
        super()
        
        this.baseURL = baseURL
        this.axios = axios.create({ baseURL })
        
        if (withCookieJar) {
            axiosCookieJarSupport(this.axios)
            this.axios.defaults.jar = new tough.CookieJar()
            this.axios.defaults.withCredentials = true
        }
    }

    setToken(token) {
        this.axios.defaults.headers["Authorization"] = `Bearer ${token}`
    }
}

module.exports = API
