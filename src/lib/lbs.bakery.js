import Cookies from 'js-cookie'

class Bakery {
    constructor(activeClass) {
        this.activeClass = activeClass
    }

    setCookie(name, cvalue, exdays = 9999) {
        const cname = `${name}-${this.activeClass}`
        Cookies.set(cname, cvalue, { expires: exdays })
    }
    getCookie(name) {
        const cname = `${name}-${this.activeClass}`
        return Cookies.get(cname)
    }
    getCookieJSON(name) {
        const cname = `${name}-${this.activeClass}`
        return Cookies.getJSON(cname)
    }
}

export default Bakery
