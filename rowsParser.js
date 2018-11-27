'use strict';

module.exports = (data, subject, type) => {
    if (type === 'checked' || type === 'overdue') type = 'all';
    if (typeof data.length === 'number') {
        if (!data.length) return;
    } else data = [data];

    const values = obj => obj.dataValues;
    const join = (first,last) => first.concat(' ', last);
    const parse = {
        // clean up objects returned from queries for passing to pug
        'books': {
            'all':      () => data.map(i => (JSON.parse( JSON.stringify(values(i)).replace('title', 'book').replace('id', 'book_id')) )),
            'details':  () => JSON.parse( JSON.stringify( parse.books.all()[0] ).replace('book_id', 'id').replace('book', 'title') )
        },
        'patrons': {
            'all':      () => data.map(i => {
                                const {id, first_name, last_name, ...patron} = values(i);
                                return Object.assign({'patron_id': id, 'patron': join(first_name,last_name)}, patron);
                        }),
            'details':  () => {
                            const { patron_id, patron, ...rest} = parse.patrons.all()[0];
                            const name = patron.split(' ');
                            return Object.assign({'first_name': name[0], 'last_name': name[1]}, rest);
                }
        },
        'loans': {
            'all':      () => (
                            data.map(i => {
                                const { loaned_on, return_by, returned_on, ...rest } = values(i);
                                const { book: { title },  book_id,  patron: { first_name, last_name }, patron_id  } = rest
                                const action = !returned_on ? 'Return Book' : null;
                                return ( {'book': title, book_id, 'patron': join(first_name,last_name), patron_id, loaned_on, return_by, returned_on, action} );
                            })
                        ),
        }
    }

    return parse[subject][type]();
}
