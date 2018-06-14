/*
* This file is basically a header file, used to expose internal functions
* when importing Lime Bootstrap through npm
*/


import LimeObject from './lib/dataSources/lbs.dataSource.limeobject'
import LimeObjects from './lib/dataSources/lbs.dataSource.limeobjects'
import CustomEndpoint from './lib/dataSources/lbs.dataSource.customEndpoint'
import Translations from './lib/dataSources/lbs.dataSource.translations'
import { StupidVBAParameterError } from './lib/lbs.errors'

export const activeInspector = { lbs }

/**
 * log is lbs internal logging tool. The output
 * is controlled by setting verbosity level
 * in `_config.js`
 *
 * @export
 * @class log
 */
export class log {
    /**
     * log messages to the console
     * info is at verbosity level 3 of 4
     *
     * @static
     * @param {*} args
     * @memberof log
     */
    static info(args) {
        lbs.log.info(args)
    }

    /**
     * log messages to the console
     * error is at verbosity level 1 of 4
     *
     * @static
     * @param {*} args
     * @memberof log
     */
    static error(args) {
        lbs.log.error(args)
    }

    /**
     * log messages to the console
     * warn is at verbosity level 2 of 4
     *
     * @static
     * @param {*} args
     * @memberof log
     */
    static warn(args) {
        lbs.log.warn(args)
    }

    /**
     * log messages to the console
     * debug is at verbosity level 4 of 4
     *
     * @static
     * @param {*} args
     * @memberof log
     */
    static debug(args) {
        lbs.log.debug(args)
    }
    /**
     * Stops a named timer and prints result.
     *
     * @static
     * @param {string} name
     * @memberof log
     */
    static stopTimer(name) {
        lbs.log.stopTimer(name)
    }

    /**
     * Starts a named timer. Used to messure performance
     * Stop the timer by calling `stopTimer`
     *
     * @static
     * @param {string} name
     * @memberof log
     */
    static startTimer(name) {
        lbs.log.startTimer(name)
    }
}


/**
 * lfx is a class holding helpful functions working with Lime
 *
 * @export
 * @class lfx
 */
export class lfx {
    /**
     * Creates an instance of DataSource subclass
     * See available data sources at {@link https://www.lime-bootstrap.com/datasources/}
     * @deprecated
     * @param {object} dataSourceLiteral
     * @returns {object} data
     */
    static loadDataSource(dataSource) {
        return lbs.loader.loadDataSource(dataSource)
    }

    /**
     * Executes a VBA function
     *
     * @static
     * @param {string} callsign - Module and function name
     * @param {} args - Arguments
     * @memberof lfx
     * @returns {string | null}
     */
    static execVba(callsign, ...args) {
        if (args.length > 5) {
            throw StupidVBAParameterError('Can not pass more then five parameters to VBA')
        }
        return lbs.common.executeVba(callsign, args.join(','))
    }

    /**
     * Creates an instance of DataSource subclass
     * See available data sources at {@link https://www.lime-bootstrap.com/datasources/}
     * @param {Object<string, string|number>} dataSourceLiteral
     * @returns {LimeObject | LimeObjects | CustomEndpoint | Translations} An instance of a dataSource subclass
     */
    static createDataSource(dataSourceLiteral) {
        return lbs.loader.createDataSource(dataSourceLiteral)
    }

    /**
     * Creates an instance of a LimeObjectDataSource
     *
     * @static
     * @param {string} limetype
     * @param {number} id
     * @param {Array<string>} [embed=[]]
     * @memberof lfx
     * @returns {LimeObject} An instance of a LimeObjectDataSource
     */
    static createLimeObject(limetype, id, embed = []) {
        return new LimeObject({ limetype, id, embed },
            lbs.session,
            lbs.activeServer,
            lbs.activeDatabase)
    }

    /**
     * Creates an instance of a LimeObjectDataSource for the active LimeObject
     *
     * @static
     * @param {Array<string>} [embed=[]]
     * @memberof lfx
     * @returns {LimeObject} An instance of a LimeObjectDataSource
     */
    static createActiveLimeObject(embed = []) {
        const id = lbs.activeLimeObjectId
        const limeType = lbs.activeClass
        return new LimeObject({ limeType, id, embed },
            lbs.session,
            lbs.activeServer,
            lbs.activeDatabase)
    }

    /**
     * Creates an instance of a LimeObjects data source
     *
     * @static
     * @param {string} sort - name property to sort on. Example 'name'
     * @param {string} [sortOrder='desc'] - Sort either 'acs' or 'desc'
     * @param {string} [filter='']
     * @param {string} limetype
     * @param {boolean} fetchAll
     * @param {Array<string>} [embed=[]]
     * @param {number} [limit=10]
     * @returns {LimeObjects}
     * @memberof lfx
     */
    static createLimeObjects(sort, sortOrder = 'desc', filter = '', limetype, fetchAll, embed = [], limit = 10) {
        return new LimeObjects({ sort, sortOrder, filter, limetype, fetchAll, embed, limit },
            lbs.session,
            lbs.activeServer,
            lbs.activeDatabase)
    }

    /**
     * Creates an instance of a CustomEndpoint data source
     *
     * @static
     * @param {string} relativeUrl - URL to the custom endpoint, relative the base url
     * @param {string} params - optional querystring
     * @returns {CustomEndpoint}
     * @memberof lfx
     */
    static createCustomEndpoint(relativeUrl, params) {
        return new CustomEndpoint({ relativeUrl, params },
            lbs.session,
            lbs.activeServer,
            lbs.activeDatabase)
    }

    /**
     * Creates an instance of a Translations data source
     *
     * @static
     * @param {string} owner
     * @param {string} locale - a language code string, 'en_us'
     * @returns {Translations}
     * @memberof lfx
     */
    static createTranslations(owner, locale) {
        const l = locale || lbs.locale
        return new Translations({ owner, l },
            lbs.session,
            lbs.activeServer,
            lbs.activeDatabase)
    }

    /**
     * Creates a lime-link for desktop
     *
     * @static
     * @param {string} limeTypeName
     * @param {number} limeObjectId
     * @memberof lfx
     * @returns {string}
     */
    static createLimeLink(limeTypeName, limeObjectId) {
        return lbs.common.createLimeLink(limeTypeName, limeObjectId)
    }

    /**
     * Checks if a users is member of any of the supplied groups
     *
     * @static
     * @param {Array<string>} groupsToCheckMembershipOf
     * @param {Array<string>} usersMemberships
     * @memberof lfx
     * @returns {Boolean}
     */
    static userMemberOfGroups(groupsToCheckMembershipOf, usersMemberships) {
        return lbs.common.checkGroup(groupsToCheckMembershipOf, usersMemberships)
    }
}
