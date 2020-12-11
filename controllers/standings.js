let StandingsModel = require("../models/standings");
let dataJSON = require('../data');

exports.fetchAllStandings = async (req, res) => {
  try {
    let pageSize = +req.query.size || 10;
    let pageNo = +req.query.pageNo || 0;
    let query = { score: -1 }
    if (req.query.team_name)
      query.team_name = +req.query.team_name
    if (req.query.score)
      query.score = +req.query.score
    let noOfDocuments = await StandingsModel.estimatedDocumentCount();
    noOfDocuments += 1;
    let standings = await StandingsModel.find({})
      .sort({ ...query })
      .skip(pageSize * pageNo)
      .limit(pageSize);
    return res.status(200).json({ standings, noOfDocuments });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Some error occured :(" });
  }
};

exports.addTeam = async (req, res) => {
  try {
    let existingTeam = await StandingsModel.findOne({
      team_name: req.body.team_name,
    });
    if (existingTeam) {
      return res.status(400).json({
        message: "Team Name already exists",
      });
    }
    let newTeam = new StandingsModel({
      team_name: req.body.team_name,
      wins: req.body.wins,
      losses: req.body.losses,
      ties: req.body.ties,
      score: req.body.score,
    });
    newTeam = await newTeam.save();
    return res.status(200).json({ message: "Added New Team!!!" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Some error occured :(" });
  }
}

exports.loadData = async (req, res) => {
  try {
    let teams = dataJSON;
    for (let i = 0; i < teams.length; i++) {
      let existingTeam = await StandingsModel.findOne({
        team_name: teams[i].team_name,
      });
      if (existingTeam)
        continue;
      let newTeam = new StandingsModel({ ...teams[i] });
      newTeam = await newTeam.save();
    }
    return res.status(200).json({ message: "Database updated" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Some error occured :(" });
  }
}