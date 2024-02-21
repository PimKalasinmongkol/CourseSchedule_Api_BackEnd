const express = require("express");
const router = express.Router();
const pool = require("../databases/db");

router.get("/getAllCourses", async (request, response) => {
    try {
        const query = await pool.query("SELECT * FROM mykusubjecttable");
        const rows = await query[0];
        response.json(rows);
    } catch (error) {
        console.error(error);
        response.json({
            status: 'error',
            message: error
        })
    }
});

router.post("/importCourse", async (request, response) => {
    const { subject_id, subject_nameEN ,subject_nameTH, credit ,type ,school_year } = request.body;
    try {
        const query = await pool.query("INSERT INTO mykusubjecttable (subject_id ,subject_nameEN ,subject_nameTH, credit, enable ,type , school_year) VALUES (? ,? ,? ,? ,0 ,? ,?)",[subject_id ,subject_nameEN ,subject_nameTH, credit , type ,school_year]);
        const result = await query[0]
        response.json({
            status: 'success',
            data: result
        })
    } catch (error) {
        console.error(error);
        response.json({
            status: 'error',
            message: error
        })
    }
});

router.post("/isEnableCourse", async (request, response) => {
    const {subject_name ,enable} = request.query

    try {
        const query = await pool.query("UPDATE mykusubjecttable SET enable = ? WHERE subject_name = ?",[enable ,subject_name])
        const result = await query[0]
        response.json({
            status: 'success',
            data: result
        })
    } catch (error) {
        console.error(error);
        response.json({status: 'error', message: error});
    }
});

router.post('/editCourse' ,async (request ,response) => {
    const { subject_id ,subject_name, credit ,type ,school_year } = request.body;

    try {
        const query = await pool.query("UPDATE mykusubjecttable SET subject_name = ?, credit = ? ,type = ? ,school_year = ? WHERE subject_id = ?",[subject_id,subject_name,credit ,type,school_year])
        const result = await query[0]
        response.json({
            status: 'success',
            result: result
        })
    } catch (error) {
        console.error(error);
        response.json({status: 'error', message: error});
    }
})

router.get('/deleteCourse/:subject_id', async (request, response) => {
    const {subject_id} = request.params.subject_id;
    try {
        const query = await pool.query("DELETE mykusubjecttable WHERE subject_id = ?",[subject_id])
        const result = await query[0]
        response.json({
            status: 'success',
            result: result
        })
    } catch (error) {
        console.error(error);
        response.json({status: 'error', message: error});
    }
})

module.exports = router;