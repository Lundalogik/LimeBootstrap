module.exports.personResponse = {
    person: [1034, 1984],
}
module.exports.bulkConsentDeleteResponse = {
    key: 'bulk_anonymize_request_delete',
    message: 'Deleted anonymize requests',
    not_found: [
        1002,
        1003,
        1100,
        1005,
        5055,
    ],
    success: [
        1023,
        1025,
        1035,
    ],
}
module.exports.bulkConsentDeletePayload = {
    ids: [1023, 5055, 1100, 1002, 1003, 1005, 1005, 1025, 1035, 1025],
}

module.exports.bulkConsentPayload = {
    ids: [1023, 5055, 1100],
    consent_type_id: 1004,
    backreference: 'consent',
}

module.exports.bulkConsentPostResponse = {
    key: 'bulk_anonymized',
    message: 'Anonymized',
    not_found: [
        1002,
        1003,
        1100,
        1005,
        5055,
    ],
    success: [
        1023,
        1025,
        1035,
    ],
}
