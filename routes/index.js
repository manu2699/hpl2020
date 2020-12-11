const express = require("express");
const router = express.Router();
const ContestsRoutes = require("./contests");
const StandingsRoutes = require("./standings");

router.use("/contests", ContestsRoutes);
router.use("/standings", StandingsRoutes);

module.exports = router;