const perPage = 10;
module.exports.range    = page => ({ offset: (page*perPage) - perPage, limit: perPage });
module.exports.perPage  = perPage;
