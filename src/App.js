import React, { Component } from "react";
import SearchBar from "./Components/SearchBar.js";
import PicCard from "./Components/PicCard.js";
import firebase, { auth, provider } from "./firebase.js";
import moment from "moment";
import { Button, message } from "antd";
import "antd/dist/antd.css";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      results: [],
      start: "",
      end: "",
      locations: [],
      selectedLoc: "",
      curUser: "",
      favorites: [],
      user: null,
      viewingFavs: false
    };
  }

  /**
   * Generic parent changing function
   * @param {string} field - The name of field being modified
   * @param {value} value - The value for the modified field
   */
  changeParent = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  /**
   * Handle login helper function
   */
  login = () => {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
      message.success("Log in succesful!");
    });
  };

  /**
   * Handle logout helper function
   */
  logout = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null,
        results: []
      });
      message.success("Logout succesful!");
    });
  };

  /**
   * Handle login and logout using helper functions
   */
  inAndOut = () => {
    if (this.state.user === null) {
      this.login();
    } else {
      this.logout();
    }
  };

  /**
   * Handle displaying favorites as results
   */
  showFavs = () => {
    if (this.state.user !== null) {
      let path = "users/" + this.state.user.uid;
      let usersRef = firebase.database().ref(path);
      let favPics = [];
      usersRef.once("value", snapshot => {
        snapshot.forEach(childSnap => {
          let pic = childSnap.val();
          pic.key = childSnap.key;
          favPics.push(pic);
        });
        this.setState({
          results: favPics,
          viewingFavs: true
        });
      });
    } else {
      message.warning("You must be logged in to view favorites.");
    }
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  render() {
    let authButton = "Logout";
    if (this.state.user === null) {
      authButton = "Log In";
    } else {
      authButton = "Logout" + this.state.user;
    }
    /**
     * Map through results and generate <PicCard> for each of them. Checks for applied
     * filters before ultimately providing list of elements to return of render()
     */
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
              return (
                <PicCard
                  pic={pic}
                  key={i}
                  user={this.state.user}
                  favorites={this.state.favorites}
                  favBool={this.state.viewingFavs}
                  reshowFavs={this.showFavs}
                />
              );
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
                  return (
                    <PicCard
                      pic={pic}
                      key={i}
                      user={this.state.user}
                      favorites={this.state.favorites}
                      favBool={this.state.viewingFavs}
                      reshowFavs={this.showFavs}
                    />
                  );
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
              return (
                <PicCard
                  pic={pic}
                  key={i}
                  user={this.state.user}
                  favorites={this.state.favorites}
                  favBool={this.state.viewingFavs}
                  reshowFavs={this.showFavs}
                />
              );
            }
          }
        } else {
          if ("location" in pic.data[0]) {
            if (!this.state.locations.includes(pic.data[0].location)) {
              this.state.locations.push(pic.data[0].location);
            }
          }
          return (
            <PicCard
              pic={pic}
              key={i}
              user={this.state.user}
              favorites={this.state.favorites}
              favBool={this.state.viewingFavs}
              reshowFavs={this.showFavs}
            />
          );
        }
      }
    });
    /**
     * Display for no result cases
     */
    if (pics.length < 1) {
      pics = "No results. Search for another keyword or change filters.";
    }
    if (pics.length < 1 && this.state.viewingFavs == true) {
      pics = "Nothing in favorites right now!";
    }
    return (
      <div>
        <div className="Login">
          <Button
            type="secondary"
            style={{ marginRight: "1vw" }}
            onClick={this.showFavs}
          >
            Favorites
          </Button>
          <Button type="primary" onClick={this.inAndOut}>
            {authButton}
          </Button>
        </div>
        <SearchBar
          locations={this.state.locations}
          changeParent={this.changeParent}
        />
        <div className="PicsGrid">{pics}</div>
      </div>
    );
  }
}

export default App;
