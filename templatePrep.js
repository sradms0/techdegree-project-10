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
                            {text: 'Title',             required: true},
                            {text: 'Author',            required: true},
                            {text: 'Genre',             required: true},
                            {text: 'First Published',   required: false}
                        ];
                        break;
                    case 'patrons':
                        formLabels = [
                            {text: 'First Name',    required: true},
                            {text: 'Last Name',     required: true},
                            {text: 'Address',       required: true},
                            {text: 'Email',         required: true},
                            {text: 'Library ID',    required: true},
                            {text: 'Zip Code',      required: true}
                        ];
                        break;
                    case 'loans':
                        formLabels = [
                            {text: 'Book'},
                            {text: 'Patron'},
                            {text: 'Loaned on:'},
                            {text: 'Return by:'}
                        ];
                        break;
                    default:
                        break;
                }
                // set all for and id attrs to lowered text and _ for space
                return formLabels.map(i =>  {
                    i.forID = i.text.toLowerCase().replace(' ', '_')
                    return i;
                });
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
