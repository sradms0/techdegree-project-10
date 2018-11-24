'use strict';

const {setTableHeaders, setTitle, sliceUrl, setItem} = require('./templatePrep');

module.exports = (req, res) => {
    const subject = sliceUrl(req.baseUrl);
    const type = sliceUrl(req.url);
    const title = setTitle(subject, type);
    const item = setItem(subject);
    const tableHeaders = setTableHeaders(subject);

    return ({subject,type,title,item,tableHeaders});
}

