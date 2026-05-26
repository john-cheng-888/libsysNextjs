const MENU=[
    {
        key:'book',
        label:'book',
        items:[
            {label:'Management',href:'/backend/books'},
            {label:'Borrow',href:'/backend/borrow'},
            {label:'Return',href:'/backend/return'}
        ]
    },
    {
        key:'setting',
        label:'setting',
        items:[
            {label:'Calendar',href:'/backend/calendar'},
            {label:'Role & Quota',href:'/backend/role-quota'},
            {label:'Categories',href:'/backend/categories'}
        ]
    }
];
export default MENU;
