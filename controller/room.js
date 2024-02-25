const express = require("express");
const router = express.Router();
const pool = require("../databases/db");

router.get("/getAllRoom", async (request, response) => {
    try {
        const query = await pool.query("SELECT * FROM mykuroomtable");
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

router.post("/importRoom", async (request, response) => {
    const { room_number, room_seat  } = request.body;
    try {
        const query = await pool.query("INSERT INTO mykuroomtable (room_number ,room_seat  ,room_isFull) VALUES (?, ? ,0)",[room_number ,room_seat]);
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

module.exports = router;