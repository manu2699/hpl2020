import React, { lazy, Suspense } from 'react';
import { Route, BrowserRouter } from "react-router-dom";

const Home = lazy(() => import("./pages/home"));
const AddTeam = lazy(() => import("./pages/addTeam"));
const Matches = lazy(() => import("./pages/matches"));
const MatchesByTeam = lazy(() => import("./pages/team"));

function App() {
  return (
    <Suspense fallback={
      <div className="centerPage">
        <h2>Loading...</h2>
      </div>
    }>
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route exact path="/add/team" component={AddTeam} />
        <Route exact path="/matches" component={Matches} />
        <Route exact path="/matches/:id" component={MatchesByTeam} />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
