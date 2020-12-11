import React, { Component } from 'react';
import axios from "axios";
import { BiTrophy } from "react-icons/bi";
import { FaTrophy } from "react-icons/fa";
class AddTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team_name: "",
      wins: 0,
      losses: 0,
      ties: 0,
      score: 0,
      isLoading: false,
    }
  }

  addTeam = async e => {
    e.preventDefault();
    await this.setState({ isLoading: true, score: (this.state.wins * 3) + this.state.ties })
    try {
      let res = await axios.post(`/api/standings/new/team`, { ...this.state })
      alert(res.data.message);
      this.props.history.goBack();
    } catch (err) {
      this.setState({ isLoading: false })
      alert(err.response.data.message)
    }
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
                <form onSubmit={this.addTeam}>
                  <h2>Create new Team</h2>

                  <span>Team Name* : </span>
                  <input type="text" placeholder="Name" onChange={e =>
                    this.setState({ team_name: e.target.value })} required />

                  <span>Contests Won* : </span>
                  <input type="number" min={0} placeholder="No of Wins" onChange={e =>
                    this.setState({ wins: +e.target.value })} required />

                  <span>Contests Tied* : </span>
                  <input type="number" min={0} placeholder="No of Ties" onChange={e =>
                    this.setState({ ties: +e.target.value })} required />

                  <span>Contests Lost* : </span>
                  <input type="number" min={0} placeholder="No of Losses" onChange={e =>
                    this.setState({ losses: +e.target.value })} required />

                  <span>Score : </span>
                  <input type="number" value={(this.state.wins * 3) + this.state.ties} disabled />

                  <center>
                    <input type="submit" value="Add Team" />
                  </center>
                </form>
              </center>
            </>
          )}
      </div>
    );
  }

}

export default AddTeam;
