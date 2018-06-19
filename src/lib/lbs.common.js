import $ from 'jquery'
/**
--------------------------------------------------------
Common functions used in lbs
--------------------------------------------------------
*/
class Common {
    static get iconTemplate() { return "<i class='fa fa-fw {0}'></i>" }
    static get carouselRight() { return "<a class='right carousel-control' data-slide='next' role='button'><i class='fa fa-arrow-right'></i></a>" }
    static get carouselLeft() { return "<a class='left carousel-control' data-slide='prev' role='button'><i class='fa fa-arrow-left'></i> </a>" }

    /**
    Fetch a random funny error text
    */
    static getErrorText() {
        const nbr = Math.floor((Math.random() * 5) + 1)
        switch (nbr) {
        case 1:
            return 'Oh snap!'
        case 2:
            return 'Oh no!'
        case 3:
            return 'God damit!'
        case 4:
            return 'Holy guacamole!'
        case 5:
            return 'Arghhhh!'
        default:
            return 'Error'
        }
    }
    /**
    URLencode sensitive strings
    */
    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    }

    /**
    Create a limelink from class, id, server and database properties
    */
    static createLimeLink(limeClass, limeId) {
        return `limecrm:${limeClass}.${lbs.activeDatabase}.${lbs.activeServer}?${limeId}`
    }

    /**
    Fetch the url parameters from the GET-URL
    */
    static getURLParameter(name) {
        const param = decodeURIComponent((RegExp(`${name}=(.+?)(&|$)`).exec(window.location.search) || [null, null])[1])
        return (param === 'null' ? null : param)
    }

    /**
    * Helperfunction to run VBA functions from JS
    */
    static executeVba(inString, params) {
        try {
            if (lbs.hasLimeConnection) {
                // lbs.log.debug("Trying to execute VBA:" + inString);
            } else {
                lbs.log.warn(`No lime connection, will not exec VBA call:${inString}`)
                return null
            }

            let vbaline

            let inArgs = inString.split(',')
            if (params) {
                inArgs = inArgs.concat(params)
            }

            if (inArgs.length > 1) {
                let args = ''
                vbaline = `lbs.limeDataConnection.Run('${inArgs[0]}', `
                for (let i = 1; i < inArgs.length; i += 1) {
                    // cast as string
                    inArgs[i] = String(inArgs[i])

                    while (inArgs[i].charAt(0) === ' ') {
                        inArgs[i] = inArgs[i].substr(1)
                    }
                    args += `'${inArgs[i]}'`
                    if (i !== inArgs.length - 1) { args += ',' }
                }
                vbaline += `${args})`

                lbs.log.debug(`Trying to execute VBA:${vbaline}`)
                return eval(vbaline)
            }
            vbaline = `lbs.limeDataConnection.Run('${inString}')`
            lbs.log.debug(`Trying to execute VBA:${vbaline}`)
            return lbs.limeDataConnection.Run(inString)
        } catch (e) {
            lbs.log.error(`Failed to execute VBA:${inString}`, e)
            return null
        }
    }

    /**
    replace newline with br
    */
    static nl2br(input) {
        return input.replace(/\n/g, '<br />')
    }

    /**
    replace newline with br + tab
    */
    static nl2brIndent(input) {
        return input.replace(/\n/g, '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
    }


    /**
    Add newline if braket
    */
    static brak2br(input) {
        return input.replace(/{/g, '<br />').replace(/}/g, '<br />')
    }

    /**
    Add attributes from one JS objekt to another. Duplicates are discarded.
    */
    static mergeOptions(obj1, obj2, overrideExisting) {
        const retval = obj1
        $.each(obj2, (key, value) => {
            if (!value) {
                // dont override with empty
            } else if (!obj1[key]) {
                retval[key] = value
            } else if (obj1[key] instanceof Array && value instanceof Array) {
                retval[key] = obj1[key].concat(value)
            } else if (overrideExisting) {
                retval[key] = value
                lbs.log.debug("Key '{0}' in view model was overriden by dataload".format(key))
            } else {
                lbs.log.warn("Key '{0}' was not added to the view model. Key already exists".format(key))
            }
        })
        return retval
    }

    /**
    Generate GUID
    */
    static generateGuid() {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
    }

    static checkGroup(groups, userGroups) {
        return userGroups.map(f => f.Name).filter(n => groups.indexOf(n) !== -1).length > 0
    }

    /*
        Returns the version in a comparable format.
    */
    static parseVersion(inputString) {
        let nMajor = 0
        let nMinor = 0
        let nBuild = 0
        let iMajor = 0
        let iMinor = 0
        let iBuild = 0
        let nIndex = 0


        const strVersion = inputString.split('.')

        for (nIndex = 0; nIndex < strVersion.length && nIndex < 3; nIndex += 1) {
            if (!Number.isNaN(strVersion[nIndex])) {
                if (nIndex === 0) {
                    iMajor = parseInt(strVersion[nIndex], 10)
                    nMajor = iMajor * 10000
                } else if (nIndex === 1) {
                    iMinor = parseInt(strVersion[nIndex], 10)
                    nMinor = iMinor * 1000
                } else if (nIndex === 2) {
                    iBuild = parseInt(strVersion[nIndex], 10)
                    nBuild = iBuild
                }
            } else {
                lbs.log.error("Could not parse lime version number '{0}'".format(inputString))
            }
        }

        return {
            comparable: nMajor + nMinor + nBuild,
            full: '{0}.{1}.{2}'.format(iMajor, iMinor, iBuild),
            major: iMajor,
            nMinor: iMinor,
            build: iBuild,
        }
    }

    static compareVersions(ls, rs) {
        const rsSplitted = rs.toString().split('.')
        const lsSplitted = ls.toString().split('.')
        let returnValue = null

        for (let i = 0; i < Math.min(rsSplitted.length, lsSplitted.length); i += 1) {
            const rsCurrent = parseInt(rsSplitted[i], 10)
            const lsCurrent = parseInt(lsSplitted[i], 10)

            if (rsCurrent > lsCurrent) {
                returnValue = 1 // ls is a higher version number
                break
            } else if (rsCurrent < lsCurrent) {
                returnValue = -1 // rs is a higher version number
                break
            } else {
                // Continute to next version part
            }
        }

        if (returnValue == null && rsSplitted.length < lsSplitted.length) {
            returnValue = -1 // rs is a higher version number
        } else if (returnValue == null && rsSplitted.length > lsSplitted.length) {
            returnValue = 1 // ls is a higher version number
        } else if (returnValue == null) {
            returnValue = 0 // The same versions
        }

        return returnValue
    }
}

/**
--------------------------------------------------------
Some extensions to standard classes
--------------------------------------------------------
*/

/**
String.format
*/
if (!String.prototype.format) {
    String.prototype.format = function () {
        const args = arguments
        return this.replace(/{(\d+)}/g, (match, number) => (typeof args[number] !== 'undefined' ? args[number] : match))
    }
}

export default Common
