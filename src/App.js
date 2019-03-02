import React, { Component } from "react";
import SearchBar from "./Components/SearchBar.js";
import PicCard from "./Components/PicCard.js";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      visibleDetails: false,
      visibleView: false
    };
  }

  giveResults = arr => {
    this.setState({
      results: arr
    });
  };

  render() {
    console.log(this.state.results);
    let pics = this.state.results.map(pic => {
      if (pic.data[0].media_type == "image") {
        //let link = pic.links[0].href;
        return <PicCard pic={pic} />;
      }
    });
    return (
      <div>
        <SearchBar giveResults={this.giveResults} />
        <div className="PicsGrid">{pics}</div>
      </div>
    );
  }
}

export default App;
