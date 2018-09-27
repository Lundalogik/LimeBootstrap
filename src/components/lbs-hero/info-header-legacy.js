// header icons
import $ from 'jquery'

$('#content').bind('load.view', () => {
    $('.header-icon').each((index, element) => {
        console.warn('[Deprication] You are using the legacy info-header markup. Update to the new component <info-header>')
        $(element).addClass('header-icon-container')
        $(element).css('background-image', `url('resources/${lbs.activeView}.png')`)
        $(element).append(`<img src="resources/${lbs.activeView}.png" class="header-icon-invis" />`)
    })
})

