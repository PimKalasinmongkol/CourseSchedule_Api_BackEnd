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
      group,
      school_year } = req.body;

    // Loop through each item in formDataWithYear and insert it into the database
    const enableData = 0;
    await pool.query('INSERT INTO mykusubjecttable (subject_id, subject_nameEN, subject_nameTH, credit, enable, type, `group`, school_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      subject_id,
      subject_nameEN,
      subject_nameTH,
      credit,
      enableData,
      type,
      group,
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

router.get("/getAllCoursesformsum", async (request, response) => {
  try {
    const query = await pool.query("SELECT * FROM mykusumtable");
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
    group,
    school_year,
  } = request.body;
  try {
    const query = await pool.query(
      "INSERT INTO mykusubjecttable (subject_id ,subject_nameEN ,subject_nameTH, credit, enable ,type ,`group` ,school_year) VALUES (? ,? ,? ,? ,0 ,? ,? ,?)",
      [subject_id, subject_nameEN, subject_nameTH, credit, type, group, school_year]
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



router.get("/getDistinctYears", async (req, res) => {
  try {
    // Query distinct years from the database and arrange them from least to greatest
    const query = await pool.query("SELECT DISTINCT school_year FROM mykusubjecttable ORDER BY school_year ASC");
    const rows = await query[0];

    // Extract years from the result
    const distinctYears = rows.map((row) => row.school_year);

    // Send the distinct years as response
    res.status(200).json(distinctYears);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Backend code
router.post("/isEnableCourse/:id", async (request, response) => {
  const subject_id = request.params.id;
  const { enable_state } = request.body; // Get enable_state from request body

  try {
    // Update the enable state of the course in the database
    await pool.query("UPDATE mykusubjecttable SET enable = ? WHERE subject_id = ?", [enable_state, subject_id]);
    // Optionally, send a response
    response.json({
      status: 'success',
      message: 'Enable state updated successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ status: 'error', message: error.message });
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
    const query = await pool.query("DELETE FROM mykusubjecttable WHERE subject_id = ?", [parseInt(subject_id)])
    const result = await query[0]
    response.json({
      status: 'success',
      result: result
    })
  } catch (error) {
    console.error(error);
    response.json({ status: 'error', message: error });
  }
})

module.exports = router;
