import express from 'express';

const router = express.Router();

router.get('/', function (req, res) {
    res.render('vwhomepage/test');
})

export default router;