import React, { Component } from "react";
import Welcome from "../components/Welcome/Welcome";
import Chart from "../components/Chart/Chart";

class home extends Component {
  render() {
    return (
      <>
        <Welcome />
        <Chart />
      </>
    );
  }
}

export default home;
