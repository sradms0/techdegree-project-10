'use strict';

module.exports = (data, subject) => {
    console.log(subject);
    const values = obj => obj.dataValues;
    const join = (first,last) => first.concat(' ', last);
    const parse = {
        // clean up objects returned from queries for passing to pug
        'books':    () => data.map(i => (JSON.parse( JSON.stringify(values(i)).replace('title', 'book')) )),
        'patrons':  () => data.map(i => {
                                const {first_name, last_name, ...patron} = values(i);
                                return Object.assign({'patron': join(first_name,last_name)}, patron);
                            }),
        'loans':    () => (
                            data.map(i => {
                                const { loaned_on, return_by, returned_on, ...rest } = values(i);
                                const { book: { title }, patron: { first_name, last_name } } = rest
                                const action = !returned_on ? 'Return Book' : null;
                                return ( {'book': title, 'patron': join(first_name,last_name), loaned_on, return_by, returned_on, action} );
                            })
                    )
    }
    return parse[subject]();
}
