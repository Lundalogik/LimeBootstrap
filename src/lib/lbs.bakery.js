import Cookies from 'js-cookie'

class Bakery {
    constructor(activeClass) {
        this.activeClass = activeClass
    }

    setCookie(name, cvalue, exdays = 9999) {
        Cookies.set(name, cvalue, { expires: exdays, path: this.activeClass })
    }
    getCookie(name) {
        return Cookies.get(name)
    }
    getCookieJSON(name) {
        return Cookies.getJSON(name)
    }
}

export default Bakery
