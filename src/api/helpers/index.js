const HTTP_BAD_REQUEST_STATUS = 400;
const HTTP_CONFLICT_STATUS = 409;
const CREATED_STATUS = 201;
const HTTP_UNAUTHORIZED_FIELDS = 401;
const HTTP_OK_STATUS = 200;

const ENTRIES_ERROR = 'Invalid entries. Try again.';
const CONFLICT_EMAIL_ERROR = 'Email already registered';
const MUST_BE_FILLED = 'All fields must be filled';
const INCORRECT_LOGIN_ERROR = 'Incorrect username or password';
const MALFORMED_TOKEN = 'jwt malformed';
const MISSING_AUTH = 'missing auth token';

const REQUEST_INVALID_ENTRIES = {
    status: HTTP_BAD_REQUEST_STATUS,
    err: { message: ENTRIES_ERROR }
};

const CONFLICT_EMAIL = {
    status: HTTP_CONFLICT_STATUS,
    err: { message: CONFLICT_EMAIL_ERROR }
};

const UNAUTHORIZED_EMPTY_FIELDS = {
    status: HTTP_UNAUTHORIZED_FIELDS,
    err: { message: MUST_BE_FILLED }
};

const INVALID_UNAUTHORIZED_DATA = {
    status: HTTP_UNAUTHORIZED_FIELDS,
    err: { message: INCORRECT_LOGIN_ERROR }
};

const MALFORMED_TOKEN_JWT = {
    status: HTTP_UNAUTHORIZED_FIELDS,
    err: { message: MALFORMED_TOKEN }
};

const MISSING_AUTH_TOKEN = {
    status: HTTP_UNAUTHORIZED_FIELDS,
    err: { message: MISSING_AUTH }
};

module.exports = {
    REQUEST_INVALID_ENTRIES,
    CONFLICT_EMAIL,
    CREATED_STATUS,
    UNAUTHORIZED_EMPTY_FIELDS,
    INVALID_UNAUTHORIZED_DATA,
    HTTP_OK_STATUS,
    MALFORMED_TOKEN_JWT,
    MISSING_AUTH_TOKEN
};