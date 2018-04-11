import $ from 'jquery'

class Bakery {
    static loader() {
        const ap = decodeURI((RegExp('ap=(.+?)(&|$)').exec(window.location.search) || [null, null])[1])

        // On load: check collapsible menu cookies
        $('.expandable').each((index, element) => {
            if (lbs.bakery.getCookie(`${$(element).index()}ul${ap}`) === '0') {
                $(element).find('.menu-header').prepend("<i class='fa fa-angle-down'> </i>")
                $(element).removeClass('collapsed')
                $(element).children('li').not('.remainHidden').show()
            } else {
                $(element).find('.menu-header').prepend("<i class='fa fa-angle-right'> </i>")
                $(element).addClass('collapsed')
                $(element).children('li').not('.menu-header').not('.divider')
                    .hide()
            }
        })

        $('.expandable').find('.menu-header').click((event) => {
            const element = event.currentTarget
            const menuDiv = $(element).parent()
            let i = lbs.bakery.getCookie(`${menuDiv.index()}ul${ap}`)

            i = i === '0' ? '1' : '0'
            lbs.bakery.setCookie(`${menuDiv.index()}ul${ap}`, i, '200')
            lbs.bakery.hideshow(menuDiv, ap)
        })
    }

    static hideshow(menu, ap) {
        const menuDiv = $(menu)
        $(menu).find('i').first().toggleClass('fa fa-angle-down') // expanded
        $(menu).find('i').first().toggleClass('fa fa-angle-right') // Hidden
        if (lbs.bakery.getCookie(`${$(menu).index()}ul${ap}`) === '0') {
            menuDiv.removeClass('collapsed')
            menuDiv.children('li').not('.remainHidden').fadeIn(200)
        } else {
            menuDiv.addClass('collapsed')
            menuDiv.children('li').not('.menu-header').not('.divider').fadeOut(200)
        }
    }

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
