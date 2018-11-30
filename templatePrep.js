'use strict';

module.exports = ( () => {
    return ({
        general: {
            // for effectively retrieving the subject&type 
            //  from the url: eliminate '/'
            sliceUrl: url => url.slice(1),

            // for create button 
            setItem: subject => subject[0].toUpperCase()+subject.slice(1,-1),

            // create title for template header based on type
            setTitle: (subject, type) => {
                let title = '';
                switch (type) {
                    case 'overdue':
                        title = 'Overdue ';
                        break;
                    case 'checked':
                        title = 'Checked Out ';
                        break;
                    case 'new':
                        title = 'New ';
                        break;
                    default:
                        break;
                }
                // change to subject to books for titling
                if (subject === 'loans' && type === 'checked') subject = 'books';

                // give title 'titlecasing'
                title += subject[0].toUpperCase()+subject.slice(1);

                // if creating or viewing an item, make title singular
                if (type === 'new' || type === 'details') title = title.slice(0, -1);
                if (type === 'details') title += ': ';
                return title;
            }
        },
    });
})();
