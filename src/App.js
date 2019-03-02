import React, { Component } from "react";
import SearchBar from "./Components/SearchBar.js";
import { Card } from "antd";
import "./App.css";

//Some consts I use
const { Meta } = Card;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
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
        let link = pic.links[0].href;
        return (
          <Card
            className="Card"
            hoverable
            style={{ width: "16vw", margin: "1vw" }}
            cover={<img alt="example" src={link} />}
          >
            <Meta
              title={pic.data[0].title}
              description={pic.data[0].description}
            />
          </Card>
        );
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
