import React, { Component } from "react";
import axios from "axios";
import {
  FaAngleDown,
  FaAngleUp,
  FaAngleRight,
  FaAngleLeft,
  FaList,
  FaTrophy
} from "react-icons/fa";
import { BiMedal, BiShield, BiTrophy } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      selectedTeams: [],
      team_name: undefined,
      score: true,
      pageNo: 0,
      showOverlay: false,
      wonBy: null,
      isTied: false,
      pageSize: 10
    }
  }

  getTeams = async () => {
    let url = `/api/standings/?size=${this.state.pageSize}&pageNo=${this.state.pageNo}&score=${this.state.score ? -1 : 1}`
    if (this.state.team_name !== undefined) {
      url = `/api/standings/?size=${this.state.pageSize}&pageNo=${this.state.pageNo}&score=${this.state.score ? -1 : 1}&team_name=${this.state.team_name ? 1 : -1}`
    }
    let res = await axios.get(url)
    await this.setState({ ...this.state, data: res.data.standings, isLoading: false, limit: res.data.noOfDocuments, showOverlay: false })
  }

  componentDidMount = async () => {
    await this.getTeams()
  }

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevState.pageNo !== this.state.pageNo) {
      await this.getTeams();
    }
    if (prevState.team_name !== this.state.team_name ||
      prevState.score !== this.state.score) {
      await this.getTeams();
    }
  }

  assignResult = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true })
    let dataToSend = {
      team1: this.state.selectedTeams[0]._id,
      team2: this.state.selectedTeams[1]._id,
      wonBy: this.state.wonBy,
      isTied: this.state.isTied
    }
    try {
      let res = await axios.post(`/api/contests/add`, dataToSend)
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message)
    }
    this.setState({ isTied: false })
    await this.getTeams();
    await this.resetSelection();
  }


  modifySelected = async (isSelected, Team) => {
    let temp = this.state.selectedTeams;
    if (isSelected) {
      if (temp.length < 2)
        temp.push(Team)
    } else {
      let index = temp.findIndex(team => Team === team);
      temp.splice(index, 1)
    }
    await this.setState({ ...this.state, selectedTeams: temp })
    console.log(this.state.selectedTeams)
  }

  checkSelection = (Team) => {
    let selectedTeams = this.state.selectedTeams;
    if (selectedTeams.length === 0)
      return false;
    let alreadyPresent = selectedTeams.findIndex(team => Team._id === team._id);
    if (selectedTeams.length >= 2 && alreadyPresent === -1)
      return true;
    if (selectedTeams.length <= 2 && alreadyPresent !== -1)
      return false;
  }

  isCheckedTeam = (Team) => {
    let selectedTeams = this.state.selectedTeams;
    if (selectedTeams.length === 0)
      return false;
    let alreadyPresent = selectedTeams.findIndex(team => Team._id === team._id);
    if (alreadyPresent !== -1)
      return true;
    return false;
  }

  resetSelection = () => {
    this.setState({ ...this.state, selectedTeams: [] })
  }

  modifySort = (key) => {
    this.setState({
      ...this.state,
      [key]: !this.state[key]
    })
  }

  renderButton(param) {
    switch (param) {
      case 0:
        return (<button className="primaryButton" disabled>
          To Assign Result <br /> Choose Any 2 Teams
        </button>)
      case 1:
        return (<button className="primaryButton" disabled>
          To Assign Result  <br /> Choose Another Team
        </button>)
      case 2:
        return (<button className="primaryButton" onClick={() => this.setState({ ...this.state, showOverlay: true })}>
          Assign Result <br /> {this.state.selectedTeams[0].team_name} vs {this.state.selectedTeams[1].team_name}
        </button>)
      default:
        return 'foo';
    }
  }

  renderBadge(param) {
    let position = this.state.pageNo * 10 + param;
    if (this.state.score) {
      switch (position) {
        case 1:
          return (<BiTrophy size="1.4em" />)
        case 2:
          return (<BiShield size="1.4em" />)
        case 3:
          return (<BiMedal size="1.4em" />)
        default:
          return `${this.state.pageNo * 10 + param}`;
      }
    }
    return position
  }

  render() {
    return (
      <div style={{ width: "100vw", overflow: "hidden" }}>
        {this.state.isLoading ? (
          <div className="centerPage">
            <h2>Loading...</h2>
          </div>
        ) : (
            <>
              <BiTrophy className="bottomLeft" />
              <FaTrophy className="topRight" />
              <div className="headBar">
                <button className="primaryButton centerAlign" onClick={() => { this.props.history.push('/matches') }}>
                  {`< Hacker Premier Leauge `}
                  <BiTrophy style={{ padding: "0px 5px" }} />
                  {` /> `}
                </button>
                <div className="rowWrap">
                  <button className="secButton" onClick={() => { this.props.history.push('/add/team') }}>
                    Add Team
                  </button>
                  {this.renderButton(this.state.selectedTeams.length)}
                </div>
              </div>
              <center>
                {/* <input type="text" style={{ width: "70vw" }} placeholder="Search By Team Name" /> */}
                <div className="tableWrapper" >
                  <table>
                    <thead>
                      <tr>
                        <th><input type="checkbox" disabled /></th>
                        <th>Pos.</th>
                        <th>
                          Team Name
                          {this.state.team_name !== undefined ?
                            <>
                              {this.state.team_name ?
                                <FaAngleDown className="optionsIcon" onClick={() => { this.modifySort("team_name") }} />
                                :
                                <FaAngleUp className="optionsIcon" onClick={() => { this.modifySort("team_name") }} />
                              }
                            </>
                            :
                            <FaList className="optionsIcon" size={"0.9em"} onClick={() => { this.setState({ team_name: true }) }} />
                          }
                        </th>
                        <th>No of Contests</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Ties</th>
                        <th>Score
                          {this.state.score ?
                            <FaAngleDown className="optionsIcon" onClick={() => { this.modifySort("score") }} />
                            :
                            <FaAngleUp className="optionsIcon" onClick={() => { this.modifySort("score") }} />
                          }
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data.map((team, index) => {
                        // console.log(this.checkSelection(team))
                        return (
                          <tr key={index} onClick={() => { }}>
                            <td><input type="checkbox" disabled={this.checkSelection(team)} onChange={(e) => { this.modifySelected(e.target.checked, team) }} checked={this.isCheckedTeam(team)} /></td>
                            <td>{this.renderBadge(index + 1)}</td>
                            <td><a href={`/matches/${team._id}`}>{team.team_name}</a></td>
                            <td>{team.wins + team.losses + team.ties}</td>
                            <td>{team.wins}</td>
                            <td>{team.losses}</td>
                            <td>{team.ties}</td>
                            <td>{team.score}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="footerOptions">
                  <button className="centerAlign secButton" disabled={(this.state.pageNo === 0) ? true : false} onClick={() => { this.setState({ ...this.state, isLoading: true, pageNo: this.state.pageNo - 1 }) }}>
                    <FaAngleLeft />
                    Prev
                  </button>
                  <button className="centerAlign primaryButton" disabled={Math.abs((this.state.pageNo * this.state.pageSize) - this.state.limit) > 10 ? false : true} onClick={() => { this.setState({ ...this.state, isLoading: true, pageNo: this.state.pageNo + 1 }) }}>
                    Next
                    <FaAngleRight />
                  </button>
                </div>
              </center>
              {this.state.showOverlay ? (
                <div className="overlay">

                  <div className="content">
                    <h2>{this.state.selectedTeams[0].team_name} vs {this.state.selectedTeams[1].team_name}</h2>
                    <form onSubmit={this.assignResult} style={{ width: "max-content" }}>
                      <div>
                        <input type="radio" name="result" required
                          onChange={async e => {
                            if (e.target.checked)
                              this.setState({ wonBy: this.state.selectedTeams[0]._id })
                          }} />
                        <span>Won By {this.state.selectedTeams[0].team_name}</span>
                      </div>
                      <div>
                        <input type="radio" name="result" required
                          onChange={async e => {
                            if (e.target.checked)
                              this.setState({ wonBy: this.state.selectedTeams[1]._id })
                          }} />
                        <span>Won By {this.state.selectedTeams[1].team_name}</span>
                      </div>
                      <div>
                        <input type="radio" name="result" required
                          onChange={async e => {
                            if (e.target.checked)
                              this.setState({ isTied: true, wonBy: null })
                          }} />
                        <span>Contest / Match Tied</span>
                      </div>
                      <center>
                        <input type="submit" value="Submit Result" />
                      </center>
                    </form>
                    <div className="roundButton" onClick={() => this.setState({ ...this.state, showOverlay: false })}>
                      <AiOutlineCloseCircle />
                    </div>
                  </div>
                </div>
              ) : (<></>)}
            </>
          )
        }
      </div>
    );
  }
}

export default Home;