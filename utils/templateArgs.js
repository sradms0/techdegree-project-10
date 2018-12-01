'use strict';

const utils = require('./templatePrep');

module.exports = (req, res, config) => {
    const {setTitle, sliceUrl, setItem} = utils.general;

    const subject   = sliceUrl(req.baseUrl);
    const type      = sliceUrl(req.url);
    const title     = setTitle(subject, type);
    const item      = setItem(subject);

    return {subject,type,title,item};
}

