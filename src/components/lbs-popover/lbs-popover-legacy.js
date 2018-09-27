import $ from 'jquery'
// TODO: Fix this implementation
// Running this code on every click? Not nice
// Clickable popovers close on click outside
$('#content').on('load.complete').on('click', (e) => {
    if ($(e.target).data('toggle') !== 'popover' && $(e.target).parents('.popover.in').length === 0) {
        $('[data-toggle="popover"]').popover('hide')
    }
})
