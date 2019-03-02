import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { Input, DatePicker } from "antd";
import "antd/dist/antd.css";

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;

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
      })
      .catch(error => {
        console.log(error);
      });
  };

  onChange = (dates, dateStrings) => {
    console.log(dates);
    this.props.filterResults(dateStrings[0], dateStrings[1]);
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
        <RangePicker
          ranges={{
            Today: [moment(), moment()],
            "This Month": [moment().startOf("month"), moment().endOf("month")]
          }}
          format="YYYY-MM-DD"
          onChange={this.onChange}
        />
      </div>
    );
  }
}
