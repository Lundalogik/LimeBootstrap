import Cookies from 'js-cookie'

class Bakery {
    constructor(activeClass) {
        this.activeClass = activeClass
    }

    setCookie(name, value, days = 9999) {
        const exdays = parseInt(days, 10)
        Cookies.set(name, value, { expires: exdays, path: this.activeClass })
    }
    getCookie(name) {
        return Cookies.get(name)
    }
    getCookieJSON(name) {
        return Cookies.getJSON(name)
    }
}

export default Bakery
