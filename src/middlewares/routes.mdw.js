import mainRoute from '../routes/main.route.js'
import courseRoute from '../routes/course.route.js'
import settingRoute from '../routes/setting.route.js'

export default function(app){



    app.get('/err', function(req, res){
        throw new Error('Error!!!!');
    })

    app.use('/', mainRoute);
    app.use('/course', courseRoute);
    app.use('/settings', settingRoute);

}