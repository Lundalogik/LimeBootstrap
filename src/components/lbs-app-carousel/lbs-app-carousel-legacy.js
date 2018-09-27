$('#content').on('load.view', () => {
    let ol
    let li
    let binding

    $('[data-carousel]').each((index, element) => {
        try {
            try {
                lbs.log.warn('The use of the legacy data carousel attribute is deprecated.')
                eval(`binding = ${$(element).attr('data-carousel')}`)
                const { height } = binding

                $(element).height(height)

                $(element).attr({
                    id: `carousel-${index}`,
                    'data-ride': 'carousel',
                    'data-interval': '0',
                })

                $(element).addClass('carousel slide lime-carousel')

                $(element).children().each((_, child) => {
                    $(child).addClass('carousel-item')
                })

                $(element).append('<ol></ol>')
                ol = $(element).find('ol')

                $(element).append(lbs.common.carouselRight, lbs.common.carouselLeft)

                $(element).find('a').attr('data-target', `#carousel-${index}`)

                $(element).children('.carousel-item').wrapAll("<div class='carousel-inner'></div>")

                ol.addClass('carousel-indicators')
                $(element).children('.carousel-inner').children('.carousel-item').each((childIndex, child) => {
                    $(child).addClass('item')
                    ol.append('<li></li>')
                    li = ol.find('li').last()
                    if (childIndex === 0) {
                        $(child).addClass('active')
                        li.addClass('active black')
                    }
                    li.attr({
                        'data-slide-to': childIndex,
                        'data-target': `#carousel-${index}`,
                    })
                    li.addClass('black')
                })
            } catch (r) {
                lbs.log.warn('Carousel definition is not valid', r)
            }
        } catch (e) {
            lbs.log.warn('Could not load carousel', e)
        }
    })
})
