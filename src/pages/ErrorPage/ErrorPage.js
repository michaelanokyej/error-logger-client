import React from "react";
import PollerErrorContext from "../../context/poller-error-context";
import "./ErrorPage.css";
import { Link } from "react-router-dom";

const errorPage = (props) => {
  return (
    <PollerErrorContext.Consumer>
      {(context) => {
        console.log(context);
        const objectToCsv = (data) => {
          const csvRows = [];

          // get headers
          const headers = Object.keys(data[0]);
          csvRows.push(headers.join(","));

          // loop over rows
          for (const row of data) {
            const values = headers.map((header) => {
              const escaped = row[header].replace(/"/g, '\\"');
              return `"${escaped}"`;
            });
            csvRows.push(values.join(","));
          }
          // form escaped comma separated values
          return csvRows.join("\n");
        };

        const download = (data) => {
          const blob = new Blob([data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.setAttribute("hidden", "");
          a.setAttribute("href", url);
          a.setAttribute("download", "pollerReport.csv");
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };

        const handleCsvDownloadButton = async () => {
          const data = await context.errors.map((row) => {
            const poller = context.pollers.filter(
              (el) => el.id === row.poller_id
            );
            const oper = context.operators.filter(
              (el) => el.id === parseInt(row.operator)
            );
            const loggedOn = new Date(row.posted).toLocaleString("en-US", {
              timeZone: "America/New_York",
            });
            const csvObj = {
              poller: poller[0].poller_name,
              reportedBy: oper[0].name,
              dateLogged: loggedOn,
              description: row.error_description,
            };
            return csvObj;
          });
          console.log("data:", data);
          const csvData = objectToCsv(data);
          download(csvData);
        };
        const pollerErrors = context.errors.map((pollerError, i) => {
          const poller = context.pollers.filter(
            (el) => el.id === pollerError.poller_id
          );
          const oper = context.operators.filter(
            (el) => el.id === parseInt(pollerError.operator)
          );
          const pollerLink = `/pollers/${poller[0].id}`;
          const loggedOn = new Date(pollerError.posted).toLocaleString();
          
          return (
            <li key={i}>
              <div>
                <div className="poller-header">
                  <Link to={pollerLink}>
                    <h2>Poller - {poller[0].poller_name}</h2>
                  </Link>
                </div>
                <div>
                  <div className="error-details">
                    <p className="error-details_title">Logged</p>
                    <p className="error-details-info">{loggedOn}</p>
                  </div>
                  <div className="error-details">
                    <p className="error-details_title">Reported By</p>
                    <p className="error-details-info">{oper[0].name}</p>
                  </div>
                  <div className="err-description">
                    <p className="err-description-title">Description</p>
                    <p>{pollerError.error_description}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        });
        return (
          <div className="error__page">
            <div className="error__page-header">
              <h1 className="error__page-header-title">Latest Poller Errors</h1>
              <button onClick={handleCsvDownloadButton} className="error__page-header-button">
                Get Report
              </button>
            </div>

            <ul className="poller__errors-list">{pollerErrors}</ul>
          </div>
        );
      }}
    </PollerErrorContext.Consumer>
  );
};

export default errorPage;
