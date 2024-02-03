const express = require('express')
const router = express.Router()
const pool = require('../databases/db')

router.post('/createAnnouncement', async(request ,response) => {
    const {user_id ,user_name ,user_lastname ,announce_text} = request.body
    
    try {
        const query = await pool.query("INSERT INTO mykuannouncementtable (user_id ,user_name ,user_lastname ,announce_text) VALUES (?, ?, ?, ?)" ,[user_id,user_name,user_lastname ,announce_text])
        const result = await query[0]
        response.json({
            status: 'success',
            data: result
        })
    } catch (error) {
        console.error(error);
        response.json({
            status: 'error',
        })
    }
})

router.get('/getAnnouncement', async(request ,response) => {
    const {user_id} = request.query
    try {
        const query = await pool.query("SELECT * FROM mykuannouncementtable WHERE user_id = ?" ,[user_id])
        const result = await query[0]
        response.json(result)
    } catch (error) {
        console.error(error);
        response.json({
            status: 'error',
        })
    }
})

router.get('/deleteAnnouncement/:announce_id', async(request ,response) => {
    const announce_text = request.params.announce_id
    
    try {
        const query = await pool.query("DELETE FROM mykuannouncementtable WHERE announcement_id = ?" ,[announcement_id])
        const result = await query[0]
        response.json({
            status: 'success',
            result: result
        })
    } catch (error) {
        console.error(error);
        response.json({
            status: 'error',
        })
    }
})

module.exports = router