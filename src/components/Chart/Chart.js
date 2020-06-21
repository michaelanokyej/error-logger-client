import React, { Component } from "react";
import "./Chart.css";
import { Bar as BarChart } from "react-chartjs-2";
import Spinner from "../Spinner/Spinner";
import config from "../../config";

class chart extends Component {
  state = {
    pollers: [],
  };

  componentDidMount = () => {
    this.fetchPollersWithErrors();
  };

  fetchPollersWithErrors = () => {
    fetch(`${config.API_ENDPOINT}/api/chart`, {
      method: "Get",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.setState({ pollers: res });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const options = {
      legend: {
        display: false,
    },
    scales: {
      xAxes: [{
          barPercentage: 4
      }]
  }
    }
    const chartData = { labels: [], datasets: [] };
    let poller_errors = [];
    this.state.pollers.map((obj) => {
      console.log(obj.poller_errors);
      // const numOfErr = obj.poller_errors
      chartData.labels.push(obj.poller_name);
      poller_errors.push(obj.poller_errors);
      chartData.datasets.push({
        data: poller_errors,
        backgroundColor:
          poller_errors.length < 5
            ? "rgba(228, 198, 7, 1)"
            : "rgba(228, 7, 7, 1)",
        borderWidth: 1
      });
      poller_errors = [...poller_errors];
      poller_errors[poller_errors.length - 1] = 0;
      console.log(poller_errors);
      return chartData;
    });
    let content =
      this.state.pollers.length === 0 ? (
        <Spinner />
      ) : (
        <BarChart data={chartData} options={options} />
      );

    return <div className="chart__div">{content}</div>;
  }
}

export default chart;
