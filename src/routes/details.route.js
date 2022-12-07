import express from 'express';

const router = express.Router();

router.get('/', function (req, res) {
    res.render('vwDetails/details');
})

export default router;