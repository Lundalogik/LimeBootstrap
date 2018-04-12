// header icons
import $ from 'jquery'

$('.header-icon').each((index, element) => {
    lbs.log.console.warn('Deprication warning: You are using the legacy info-header markup. Update to the new component')
    $(element).addClass('header-icon-container')
    $(element).css('background-image', `url('resources/${lbs.activeClass}.png')`)
    $(element).append(`<img src="resources/${lbs.activeClass}.png" class="header-icon-invis" />`)
})
