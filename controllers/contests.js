let ContestsModel = require("../models/contests");
let StandingsModel = require("../models/standings");

exports.fetchAllContests = async (req, res) => {
  try {
    let pageSize = +req.query.size || 10;
    let pageNo = +req.query.pageNo || 0;
    let contests = await ContestsModel.find({})
      .sort({ date: 1 })
      .skip(pageSize * pageNo)
      .limit(pageSize)
      .populate("team1")
      .populate("team2")
      .populate("wonBy");
    return res.status(200).send(contests);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Some error occured :(" });
  }
};

exports.fetchContestsPerTeam = async (req, res) => {
  try {
    let ContestsByTeam = await ContestsModel.find({
      $or: [{ team1: req.params.id }, { team2: req.params.id }]
    }).sort({ date: 1 })
      .populate("team1")
      .populate("team2")
      .populate("wonBy");
    return res.status(200).send(ContestsByTeam);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Some error occured :(" });
  }
};

exports.addContest = async (req, res) => {
  try {
    console.log(req.body)
    let previousContest = await ContestsModel.find({
      $or: [
        { $and: [{ team1: req.body.team1 }, { team2: req.body.team2 }] },
        { $and: [{ team1: req.body.team2 }, { team2: req.body.team1 }] }
      ]
    });
    if (previousContest.length >= 1) {
      return res.status(400).json({
        message: "Both team have already had their head to heads",
      });
    }

    let noOfDocuments = await ContestsModel.estimatedDocumentCount();
    noOfDocuments += 1;
    let newContest = new ContestsModel({
      team1: req.body.team1,
      team2: req.body.team2,
      wonBy: req.body.wonBy || req.body.team1,
      contestNo: noOfDocuments,
      isTied: req.body.isTied || false
    });
    newContest = await newContest.save();
    if (req.body.isTied) {
      await StandingsModel.findByIdAndUpdate(req.body.team1, { $inc: { score: 1, ties: 1 } });
      await StandingsModel.findByIdAndUpdate(req.body.team2, { $inc: { score: 1, ties: 1 } });
    }
    else if (req.body.wonBy) {
      await StandingsModel.findByIdAndUpdate(req.body.wonBy, { $inc: { score: 3, wins: 1 } });
      if (req.body.team1 === req.body.wonBy)
        await StandingsModel.findByIdAndUpdate(req.body.team2, { $inc: { losses: 1 } });
      else if (req.body.team2 === req.body.wonBy)
        await StandingsModel.findByIdAndUpdate(req.body.team1, { $inc: { losses: 1 } });
    }
    return res.status(200).json({ message: "Added Head to head" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Some error occured :(" });
  }
}