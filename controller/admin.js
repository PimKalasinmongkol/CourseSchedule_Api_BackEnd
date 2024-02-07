const express = require('express')
const router = express.Router()
const pool = require('../databases/db')

router.post('/createAnnouncement', async(request ,response) => {
    const {announce_text} = request.body
    
    try {
        const query = await pool.query("INSERT INTO mykuannouncementtable (announce_text) VALUES (?)" ,[announce_text])
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
    try {
        const query = await pool.query("SELECT * FROM mykuannouncementtable")
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

router.post('/addUser',async (request ,response) => {
    const {fullName ,email ,isAdmin} = request.body
    const [name ,lastname] = fullName.split(" ")
    try {
        const query = await pool.query("INSERT INTO mykuusertable (name ,lastname ,email ,isadmin) VALUES (? ,? ,? ,?)",[name ,lastname ,email ,isAdmin])
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

router.get('/deleteUser/:id', async(request ,response) => {
    const id = request.params.id
    try {
        const query = await pool.query("DELETE FROM mykuusertable WHERE id = ?",[id])
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