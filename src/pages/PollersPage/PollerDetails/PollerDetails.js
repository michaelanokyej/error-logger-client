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
    const pollerDetails = { ...this.poller[0] };
    const reportedErrorContent = this.pollerErrors.length === 0 ? (<div> <h4 className="reported_error_content-h4">No Errors Reported for this poller</h4></div>) : (
      <ul className="poller__details-page-error-list">
            {this.pollerErrors.map((pollerError, i) => {
              const reportedBy = this.context.operators.filter((oper) => {
                return oper.id === parseInt(pollerError.operator);
              });
              const oper = { ...reportedBy[0] };
              return (
                <li key={i} className="reported-error">
                  <p>
                    <span>Reported by:</span> {oper.name} on{" "}
                    {new Date(pollerError.posted).toLocaleString()}
                  </p>
                  <p>
                    <span>Error decription:</span>{" "}
                    {pollerError.error_description}
                  </p>
                </li>
              );
            })}
          </ul>
    )
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
          {reportedErrorContent}
          {/* <ul className="poller__details-page-error-list">
            {this.pollerErrors.map((pollerError, i) => {
              const reportedBy = this.context.operators.filter((oper) => {
                return oper.id === parseInt(pollerError.operator);
              });
              const oper = { ...reportedBy[0] };
              return (
                <li key={i} className="reported-error">
                  <p>
                    <span>Reported by:</span> {oper.name} on{" "}
                    {new Date(pollerError.posted).toLocaleString()}
                  </p>
                  <p>
                    <span>Error decription:</span>{" "}
                    {pollerError.error_description}
                  </p>
                </li>
              );
            })}
          </ul> */}
        </div>
      </div>
    );
  }
}

export default pollerDetails;
