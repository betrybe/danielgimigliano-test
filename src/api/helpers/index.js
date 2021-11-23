const HTTP_BAD_REQUEST_STATUS = 400;
const HTTP_CONFLICT_STATUS = 409;
const CREATED_STATUS = 201;

const ENTRIES_ERROR = 'Invalid entries. Try again.';
const CONFLICT_EMAIL_ERROR = 'Email already registered';

const REQUEST_INVALID_ENTRIES = {
    status: HTTP_BAD_REQUEST_STATUS,
    err: { message: ENTRIES_ERROR },
};

const CONFLICT_EMAIL = {
    status: HTTP_CONFLICT_STATUS,
    err: { message: CONFLICT_EMAIL_ERROR },
};

module.exports = {
    REQUEST_INVALID_ENTRIES,
    CONFLICT_EMAIL,
    CREATED_STATUS
};