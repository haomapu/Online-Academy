import express from 'express';
import detailService from '../controllers/details.service.js';

const router = express.Router();

router.get('/',async function (req, res) {
    const list = await detailService.findAll();
    res.render('vwDetails/details');
})

router.get('/get/:id',async function (req, res) {
    const id = req.params.id;
    const list = await detailService.findAll();
    res.render('vwDetails/details', {
        detail: list[id],
        empty: list.length === 0
    });
})

router.get('/list', async function(req, res){
    const list = await detailService.findAll();
    res.render('vwDetails/Test', {
        categories: list,
        empty: list.length === 0
    });
})

export default router;