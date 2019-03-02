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
      end: ""
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

  render() {
    let pics = this.state.results.map(pic => {
      if (pic.data[0].media_type === "image") {
        if (this.state.start !== "" && this.state.end !== "") {
          let startFormatted = moment(this.state.start).utc();
          let endFormatted = moment(this.state.end).utc();
          if (startFormatted.isBefore(pic.data[0].date_created)) {
            if (endFormatted.isAfter(pic.data[0].date_created)) {
              return <PicCard pic={pic} />;
            }
          }
        } else {
          return <PicCard pic={pic} />;
        }
      }
    });
    return (
      <div>
        <SearchBar
          giveResults={this.giveResults}
          filterResults={this.filterResults}
        />
        <div className="PicsGrid">{pics}</div>
      </div>
    );
  }
}

export default App;
