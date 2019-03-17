import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { Input, DatePicker, Select, Button, message } from "antd";
import "antd/dist/antd.css";

const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      term: "",
      loc: ""
    };
  }

  /**
   * Function for performing NASA API GET Requests
   * @param {string} value - keyword to be used as query parameter
   */
  doSearch = value => {
    this.props.changeParent("selectedLoc", "");
    this.props.changeParent("start", "");
    this.props.changeParent("end", "");
    this.setState({ loc: "" });
    let term = value;
    axios
      .get("https://images-api.nasa.gov/search?q=" + term)
      .then(response => {
        this.setState({
          results: response.data.collection.items
        });
        this.props.changeParent("results", this.state.results);
        this.props.changeParent("locations", []);
        this.props.changeParent("viewingFavs", false);
        if (this.state.results.length < 1) {
          message.warning("No results found.");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  /**
   * Function for parsing selcted dates in filter
   * @param {string[]} dates - value from range picker using moment.js
   * @param {string[]} dateStrings - selected moments from rangepicker
   */
  onChange = (dates, dateStrings) => {
    console.log(dates);
    this.props.changeParent("start", dateStrings[0]);
    this.props.changeParent("end", dateStrings[1]);
  };

  /**
   * Function for handling selected location
   * @param {string} loc - location selected from dropdown
   */
  handleChange = loc => {
    this.props.changeParent("selectedLoc", loc);
    this.setState({ loc: loc });
  };

  /**
   * Function for removing applied filters
   */
  resetFilters = () => {
    this.setState({ loc: "" });
    this.props.changeParent("start", "");
    this.props.changeParent("end", "");
    this.props.changeParent("selectedLoc", "");
  };

  render() {
    /**
     * Populate dropdown menu based on location list from props
     */
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
          placeholder="NASA image search"
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
            placeholder=""
            onChange={this.onChange}
          />
          <Select
            showSearch
            style={{ width: "15vw", marginLeft: "2vw" }}
            optionFilterProp="children"
            onChange={this.handleChange}
            value={this.state.loc}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {locs}
          </Select>
          <Button style={{ marginLeft: "2vw" }} onClick={this.resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>
    );
  }
}
