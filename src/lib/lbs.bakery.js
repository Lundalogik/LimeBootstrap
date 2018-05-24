class Bakery {
    constructor(activeClass) {
        this.activeClass = activeClass
    }

    setCookie(name, cvalue, exdays) {
        const ap = this.activeClass

        const cname = `${name}-${ap}`

        const d = new Date()
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
        const expires = `expires=${d.toUTCString()}`

        document.cookie = `${cname}=${cvalue}; ${expires}`
    }
    getCookie(name) {
        const ap = this.activeClass

        const cname = `${name}-${ap}=`

        const ca = document.cookie.split(';')
        for (let i = 0; i < ca.length; i += 1) {
            let c = ca[i]

            while (c.charAt(0) === ' ') c = c.substring(1)
            if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length)
        }

        return ''
    }
}

export default Bakery
