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

router.get('/getCourse/:id', async (request, response) => {
  const id = request.params.id;
  try {
    const query = await pool.query("SELECT * FROM mykusubjecttable WHERE subject_id = ?", [id])
    const rows = await query[0]
    response.json(rows);
  } catch (error) {
    console.error(error);
    response.json({
      status: 'error',
      message: error
    })
  }
})

router.get('/getCoursesformsum/:id', async (request, response) => {
  const id = request.params.id;
  try {
    const query = await pool.query("SELECT * FROM mykusumtable WHERE id = ?", [id])
    const rows = await query[0]
    response.json(rows);
  } catch (error) {
    console.error(error);
    response.json({
      status: 'error',
      message: error
    })
  }
})

router.post("/editCourse", async (request, response) => {
  const { subject_id, start_time, end_time, Day, room_number, section, student_count } = request.body;

  console.log('editCourse running');

  try {
    const query = await pool.query(
      "UPDATE mykusumtable SET start_time = ?, end_time = ?, Day = ?, room_number = ?, section = ?, student_count=? WHERE id = ?",
      [start_time, end_time, Day, room_number, section, student_count, subject_id]
    );

    // Handle success scenario
    if (query.affectedRows === 1) {
      console.log(`Course with subject_id: ${subject_id} successfully updated`);
      response.json({
        status: "success",
        message: "Course details updated successfully",
      });
    } else {
      console.warn(`No course found with subject_id: ${subject_id}`);
      response.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

  } catch (error) {
    console.error("Error updating course:", error);
    response.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
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


// check course collision 
const scheduleCourseCollisions = async(subject_id ,start_time ,end_time ,date) => {
  try {
      const all_course = await pool.query('SELECT * FROM mykusumtable')
      const data = await all_course[0][0]
      const collisionFound = data.some(item => {
          if (item.date === date) {
              if ((start_time >= item.start_time && end_time <= item.end_time) ||
                  (start_time <= item.start_time && end_time >= item.start_time)) {
                  return true; // Collision found
              }
          }
          return false; // No collision
      });
      return collisionFound;
  } catch (error) {
      console.error(`Database query error: ${error}`);
  }
}


// booking Course
router.post('/BookingCourseToMain/:subject_id', async (request, response) => {
  const {
    subject_id,
    subject_nameEN,
    subject_nameTH,
    start_time,
    end_time,
    Day,
    section,
    major_year,
    student_count,
    credit,
    type,
    enable,
    school_year,
    room_number,
    room_seat,
    lecturer,
    group
  } = request.body

  try {
    const query = await pool.query('INSERT INTO `mykusumtable`(`subject_id`, `subject_nameEN`, `subject_nameTH`, `start_time`, `end_time`, `Day`, `section`, `major_year`, `student_count`, `credit`, `type`, `enable`, `school_year`, `room_number`, `room_seat`, `lecturer`, `group`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
      subject_id,
      subject_nameEN,
      subject_nameTH,
      start_time,
      end_time,
      Day,
      section,
      major_year,
      student_count,
      credit,
      type,
      enable,
      school_year,
      room_number,
      room_seat,
      lecturer,
      group
    ])
    const result = await query[0]
    if (scheduleCourseCollisions(subject_id, start_time, end_time, date)) {
      response.json({
        status: 'Booking course successfully',
        data: result,
        isCollision: true
      })
    } else {
      response.json({
        status: 'Booking course successfully',
        data: result,
        isCollision: false
      })
    }
  } catch (error) {
    console.error(error);
    response.json({
      status: `Database query error: ${error}`,
    })
  }
})

module.exports = router;
