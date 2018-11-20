'use strict';

module.exports = {
    // for effectively retrieving the subject&type 
    //  from the url: eliminate '/'
    sliceUrl: url => url.slice(1),

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
    },

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

        title += subject[0].toUpperCase()+subject.slice(1);
        // if creating a new item, slice off 's' in title
        if (type === 'new') title = title.slice(0, -1);
        return title;
    }
};
