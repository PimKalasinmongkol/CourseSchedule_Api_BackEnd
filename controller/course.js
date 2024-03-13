const express = require("express");
const router = express.Router();
const pool = require("../databases/db");


router.post("/importFromExcel", async (req, res) => {
  try {
    const { subject_id,
        subject_nameEN,
        subject_nameTH,
        credit,
        type,
        school_year } = req.body;

    // Loop through each item in formDataWithYear and insert it into the database
    const enableData = 0;
    await pool.query('INSERT INTO mykusubjecttable (subject_id, subject_nameEN, subject_nameTH, credit, enable, type, school_year) VALUES (?, ?, ?, ?, ?, ?, ?)', [ 
    subject_id,
    subject_nameEN,
    subject_nameTH,
    credit,
    enableData,
    type,
    school_year,
    ]);

    // Send a success response
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error(error);
    // Send an error response if something goes wrong
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getAllCourses", async (request, response) => {
  try {
    const query = await pool.query("SELECT * FROM mykusubjecttable");
    const rows = await query[0];
    response.json(rows);
  } catch (error) {
    console.error(error);
    response.json({
      status: "error",
      message: error,
    });
  }
});

router.post("/importCourse", async (request, response) => {
  const {
    subject_id,
    subject_nameEN,
    subject_nameTH,
    credit,
    type,
    school_year,
  } = request.body;
  try {
    const query = await pool.query(
      "INSERT INTO mykusubjecttable (subject_id ,subject_nameEN ,subject_nameTH, credit, enable ,type , school_year) VALUES (? ,? ,? ,? ,0 ,? ,?)",
      [subject_id, subject_nameEN, subject_nameTH, credit, type, school_year]
    );
    const result = await query[0];
    response.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error(error);
    response.json({
      status: "error",
      message: error,
    });
  }
});


router.post("/isEnableCourse/:id", async(request, response) => {
  const subject_id = request.params.id
  let enable_state = null;

  // check this course is enabled ,if enabled then swap the boolean
  try {
      const query = await pool.query('SELECT * FROM mykusubjecttable WHERE subject_id = ?',[subject_id])
      const result = await query[0]
      let enable_state_result = result.map((row) => {
          return row.enable
      })
      console.log("debug 1:"+enable_state);
      enable_state = enable_state_result == 1 ? 0 : 1
  } catch (error) {
      console.error(`Database query error: ${error}`);
  }

  // update enable state to subject
  try {
      const query = await pool.query("UPDATE mykusubjecttable SET enable = ? WHERE subject_id = ?",[enable_state ,subject_id])
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

router.post("/editCourse", async (request, response) => {
  const { subject_id, subject_name, credit, type, school_year } = request.body;

  try {
    const query = await pool.query(
      "UPDATE mykusubjecttable SET subject_name = ?, credit = ? ,type = ? ,school_year = ? WHERE subject_id = ?",
      [subject_id, subject_name, credit, type, school_year]
    );
    const result = await query[0];
    response.json({
      status: "success",
      result: result,
    });
  } catch (error) {
    console.error(error);
    response.json({ status: "error", message: error });
  }
});

router.get('/deleteCourse/:subject_id', async (request, response) => {
    const subject_id = request.params.subject_id;
    try {
        const query = await pool.query("DELETE FROM mykusubjecttable WHERE subject_id = ?",[parseInt(subject_id)])
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
