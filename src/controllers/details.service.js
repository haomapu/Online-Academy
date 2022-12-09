const a = [
    { ID: 0, Title: 'Web development', Lecturers:['Huy Hoang', 'Duc Hai', 'Gia Hai', 'Gia Bao']},
    { ID: 1, Title: 'Java Application', Lecturers:['Anh Hao', 'Huy Hoang', 'Duc Hai', 'Gia Hai', 'Gia Bao']},
    { ID: 2, Title: 'Backend', Lecturers:['Anh Hao', 'Gia Hai', 'Gia Bao']},
    { ID: 3, Title: 'ReactJS', Lecturers:['Gia Bao']},
    { ID: 4, Title: 'Frontend', Lecturers:['Anh Hao', 'Huy Hoang']},
    ];

export default {
    findAll() {
        return a;
    }
}

