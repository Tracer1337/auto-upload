const faker = require("faker")
const config = require("../config.json")
const url = require("../url.json")

const EMAIL_SELECTOR = "#email"
const PASSWORD_SELECTOR = "#register_password"
const PASSWORD_CONFIRM_SELECTOR = "#register_password_confirmation"
const SUBMIT_BUTTON_SELECTOR = "form button"

async function register(browser) {
    const page = await browser.newPage()
    await page.goto(url.register)
    
    const email = faker.internet.email()

    await page.type(EMAIL_SELECTOR, email)
    await page.type(PASSWORD_SELECTOR, config.password)
    await page.type(PASSWORD_CONFIRM_SELECTOR, config.password)
    await page.click(SUBMIT_BUTTON_SELECTOR)

    await page.close()

    return [email, config.password]
}

module.exports = register
