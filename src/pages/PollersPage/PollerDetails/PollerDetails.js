import React, { Component } from "react";
import "./PollerDetails.css";
import PollerErrorContext from "../../../context/poller-error-context";

class pollerDetails extends Component {
  static contextType = PollerErrorContext;

  poller = this.context.pollers.filter(
    (el) => el.id === parseInt(this.props.match.params.id)
  );

  pollerErrors = this.context.errors.filter(
    (pollerError) =>
      pollerError.poller_id === parseInt(this.props.match.params.id)
  );

  render() {
    console.log(this.pollerErrors);
    console.log(this.context.operators)
    // const filteredPollerErrors = { ...pollerErrors}
    const pollerDetails = { ...this.poller[0] };
    console.log(pollerDetails);
    return (
      <div className="poller__details-page">
        <h1>Poller Details Page</h1>
        <div className="poller-description">
          <p>
            <span>Poller Name:</span> {pollerDetails.poller_name}
          </p>
          <p>
            <span>Poller Description:</span> {pollerDetails.description}
          </p>
        </div>
        <div>
          <h4>Reported Errors</h4>
          <ul className="poller__details-page-error-list">
            {
              this.pollerErrors.map((pollerError,i) => {
                const reportedBy = this.context.operators.filter(oper => {
                  return oper.id === parseInt(pollerError.operator)
                })
                const oper = {...reportedBy[0]}
                console.log(reportedBy)
                return(
                  <li key={i} className="reported-error">
                    <p><span>Reported by:</span> {oper.name}  on {new Date(pollerError.posted).toLocaleString()}</p>
                    <p><span>Error decription:</span> {pollerError.error_description}</p>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default pollerDetails;
