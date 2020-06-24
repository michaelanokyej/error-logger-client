import React, { Component } from "react";
import "./Chart.css";
import { Bar as BarChart } from "react-chartjs-2";
import Spinner from "../Spinner/Spinner";
import config from "../../config";
import Swal from "sweetalert2";

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
        this.setState({ pollers: res });
      })
      .catch((err) => {
        Swal.fire(`error: ${err}`);
      });
  };

  getBorderColor = (num) => {
    if (num < 4) {
      return "rgb(54, 162, 235)";
    } else if (num >= 4 && num <= 10) {
      return "rgb(235, 208, 54)";
    } else {
      return "rgb(255, 99, 132)";
    }
  };

  getBackgroundColor = (num) => {
    if (num < 4) {
      return "rgba(54, 162, 235, 0.2)";
    } else if (num >= 4 && num <= 10) {
      return "rgba(232, 201, 23, 0.2)";
    } else {
      return "rgba(255, 99, 132, 0.2)";
    }
  };

  render() {
    const options = {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        //   xAxes: [{
        //     barPercentage: 2
        // }]
      },
    };
    const chartData = { labels: [], datasets: [] };
    let poller_errors = [];
    this.state.pollers.map((obj) => {
      chartData.labels.push(obj.poller_name);
      poller_errors.push(obj.poller_errors);
      chartData.datasets.push({
        data: poller_errors,
        // backgroundColor:
        //   +obj.poller_errors < 5
        //     ? "rgba(228, 198, 7, 1)"
        //     : "rgba(228, 7, 7, 1)",
        borderColor: this.getBorderColor(obj.poller_errors),
        backgroundColor: this.getBackgroundColor(obj.poller_errors),
        borderWidth: 1,
        categoryPercentage: 1.0,
        barPercentage: 2,
      });
      poller_errors = [...poller_errors];
      poller_errors[poller_errors.length - 1] = 0;
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
