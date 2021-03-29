const LOGIN_URL = "https://cloud2go.tk/login"
const EMAIL_SELECTOR = "#login-email"
const PASSWORD_SELECTOR = "#login-password"
const LOGIN_BUTTON_SELECTOR = "button"

async function login(browser, { email, password }) {
    const page = await browser.newPage()
    await page.goto(LOGIN_URL)

    await page.type(EMAIL_SELECTOR, email)
    await page.type(PASSWORD_SELECTOR, password)
    await page.click(LOGIN_BUTTON_SELECTOR)

    return page
}

module.exports = login
