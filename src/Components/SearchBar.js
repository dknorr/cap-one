import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { Input, DatePicker, Select, Button } from "antd";
import "antd/dist/antd.css";

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      term: ""
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

  //for range picker
  onChange = (dates, dateStrings) => {
    console.log(dates);
    this.props.filterResults(dateStrings[0], dateStrings[1]);
  };

  //for location menu
  handleChange = loc => {
    this.props.filterLocations(loc);
  };

  render() {
    let locs = this.props.locations.map((loc, i) => {
      return (
        <Option value={loc} key={i}>
          {loc}
        </Option>
      );
    });
    return (
      <div className="SearchBar">
        <Search
          placeholder="Input search terms"
          enterButton="Search"
          size="large"
          onSearch={value => this.doSearch(value)}
        />
        <div className="Filters">
          <RangePicker
            ranges={{
              Today: [moment(), moment()],
              "This Month": [moment().startOf("month"), moment().endOf("month")]
            }}
            format="YYYY-MM-DD"
            onChange={this.onChange}
          />
          <Select
            showSearch
            style={{ width: "15vw" }}
            placeholder="Select a location"
            optionFilterProp="children"
            onChange={this.handleChange}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {locs}
          </Select>
        </div>
      </div>
    );
  }
}
