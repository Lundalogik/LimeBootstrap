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

    isMemberOfGroup(group) {
        return this.groups.includes(group)
    }

    isMemberInOneOf(groups) {
        return groups.some(v => this.groups.includes(v))
    }
}

