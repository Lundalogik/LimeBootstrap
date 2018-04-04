
/**
--------------------------------------------------------
Common functions used in lbs
--------------------------------------------------------
*/
const common = {

    /**
    Fetch a random funny error text
    */
    getErrorText() {
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
    },

    /**
    Get icon html
    */
    iconTemplate: "<i class='fa fa-fw {0}'></i>",

    /**
    URLencode sensitive strings
    */
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    },
    carouselRight: "<a class='right carousel-control' data-slide='next' role='button'><i class='fa fa-arrow-right'></i></a>",
    carouselLeft: "<a class='left carousel-control' data-slide='prev' role='button'><i class='fa fa-arrow-left'></i> </a>",
    /**
    Create a limelink from class, id, server and database properties
    */
    createLimeLink(limeClass, limeId) {
        return `limecrm:${limeClass}.${lbs.activeDatabase}.${lbs.activeServer}?${limeId}`
    },

    /**
    Fetch the url parameters from the GET-URL
    */
    getURLParameter(name) {
        const param = decodeURI((RegExp(`${name}=` + '(.+?)(&|$)').exec(location.search) || [, null])[1])
        return (param == 'null' ? null : param)
    },

    /**
    * Helperfunction to run VBA functions from JS
    */
    executeVba(inString, params) {
        try {
            if (lbs.hasLimeConnection) {
                // lbs.log.debug("Trying to execute VBA:" + inString);
            } else {
                lbs.log.warn(`No lime connection, will not exec VBA call:${inString}`)
                return null
            }

            var vbaline

            let inArgs = inString.split(',')
            if (params) {
                inArgs = inArgs.concat(params)
            }

            if (inArgs.length > 1) {
                let args = ''
                vbaline = `lbs.limeDataConnection.Run('${inArgs[0]}', `
                for (let i = 1; i < inArgs.length; i++) {
                    // cast as string
                    inArgs[i] = String(inArgs[i])

                    while (inArgs[i].charAt(0) === ' ') {
                        inArgs[i] = inArgs[i].substr(1)
                    }
                    args += `'${inArgs[i]}'`
                    if (i != inArgs.length - 1) { args += ',' }
                }
                vbaline += `${args})`

                lbs.log.debug(`Trying to execute VBA:${vbaline}`)
                return eval(vbaline)
            }

            vbaline = `lbs.limeDataConnection.Run('${arguments[0]}')`
            lbs.log.debug(`Trying to execute VBA:${vbaline}`)
            return lbs.limeDataConnection.Run(arguments[0])
        } catch (e) {
            lbs.log.error(`Failed to execute VBA:${vbaline}`, e)
            return null
        }
    },

    /**
    replace newline with br
    */
    nl2br(input) {
        return input.replace(/\n/g, '<br />')
    },

    /**
    replace newline with br + tab
    */
    nl2brIndent(input) {
        return input.replace(/\n/g, '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
    },


    /**
    Add newline if braket
    */
    brak2br(input) {
        return input.replace(/{/g, '<br />').replace(/}/g, '<br />')
    },

    /**
    Add attributes from one JS objekt to another. Duplicates are discarded.
    */
    mergeOptions(obj1, obj2, overrideExisting) {
        $.each(obj2, (key, value) => {
            if (!value) {
                // dont override with empty
            } else if (!obj1[key]) {
                obj1[key] = value
            } else if (obj1[key] instanceof Array && value instanceof Array) {
                obj1[key] = obj1[key].concat(value)
            } else if (overrideExisting) {
                obj1[key] = value
                lbs.log.debug("Key '{0}' in view model was overriden by dataload".format(key))
            } else {
                lbs.log.warn("Key '{0}' was not added to the view model. Key already exists".format(key))
            }
        })
        return obj1
    },

    /**
    Generate GUID
    */
    generateGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    },

    checkGroup(groups, userGroups) {
        return userGroups.map(f => f.Name).filter(n => groups.indexOf(n) != -1).length > 0
    },

    /*
        Returns the version in a comparable format.
    */
    parseVersion(inputString) {
        let nMajor = 0
        let nMinor = 0
        let nBuild = 0
        let iMajor = 0
        let iMinor = 0
        let iBuild = 0
        let nIndex = 0


        const strVersion = inputString.split('.')

        for (nIndex = 0; nIndex < strVersion.length && nIndex < 3; nIndex++) {
            if (!isNaN(strVersion[nIndex])) {
                if (nIndex === 0) {
                    iMajor = parseInt(strVersion[nIndex])
                    nMajor = iMajor * 10000
                } else if (nIndex === 1) {
                    iMinor = parseInt(strVersion[nIndex])
                    nMinor = iMinor * 1000
                } else if (nIndex == 2) {
                    iBuild = parseInt(strVersion[nIndex])
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
    },

    compareVersions(ls, rs) {
        const rsSplitted = rs.toString().split('.')
        const lsSplitted = ls.toString().split('.')
        let returnValue = null

        for (let i = 0; i < Math.min(rsSplitted.length, lsSplitted.length); i++) {
            const rsCurrent = parseInt(rsSplitted[i])
            const lsCurrent = parseInt(lsSplitted[i])

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
    },


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

export default common
