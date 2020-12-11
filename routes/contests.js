const express = require("express");
const router = express.Router();
const Contests = require("../controllers/contests");

router.get("/", Contests.fetchAllContests);
router.get("/:id", Contests.fetchContestsPerTeam);
router.post("/add", Contests.addContest);

module.exports = router;
