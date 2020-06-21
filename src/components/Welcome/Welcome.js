import React, { Component } from "react";
import "./Welcome.css";
import Modal from "../Modal/Modal";
import Backdrop from "../Backdrop/Backdrop";
import config from "../../config";
import Swal from "sweetalert2";
import PollerErrorContext from "../../context/poller-error-context";

class welcome extends Component {
  state = {
    loggingError: false,
    isLoading: false,
    addingPoller: false,
    addingOperator: false,
  };

  static contextType = PollerErrorContext;

  isActive = true;

  constructor(props) {
    super(props);
    this.pollerIdElRef = React.createRef();
    this.descriptionElRef = React.createRef();
    this.operatorElRef = React.createRef();
    this.pollerNameElRef = React.createRef();
    this.pollerDescriptionElRef = React.createRef();
    this.operatorNameElRef = React.createRef();
  }

  logErrorHandler = () => {
    this.setState({ loggingError: true });
  };

  addPollerError = () => {
    this.setState({ addingPoller: true });
  };

  addOperator = () => {
    this.setState({ addingOperator: true });
  };

  modalCancelHandler = () => {
    this.setState({ loggingError: false, addingPoller: false, addingOperator: false });
  };

  modalLogErrorHandler = () => {
    console.log("current values in reference:", [
      this.pollerIdElRef.current.value,
      this.descriptionElRef.current.value,
      this.operatorElRef.current.value,
    ]);
    if (
      this.operatorElRef.current.value.length !== 0 &&
      this.descriptionElRef.current.value !== 0
    ) {
      // first trim all white spaces
      // transform to lowercase
      const operator = this.operatorElRef.current.value;
    const error_description = this.descriptionElRef.current.value.trim();
    const poller_id = this.pollerIdElRef.current.value

    const newError = {
      operator,
      error_description,
      poller_id
    }
     fetch(`${config.API_ENDPOINT}/api/errors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newError),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          this.setState({ loggingError: false, addingPoller: false });
          Swal.fire(`${res.error_description} has been added`);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: `Error: ${err}`,
          });
        });
    
    }
    return null;
    
  };

  modalAddPollerHandler = async () => {
    // check if input has a value
    if (
      this.pollerNameElRef.current.value.length !== 0 &&
      this.pollerDescriptionElRef.current.value.length !== 0
    ) {
      // first trim all white spaces
      // transform to lowercase
      const pollerName = this.pollerNameElRef.current.value
        .trim()
        .toLowerCase();
      const description = this.pollerDescriptionElRef.current.value
        .trim()
        .toLowerCase();

      // check if the poller name exists in DB
      // if it does throw error
      // if not push to db and update pollers list
      const newPoller = {
        poller_name: pollerName,
        description,
      };
      const results = await fetch(`${config.API_ENDPOINT}/api/pollers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPoller),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          this.setState({ loggingError: false, addingPoller: false });
          Swal.fire(`${res.poller_name} has been added`);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: `Error: ${err}`,
          });
        });
      return results;
    }
    return null;
  };

  modalAddOperatorHandler = async () => {
    // check if input has a value
    if (
      this.operatorNameElRef.current.value.length !== 0 
    ) {
      // first trim all white spaces
      // transform to lowercase
      const newOper = {
        name: this.operatorNameElRef.current.value
        .trim()
      }


        console.log(this.operatorNameElRef.current.value)

      const results = await fetch(`${config.API_ENDPOINT}/api/operators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOper),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          this.setState({ loggingError: false, addingPoller: false });
          Swal.fire(`${res.name} has been added`);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: `Error: ${err}`,
          });
        });
      return results;
    }
    return null;
  };

  render() {
    const pollers = this.context.pollers;
    const operators = this.context.operators;

    return (
      <>
        {(this.state.loggingError ||
          this.state.addingOperator ||
          this.state.addingPoller) && <Backdrop />}
        {/* {this.state.addingPoller && <Backdrop />} */}
        {this.state.loggingError && (
          <Modal
            title="Log Error"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalLogErrorHandler}
            confirmText="Log"
          >
            <form>
              <div className="form-control">
                <label htmlFor="poller">Poller</label>
                <select ref={this.pollerIdElRef}>
                  {pollers.map((poller, i) => {
                    return (
                      <option key={i} value={poller.id}>
                        {poller.poller_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-control">
                <label htmlFor="operator">Operator</label>

                <select ref={this.operatorElRef}>
                {operators.map((oper, i) => {
                    return (
                      <option key={oper.id} value={oper.id}>
                        {oper.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.state.addingPoller && (
          <Modal
            title="Add Poller"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalAddPollerHandler}
            confirmText="Add"
          >
            <form>
              <div className="form-control">
                <label htmlFor="poller">Poller Name</label>
                <input
                  type="text"
                  id="poller"
                  ref={this.pollerNameElRef}
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="pollerDescription">Description</label>
                <textarea
                  id="pollerDescription"
                  rows="4"
                  ref={this.pollerDescriptionElRef}
                  required
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.state.addingOperator && (
          <Modal
            title="Add Operator"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalAddOperatorHandler}
            confirmText="Add"
          >
            <form>
              <div className="form-control">
                <label htmlFor="operator">Operator Name</label>
                <input
                  type="text"
                  id="operator"
                  ref={this.operatorNameElRef}
                  required
                />
              </div>
            </form>
          </Modal>
        )}
        <div className="welcome__div">
          <h1>Welcome to Error Logger</h1>
          <div className="welcome__div-controls">
            <button onClick={this.addOperator}>Add User</button>
            <button onClick={this.addPollerError}>Add Poller</button>
            <button onClick={this.logErrorHandler}>Log Error</button>
          </div>
        </div>
      </>
    );
  }
}

export default welcome;
