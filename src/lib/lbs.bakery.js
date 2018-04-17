class Bakery {
    static setCookie(name, cvalue, exdays) {
        const ap = decodeURI((RegExp('ap=(.+?)(&|$)').exec(window.location.search) || [null, null])[1])

        const cname = `${name}-${ap}`

        const d = new Date()
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
        const expires = `expires=${d.toUTCString()}`

        document.cookie = `${cname}=${cvalue}; ${expires}`
    }
    static getCookie(name) {
        const ap = decodeURI((RegExp('ap=(.+?)(&|$)').exec(window.location.search) || [null, null])[1])

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
