'use strict';

/*
 * If any field fails model validation, then the error should be caught,
 * and collectMsgs will be used to collect all error messages associated with
 * current validation error(s).
 *
 * After, the post route will redirect back to its corresponding get route,
 * but with a querystring attached so that any previous fields entered still exist
 * for user.
 *
 * Once at that get route, checkAttrs is attached to an object that is passed to
 * the page render view, which will then assess filling in previous data.
 *
 * The arrays of *Keys are an attempt at so-called-security
 * to disable a user from entering any querystring to have data pre-filled.
 * There is a little more to this, but the *Keys arrays are needed in this
 * exact order, below, for this to work.
 *
 * Refer to get and post routes to see this in action.
*/

const bookKeys  = [
    'title',
    'author',
    'genre',
    'first_published',
    'msgs'
];
const patronKeys  = [
    'first_name',
    'last_name',
    'address',
    'email',
    'library_id',
    'zip_code',
    'msgs'
];
const loanKeys = [
    'book_id',
    'patron_id',
    'loaned_on', 
    'return_by', 
    'msgs'
];
const returnKeys = [
    'returned_on', 
    'msgs'
];

const checkAttrs = (query, check) => {
    let attrs = null;
    let keys = null;

    switch (check) {
      case 'book':
        keys = bookKeys;
        break;
      case 'patron':
        keys = patronKeys;
        break;
      case 'loan':
        keys = loanKeys;
        break;
      case 'return':
        keys = returnKeys;
        break;
      default:
        break
    }

    // check if keys from query match keys 
    const queryKeys = Object.keys(query);
    if (queryKeys.length && queryKeys.join() === keys.join()) {
        attrs = query;
    }
    return attrs;
}

const collectMsgs = (err) => err.errors.reduce((acc, curr) => acc.concat(curr.message),[]);

module.exports.checkAttrs   = checkAttrs;
module.exports.collectMsgs  = collectMsgs;
