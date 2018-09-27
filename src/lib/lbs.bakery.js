import Cookies from 'js-cookie'

class Bakery {
    constructor(activeView) {
        this.activeView = activeView
    }

    setCookie(name, value, days = 9999) {
        const exdays = parseInt(days, 10)
        Cookies.set(`${this.activeView}-${name}`, value, { expires: exdays })
    }
    getCookie(name) {
        return Cookies.get(`${this.activeView}-${name}`)
    }
    getCookieJSON(name) {
        return Cookies.getJSON(`${this.activeView}-${name}`)
    }
}

export default Bakery
