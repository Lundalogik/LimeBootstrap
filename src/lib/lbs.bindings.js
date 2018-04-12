import ko from 'knockout'
import $ from 'jquery'
import moment from 'moment'

/**
 Binding provider override
*/
export default function registerCustomBindings() {
    ko.defaultBindingProvider = ko.bindingProvider.instance
    ko.bindingProvider.instance = {
        nodeHasBindings: ko.defaultBindingProvider.nodeHasBindings,
        getBindings(node, bindingContext) {
            let bindings
            try {
                bindings = ko.defaultBindingProvider.getBindings(node, bindingContext)

                // check validity
                this.checkValue(bindings, 'text', node)
                this.checkValue(bindings, 'value', node)

                bindings = this.processDependentBindings(bindings)
            } catch (ex) {
                lbs.log.error(ex.message)
                bindings = this.getDummyBindings(node)
                bindings = this.processDependentBindings(bindings)
            }

            return bindings
        },

        // is value ok to bind to view, empty string is ok, undefined is not
        checkValue(data, val, node) {
            if (!data) { return }
            if (!Object.prototype.hasOwnProperty.call(data, val)) { return }
            if (data[val]) { return }
            if (data[val] === '' || data[val] === false || data[val] === 0) { return }

            throw new ReferenceError('Unable to set binding \'{0}\'.\nBindings value: {1}\nMessage: Property is undefined'.format(val, $(node).attr('data-bind')))
        },

        // replace dependent bindings with another that can handle the isses
        processDependentBindings(_bindings) {
            // no bindings, nothing to do
            if (!_bindings) { return _bindings }

            const bindings = _bindings
            // text and icon in same binding
            if (Object.prototype.hasOwnProperty.call(bindings, 'text')
                && Object.prototype.hasOwnProperty.call(bindings, 'icon')) {
                // dont run if text is empty
                if (bindings.text !== '') {
                    bindings.textWithIcon = { icon: bindings.icon, text: bindings.text }
                    delete bindings.text
                    delete bindings.icon
                }
            }
            return bindings
        },


        // set visible bindings to the binding values.
        // Used if bindings failed to display helper data.
        getDummyBindings(node) {
            const bindings = {}
            let match

            // set text
            match = new RegExp('text:[^,}]*').exec($(node).attr('data-bind'))
            if (match) {
                bindings.text = `Binding: ${match[0].split(':')[1].trim()}`
            }

            // set value
            match = new RegExp('value:[^,}]*').exec($(node).attr('data-bind'))
            if (match) {
                bindings.value = `Binding: ${match[0].split(':')[1].trim()}`
            }

            // icons
            match = new RegExp('icon:[^,}]*').exec($(node).attr('data-bind'))
            if (match) {
                bindings.icon = match[0].split(':')[1].trim().replace(/'/g, '')
            }

            return bindings
        },

    }

    /**
    Text with icon
    */
    ko.bindingHandlers.textWithIcon = {
        update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            const value = ko.unwrap(valueAccessor())
            const iconHtml = lbs.common.iconTemplate.format(value.icon)

            $(element).html(`${iconHtml}<span></span>`)
            ko.bindingHandlers.text.update($(element).find('span').get(0), () => value.text, allBindingsAccessor, viewModel, bindingContext)
        },
    }

    /**
    LimeLink
    */
    ko.bindingHandlers.limeLink = {
        init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            const limetype = ko.unwrap(valueAccessor().class)
            const value = ko.unwrap(valueAccessor().value)
            const limelink = lbs.common.createLimeLink(limetype, value)
            const newValueAccessor = () => () => lbs.common.executeVba(`shell, ${limelink}`)
            ko.bindingHandlers.click.init(
                element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext,
            )
        },
    }

    /**
    VBA call
    */
    ko.bindingHandlers.vba = {
        init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            const newValueAccessor = () => () => lbs.common.executeVba(valueAccessor())
            ko.bindingHandlers.click.init(
                element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext,
            )
        },
    }

    /**
    Show on google map
    */
    ko.bindingHandlers.showOnMap = {
        init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            const fullAddress = encodeURIComponent(ko.unwrap(valueAccessor()).replace(/\r?\n|\r/g, ' '))
            const link = `https://www.google.com/maps?q=${fullAddress}`
            const newValueAccessor = () => () => lbs.common.executeVba(`shell, ${link}`)
            ko.bindingHandlers.click.init(
                element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext,
            )
        },
    }

    /**
    Call phone (simply drop to shell)
    */
    ko.bindingHandlers.call = {
        init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            const number = ko.unwrap(valueAccessor())
            const newValueAccessor = () => () => lbs.common.executeVba(`shell,tel:${number}`)
            ko.bindingHandlers.click.init(
                element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext,
            )
        },
    }

    /**
    Open URL (simply drop to shell)
    */
    ko.bindingHandlers.openURL = {
        init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            const url = ko.unwrap(valueAccessor())
            const newValueAccessor = () => () => lbs.common.executeVba(`shell,${url}`)
            ko.bindingHandlers.click.init(
                element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext,
            )
        },
    }

    /**
    Invoke old-style app
    */
    ko.bindingHandlers.appInvoke = {
        init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            const newValueAccessor = () => {
                if (lbs.hasLimeConnection === true) {
                    return () => Invoker.invokeWebApplication(ko.unwrap(valueAccessor()))
                }
                return () => alert('AppInvoker is not avalible outside of lime')
            }
            ko.bindingHandlers.click.init(
                element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext,
            )
        },
    }

    /**
    Call VBA function to check if item should be visible
    THIS IS DEPRECATED AND WILL BE REMOVED IN A FUTURE VERSION.
    */
    ko.bindingHandlers.vbaVisible = {
        init(element, valueAccessor) {
            const visible = lbs.common.executeVba(ko.unwrap(valueAccessor()))
            if (visible) {
                $(element).show()
                $(element).removeClass('hidden')
                $(element).removeClass('remainHidden')
            } else {
                $(element).hide()
                $(element).addClass('hidden')
                $(element).addClass('remainHidden')
            }
        },
    }

    // Override knockout visible binding to allow for cookies
    ko.bindingHandlers.visible = {
        update(element, valueAccessor) {
            const value = ko.utils.unwrapObservable(valueAccessor())
            const isCurrentlyVisible = !$(element).is(':visible')
            if (value && !isCurrentlyVisible) {
                $(element).show()
                $(element).removeClass('remainHidden')
            } else if (!value) {
                $(element).hide()
                $(element).addClass('remainHidden')
            }
        },
    }

    ko.bindingHandlers.email = {
        init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            const email = ko.unwrap(valueAccessor())
            const newValueAccessor = () => () => lbs.common.executeVba(`shell,mailto:${email}`)
            ko.bindingHandlers.click.init(
                element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext,
            )
        },
    }

    /**
    Prepend icon
    */
    ko.bindingHandlers.icon = {
        init(element, valueAccessor) {
            const content = lbs.common.iconTemplate.format(ko.unwrap(valueAccessor()))
            if ($(element).text() !== '' && $(element).text().substring(0, content.length) !== content) {
                $(element).prepend(content)
            }
        },
    }

    /**
    Safe text binding, failes to empty string
    */
    ko.bindingHandlers.safeText = {
        update(element, valueAccessor) {
            const {
                options: {
                    value,
                    property,
                    fallback = '',
                } = {},
            } = ko.utils.unwrapObservable(valueAccessor())
            const text = property ? value[property] : value
            ko.bindingHandlers.text.update(element, () => text || fallback)
        },
    }

    ko.bindingHandlers.href = {
        update(element, valueAccessor) {
            ko.bindingHandlers.attr.update(element, () => ({ href: valueAccessor() }))
        },
    }

    ko.bindingHandlers.src = {
        update(element, valueAccessor) {
            ko.bindingHandlers.attr.update(element, () => ({ src: valueAccessor() }))
        },
    }

    ko.bindingHandlers.instantValue = {
        init(element, valueAccessor, allBindings) {
            // for backwards compatibility w/ knockout  < 3.0
            const newAllBindings = () => ko.utils.extend(allBindings(), { valueUpdate: 'afterkeydown' })
            newAllBindings.get = (a) => { return a === 'valueupdate' ? 'afterkeydown' : allBindings.get(a) }
            newAllBindings.has = a => a === 'valueupdate' || allBindings.has(a)

            ko.bindingHandlers.value.init(element, valueAccessor, newAllBindings)
        },
        update: ko.bindingHandlers.value.update,
    }

    ko.bindingHandlers.toggle = {
        init(element, valueAccessor) {
            const value = valueAccessor()
            ko.applyBindingsToNode(element, {
                click() {
                    value(!value())
                },
            })
        },
    }

    ko.bindingHandlers.stopBinding = {
        init() {
            return { controlsDescendantBindings: true }
        },
    }
    ko.virtualElements.allowedBindings.stopBinding = true

    ko.bindingHandlers.popover = {
        init(element, valueAccessor) {
            let dom
            let {
                color = 'blue',
                title = 'No title',
                icon = '',
            } = valueAccessor()

            const {
                placement = 'top',
                trigger = 'hover',
                type = '',
            } = valueAccessor()

            switch (type) {
            case 'error':
                color = 'red'
                icon = '<i class="fa fa-times"></i> '
                title = 'Error'
                break
            case 'info':
                color = 'blue'
                icon = '<i class="fa fa-info-circle"></i> '
                title = 'Information'
                break
            case 'warning':
                color = 'orange'
                icon = '<i class="fa fa-warning"></i> '
                title = 'Warning'
                break
            case 'success':
                color = 'green'
                icon = '<i class="fa fa-check"></i> '
                title = 'Success'
                break
            case 'custom':
                break
            default:
                title = ''
                dom = valueAccessor()
            }
            if (!dom) {
                icon = `<i class="fa ${valueAccessor().icon}"></i>`
                title = `<span>${title}</span>`
                dom = `<div><div class="message-header ${color}">${icon}${title}</div>${valueAccessor().text}</div>`
            }
            $(element).attr({
                'data-toggle': 'popover', 'data-container': 'body', 'data-content': dom, 'data-placement': placement,
            })
            $(element).popover({ trigger, html: 'true' })
        },
    }

    ko.bindingHandlers.tooltip = {
        init(element, valueAccessor) {
            const {
                placement = 'top',
                text,
            } = valueAccessor()

            $(element).attr({
                'data-toggle': 'tooltip',
                'white-space': 'nowrap',
                'data-original-title': text || valueAccessor(),
                'data-placement': placement || 'top',
            })

            $(element).tooltip()
        },
    }

    ko.filters.number = (value, nbrOfDecimals = 2) => {
        const filteredValue = Number(`${Math.round(`${value}e${nbrOfDecimals}`)}e-${nbrOfDecimals}`)
        return filteredValue.toLocaleString()
    }

    ko.filters.currency = (value = '', currency = 'kr', divider = ' ') => {
        const currencyfirst = ['$', '£', '¥', '₱', '₭', '₦', '₩', '₮', '฿', '₹', '₡', '৳']

        if (currencyfirst.indexOf(currency) > -1) {
            return `${currency} ${value.replace(/\B(?=(\d{3})+(?!\d))/g, divider)}`
        }
        return `${value.replace(/\B(?=(\d{3})+(?!\d))/g, divider)} ${currency}`
    }

    ko.filters.percent = value => `${value * 100}%`

    ko.filters.fromNow = date => moment(date.slice(0, 19)).fromNow(true)

    ko.bindingHandlers.rotate = {
        update(element, valueAccessor) {
            // This will be called once when the binding is first applied to an element,
            // and again whenever the associated observable changes value.
            // Update the DOM element based on the supplied values here.

            const deg = valueAccessor()
            $(element).css({
                '-webkit-transform': `rotate(${deg}deg)`,
                '-moz-transform-transform': `rotate(${deg}deg)`,
                '-ms-transform-transform': `rotate(${deg}deg)`,
                '-o-transform:': `rotate(${deg}deg)`,
                'transform:': `rotate(${deg}deg)`,
            })
        },
    }
}
