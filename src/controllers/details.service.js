const a = [
    { ID: 0, Title: 'Web development', Lecturers:'Huy Hoang', },
    { ID: 1, Title: 'Java Application', Lecturers:'Anh Hao'},
    { ID: 2, Title: 'Backend', Lecturers:'Gia Bao'},
    { ID: 3, Title: 'ReactJS', Lecturers:'Gia Bao'},
    { ID: 4, Title: 'Frontend', Lecturers:'Huy Hoang'},
    ];

const cmt = [
    { ID: 0, CourseID: 0, Person: "Hao Pham",Date: '12/10/2022' ,Content:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"},
    { ID: 1, CourseID: 0, Person: "Ky Anh",Date: '09/10/2022' ,Content:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"},
    { ID: 2, CourseID: 0, Person: "Huy Hoang", Date: '09/10/2022',Content:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"},
    { ID: 3, CourseID: 1, Person: "Minh Tam", Date: '10/10/2022',Content:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"},
    { ID: 4, CourseID: 1, Person: "Duc Hai", Date: '11/10/2022',Content:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"},
    { ID: 5, CourseID: 1, Person: "Gia Bao", Date: '09/10/2022',Content:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"},
    { ID: 6, CourseID: 0, Person: "Gia Hai", Date: '10/10/2022',Content:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"},
    { ID: 7, CourseID: 0, Person: "Viet Bi", Date: '11/10/2022',Content:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}
]

export default {
    findAll() {
        return a;
    },

    getComment(id){
        const list = [];
        for (let i = 0; i < cmt.length; i++)
            if (id == cmt[i].CourseID)
                list.push(cmt[i]);
        return list;
    }
    
}

