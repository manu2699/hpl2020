const express = require("express");
const router = express.Router();
const Standings = require("../controllers/standings");

router.get("/", Standings.fetchAllStandings);
router.post("/new/team", Standings.addTeam);
router.get("/load", Standings.loadData);

module.exports = router;
