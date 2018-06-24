import Cookies from 'js-cookie'

class Bakery {
    constructor(activeClass) {
        this.activeClass = activeClass
    }

    setCookie(name, value, days = 9999) {
        const exdays = parseInt(days, 10)
        Cookies.set(`${this.activeClass}-${name}`, value, { expires: exdays })
    }
    getCookie(name) {
        return Cookies.get(`${this.activeClass}-${name}`)
    }
    getCookieJSON(name) {
        return Cookies.getJSON(`${this.activeClass}-${name}`)
    }
}

export default Bakery
