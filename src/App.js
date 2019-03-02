import React, { Component } from "react";
import SearchBar from "./Components/SearchBar.js";
import PicCard from "./Components/PicCard.js";
import moment from "moment";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      start: "",
      end: "",
      locations: [],
      selectedLoc: ""
    };
  }

  giveResults = arr => {
    this.setState({
      results: arr
    });
  };

  filterResults = (start, end) => {
    this.setState({
      start: start,
      end: end
    });
  };

  filterLocations = loc => {
    this.setState({
      selectedLoc: loc
    });
  };

  render() {
    let pics = this.state.results.map((pic, i) => {
      if (pic.data[0].media_type === "image") {
        if (
          this.state.start !== "" &&
          this.state.end !== "" &&
          this.state.selectedLoc === ""
        ) {
          this.state.locations.length = 0;
          let startFormatted = moment(this.state.start).utc();
          let endFormatted = moment(this.state.end).utc();
          if (startFormatted.isBefore(pic.data[0].date_created)) {
            if (endFormatted.isAfter(pic.data[0].date_created)) {
              if ("location" in pic.data[0]) {
                if (!this.state.locations.includes(pic.data[0].location)) {
                  this.state.locations.push(pic.data[0].location);
                }
              }
              return <PicCard pic={pic} key={i} />;
            }
          }
        } else if (
          this.state.start !== "" &&
          this.state.end !== "" &&
          this.state.selectedLoc !== ""
        ) {
          let startFormatted = moment(this.state.start).utc();
          let endFormatted = moment(this.state.end).utc();
          if (startFormatted.isBefore(pic.data[0].date_created)) {
            if (endFormatted.isAfter(pic.data[0].date_created)) {
              if ("location" in pic.data[0]) {
                if (this.state.selectedLoc === pic.data[0].location) {
                  return <PicCard pic={pic} key={i} />;
                }
              }
            }
          }
        } else if (
          this.state.start === "" &&
          this.state.end === "" &&
          this.state.selectedLoc !== ""
        ) {
          if ("location" in pic.data[0]) {
            if (this.state.selectedLoc === pic.data[0].location) {
              return <PicCard pic={pic} key={i} />;
            }
          }
        } else {
          if ("location" in pic.data[0]) {
            if (!this.state.locations.includes(pic.data[0].location)) {
              this.state.locations.push(pic.data[0].location);
            }
          }
          return <PicCard pic={pic} key={i} />;
        }
      }
    });
    return (
      <div>
        <SearchBar
          giveResults={this.giveResults}
          filterResults={this.filterResults}
          locations={this.state.locations}
          filterLocations={this.filterLocations}
        />
        <div className="PicsGrid">{pics}</div>
      </div>
    );
  }
}

export default App;
