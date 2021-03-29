const url = require("../url.json")

const EMAIL_SELECTOR = "#login-email"
const PASSWORD_SELECTOR = "#login-password"
const LOGIN_BUTTON_SELECTOR = "button"

async function login(browser, { email, password }) {
    const page = await browser.newPage()
    await page.goto(url.login)

    await page.type(EMAIL_SELECTOR, email)
    await page.type(PASSWORD_SELECTOR, password)
    await page.click(LOGIN_BUTTON_SELECTOR)
    
    await page.waitForNavigation()
    await page.close()

    return page
}

module.exports = login
