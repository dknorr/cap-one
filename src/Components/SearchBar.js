import React, { Component } from "react";
import axios from "axios";
import { Input } from "antd";
import "antd/dist/antd.css";

const Search = Input.Search;

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      term: "dog"
    };
  }

  doSearch = value => {
    let term = value;
    axios
      .get("https://images-api.nasa.gov/search?q=" + term)
      .then(response => {
        // pic.data[0].media_type
        this.setState({
          results: response.data.collection.items
        });
        this.props.giveResults(this.state.results);
        console.log("got here!!!");
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="SearchBar">
        <Search
          placeholder="Input search terms"
          enterButton="Search"
          size="large"
          onSearch={value => this.doSearch(value)}
        />
      </div>
    );
  }
}
