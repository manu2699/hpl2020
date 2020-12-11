import React, { Component } from 'react';
import axios from "axios";
import { BiTrophy } from "react-icons/bi";
import { FaTrophy } from "react-icons/fa";
import dateUtil from '../utils/dateUtil';

class Matches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    }
  }

  getMatches = async () => {
    let url = `/api/contests/`
    let res = await axios.get(url)
    await this.setState({ ...this.state, data: res.data, isLoading: false })
    console.log(res.data)
  }

  componentDidMount = async () => {
    await this.getMatches()
  }

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <div className="centerPage">
            <h2>Loading...</h2>
          </div>
        ) : (
            <>
              <BiTrophy className="bottomLeft" />
              <FaTrophy className="topRight" />
              <div className="headBar" style={{ paddingLeft: "10px" }}>
                <button className="primaryButton centerAlign" onClick={() => this.props.history.push("/")}>
                  {`< Hacker Premier Leauge `}
                  <BiTrophy style={{ padding: "0px 5px" }} />
                  {` /> `}
                </button>
              </div>
              <center>
                <div className="ResponsibleRow">
                  {this.state.data && this.state.data.length >= 1 && this.state.data.map(match => (
                    <div className="card">
                      <h3>Match No: {match.contestNo}
                        <br />
                        {dateUtil(match.date)} </h3>
                      <h2><a href={`/matches/${match.team1._id}`}>{match.team1.team_name}</a></h2>
                      <h3>Vs</h3>
                      <h2><a href={`/matches/${match.team2._id}`}>{match.team2.team_name}</a></h2>
                      {match.isTied ? <h3>Match Tied</h3> : <h3>Won By: <a href={`/matches/${match.wonBy._id}`}>{match.wonBy.team_name}</a></h3>}
                    </div>
                  ))}
                  {this.state.data && this.state.data.length === 0 && <h2>League is yet to be Started..</h2>}
                </div>
              </center>
            </>
          )}
      </div>
    );
  }

}

export default Matches;