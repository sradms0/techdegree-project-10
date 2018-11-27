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

        form: {
            setFormLabels: subject => {
                let formLabels = [];
                switch (subject) {
                    case 'books':
                        formLabels = [
                            'Title',
                            'Author',
                            'Genre',
                            'First Published'
                        ];
                        break;
                    case 'patrons':
                        formLabels = [
                            'First Name',
                            'Last Name',
                            'Address',
                            'Email',
                            'Library ID',
                            'Zip Code'
                        ];
                        break;
                    case 'loans':
                        formLabels = [
                            'Book',
                            'Patron',
                            'Loaned on:',
                            'Return by:'
                        ];
                        break;
                    default:
                        break;
                }
                return formLabels.map(i => ({text: i, forID: i.toLowerCase().replace(' ', '_')}));
            }
        },

        table: {
            // set headers for table depending on table type
            setTableHeaders: subject => {
                let tableHeaders = [];
                switch (subject) {
                    case 'books':
                        tableHeaders = [
                            'Title',
                            'Author',
                            'Genre',
                            'Year Released'
                        ];
                        break;
                    case 'patrons':
                        tableHeaders = [
                            'Name',
                            'Address',
                            'Email',
                            'Library ID',
                            'Zip'
                        ];
                        break;
                    case 'loans':
                        tableHeaders = [
                            'Book',
                            'Patron',
                            'Loaned on',
                            'Return by', 	
                            'Returned on', 	
                            'Action'
                        ];
                        break;
                    default:
                        break;
                }
                return tableHeaders;
            }
        }
    });
})();
