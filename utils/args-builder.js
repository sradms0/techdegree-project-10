'use strict';

// for effectively retrieving the subject&type 
//  from the url: eliminate '/'
const sliceUrl = url => url.slice(1);
// for create button 
const setItem = subject => subject[0].toUpperCase()+subject.slice(1,-1);

module.exports = req => {
    const subject   = sliceUrl(req.baseUrl);
    const type      = sliceUrl(req.url);
    const item      = setItem(subject);

    return {subject,type,item};
}

