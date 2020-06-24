import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/Nav/NavBar";
import Footer from "./components/Footer/Footer";
import config from "./config";
import PollerErrorContext from "./context/poller-error-context";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ErrorsPage from "./pages/ErrorPage/ErrorPage.js";
import PollersPage from "./pages/PollersPage/PollersPage.js";
import PollerDetails from "./pages/PollersPage/PollerDetails/PollerDetails";
import Home from "./pages/Home";
import Swal from "sweetalert2";

class App extends Component {
  state = {
    pollers: [],
    operators: [],
    errors: [],
  };

  componentDidMount = () => {
    this.fetchPollers();
    this.fetchOperators();
    this.fetchErrors();
  };

  fetchErrors = () => {
    fetch(`${config.API_ENDPOINT}/api/errors`, {
      method: "Get",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({ errors: res });
      })
      .catch((err) => {
        Swal.fire(`error: ${err}`);
      });
  };

  fetchOperators = () => {
    fetch(`${config.API_ENDPOINT}/api/operators`, {
      method: "Get",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({ operators: res });
      })
      .catch((err) => {
        Swal.fire(`error: ${err}`);
      });
  };

  fetchPollers = () => {
    fetch(`${config.API_ENDPOINT}/api/pollers`, {
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

  render() {
    return (
      <BrowserRouter>
        <>
          <PollerErrorContext.Provider
            value={{
              pollers: this.state.pollers,
              operators: this.state.operators,
              errors: this.state.errors,
            }}
          >
            <NavBar />

            <main className="main-content">
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/errors" component={ErrorsPage} />
                <Route path="/pollers" exact component={PollersPage} />
                <Route path="/pollers/:id" component={PollerDetails} />
              </Switch>
            </main>
            <Footer />
          </PollerErrorContext.Provider>
        </>
      </BrowserRouter>
    );
  }
}

export default App;
