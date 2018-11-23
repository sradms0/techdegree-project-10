'use strict';

module.exports = (data, subject) => {
    console.log(subject);
    const values = obj => Object.values(obj.dataValues);
    const joinName = n => [ values(n)[0]+' '+values(n)[1] ];
    const parse = {
        'books':    () => data.map(i => values(i)),
        'patrons':  () => data.map(i => [...joinName(i), ...values(i).slice(3) ]),
        'loans':    () => (
                            data.map(i => {
                                const dataValues = values(i);
                                // slice and get values of books, patrons, and move loans to end
                                const book = values(dataValues.slice(3,4)[0])[0];
                                const patron = joinName(dataValues.slice(4)[0])[0];
                                const loan = dataValues.slice(0,3);

                                return [book, patron, ...loan];
                            })

                    )
    }
    return parse[subject]();
}
