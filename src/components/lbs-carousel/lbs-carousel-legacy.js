import $ from 'jquery'

$('#content').on('load.complete', () => {
    $('.carousel').carousel().on('slide.bs.carousel', (e) => {
        const nextH = $(e.relatedTarget).height()
        $(this).find('.active.item').parent().animate({ height: Math.max(nextH, $(e.currentTarget).height()) }, 500)
    })
})

