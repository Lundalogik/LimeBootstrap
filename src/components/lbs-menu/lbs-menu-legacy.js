import $ from 'jquery'


const ap = decodeURI((RegExp('ap=(.+?)(&|$)').exec(window.location.search) || [null, null])[1])

const hideshow = (menu) => {
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

$('#content').bind('load.complete', () => {
    // On load: check collapsible menu cookies
    $('.expandable').each((index, element) => {
        console.warn('[Deprication] You are using the legacy menu markup. Update to the new component <lbs-menu>')
        const menuHeader = $(element).find('.menu-header')
        if (lbs.bakery.getCookie(`${$(element).index()}ul${ap}`) === '0') {
            menuHeader.prepend("<i class='fa fa-angle-down'> </i>")
            $(element).removeClass('collapsed')
            $(element).children('li').not('.remainHidden').show()
        } else {
            menuHeader.prepend("<i class='fa fa-angle-right'> </i>")
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
        hideshow(menuDiv)
    })
})
