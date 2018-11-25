'use strict';

const utils = require('./templatePrep');

module.exports = (req, res, config) => {
    const {setTitle, sliceUrl, setItem} = utils.general;
    const {setTableHeaders} = utils.table;
    const {setFormLabels} = utils.form;

    const subject = sliceUrl(req.baseUrl);
    const type = sliceUrl(req.url);
    const title = setTitle(subject, type);
    const item = setItem(subject);

    const args = {subject,type,title,item};

    if (config === 'table') args.tableHeaders = setTableHeaders(subject);
    if (config === 'form')  args.formLabels   = setFormLabels(subject);

    return args;
}

