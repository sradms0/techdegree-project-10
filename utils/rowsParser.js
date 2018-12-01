'use strict';

module.exports = (data, subject, type) => {
    if (type === 'checked' || type === 'overdue') type = 'all';
    if (typeof data.length === 'number') {
        if (!data.length) return;
    } else data = [data];

    const values = obj => obj.dataValues;
    const join = (first,last) => first.concat(' ', last);
    const parse = {
        // prepare for templating
        'books': {
            'all':      () => data.map(i => values(i)),
            'details':  () => parse.books.all()[0],
            'return':   () => parse.loans.all()[0]
        },
        'patrons': {
            'all':      () => data.map(i => values(i)),
            'details':  () => parse.patrons.all()[0]
        },
        'loans': {
            'all':      () => (
                            data.map(i => {
                                const { id, loaned_on, return_by, returned_on, ...rest } = values(i);
                                const { book: { title },  book_id,  patron: { first_name, last_name }, patron_id  } = rest
                                const action = !returned_on ? 'Return Book' : null;
                                return ( {id, title, book_id, 'patron': join(first_name,last_name), patron_id, loaned_on, return_by, returned_on, action} );
                            })
                        ),
        }
    }

    return parse[subject][type]();
}
