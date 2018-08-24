exports.menu = [
    {slug: '/sites', title: 'Сайты'},
    {slug: '/oftl-map/todo', title: 'Карта'},
    {slug: '/todo/todos', title: 'Задачи'},
   // {slug: '/archive', title: 'Архив'},
];

exports.oftlMenu = [
    {slug: '/oftl-map/todo',
        title: 'Площадки с задачами'},
    // {slug: '/oftl-map/map',
    //     title: 'Ближайшие площадки с задачами'},
    {slug: '/oftl-map/all',
        title: 'Все площадки'},
    // {slug: '/oftl-map/create-site',
    //  title: 'Создать новый элемент'},

];

exports.todoMenu = [
    {slug: '/todo/todos/groups',
        title: 'Задачи по группам'},
];

exports.sitesMenu = [
    {slug: '/sites',
        title: 'Список сайтов'},
    {slug: '/sites/create-site',
        title: 'Создать новый элемент'},
];

exports.moment = require('moment');

exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=564x150&key=${process.env.GOOGLE_API_KEY}&markers=${lat},${lng}&scale=2`;
