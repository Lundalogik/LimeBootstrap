export default class User {
    /**
     * Creates an instance of User.
     * @param {string} name
     * @param {Number} id
     * @param {Boolean} isAdmin
     * @param {Boolean} isSuperUser
     * @param {Array<string>} [groups=[]]
     * @memberof User
     */
    constructor(name, id, isAdmin, isSuperUser, groups = []) {
        this.name = name
        this.id = id
        this.isAdmin = isAdmin
        this.isSuperUser = isSuperUser
        this.groups = groups
    }

    /**
     * Checks if user is member of the supplied group name
     *
     * @param {string} group Name of group
     * @returns {Boolean} Returns true if user is member of group
     * @memberof User
     */
    isMemberOfGroup(group) {
        return this.groups.includes(group)
    }

    /**
     * Checks if users is member of one of the supplied groups
     *
     * @param {Array<string>} groups Array of group names
     * @returns {Boolean} Returns true if user is member of one of the groups
     * @memberof User
     */
    isMemberInOneOf(groups) {
        return groups.some(v => this.groups.includes(v))
    }
}

