import React, { Component } from "react";
import { Card, Modal, Button, message } from "antd";
import firebase from "../firebase.js";

const { Meta } = Card;

export default class PicCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleView: false,
      visibleDetails: false,
      favorites: []
    };
  }

  showView = () => {
    this.setState({
      visibleView: true
    });
  };

  showDetails = () => {
    this.setState({
      visibleDetails: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visibleView: false,
      visibleDetails: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visibleView: false,
      visibleDetails: false
    });
  };

  handleFav = e => {
    this.setState({
      visibleDetails: false,
      visibleView: false
    });
    console.log(e);
    let path = "users/" + this.props.user.uid;
    let prevFavs = this.state.favorites;
    console.log(prevFavs);
    let usersRef = firebase.database().ref(path);
    if (prevFavs.length > 0) {
      if (!prevFavs.includes(this.props.pic.data[0].nasa_id)) {
        prevFavs.push(this.props.pic.data[0].nasa_id);
        usersRef.push(this.props.pic);
        message.success("Added to favorites!");
      } else {
        message.warning("This image is already in your favorites!");
      }
    } else {
      usersRef.push(this.props.pic);
      prevFavs.push(this.props.pic.data[0].nasa_id);
      message.success("Added to favorites!");
      this.setState({
        buttonLoad: false
      });
    }
  };

  componentDidMount() {
    if (this.props.user !== null) {
      let prevFavs = [];
      let path = "users/" + this.props.user.uid;
      let usersRef = firebase.database().ref(path);
      usersRef.on("value", snapshot => {
        let favs = snapshot.val();
        console.log(favs);
        for (let pic in favs) {
          prevFavs.push(pic);
        }
      });
      console.log(prevFavs);
      this.setState({
        favorites: prevFavs
      });
    }
  }

  render() {
    let link = this.props.pic.links[0].href;
    let logBool = false;
    if (this.props.user === null) {
      logBool = true;
    }
    let date = this.props.pic.data[0].date_created.substring(0, 10);
    let secondCreator = this.props.pic.data[0].secondary_creator;
    if (secondCreator == null) {
      secondCreator = "N/A";
    }
    return (
      <div>
        <Card
          className="Card"
          hoverable
          style={{ width: "16vw", margin: "1vw" }}
          cover={<img alt="example" src={link} className="Thumbnail" />}
        >
          <Meta title={this.props.pic.data[0].title} />
          <Button
            className="ButtonLeft"
            type="primary"
            style={{ width: "6vw" }}
            onClick={this.showView}
          >
            View
          </Button>
          <Button
            className="ButtonRight"
            type="secondary"
            style={{ width: "6vw" }}
            onClick={this.showDetails}
          >
            Details
          </Button>
        </Card>
        <Modal
          width="40vw"
          title={this.props.pic.data[0].title}
          visible={this.state.visibleView}
          onCancel={this.handleCancel}
          footer={[
            <Button key="fav" onClick={this.handleFav} disabled={logBool}>
              Add to favorites
            </Button>,
            <Button key="close" onClick={this.handleCancel}>
              Close
            </Button>
          ]}
        >
          <img className="Big" alt="Result here" src={link} />
        </Modal>
        <Modal
          title={this.props.pic.data[0].title}
          visible={this.state.visibleDetails}
          onCancel={this.handleCancel}
          footer={[
            <Button key="fav" onClick={this.handleFav} disabled={logBool}>
              Add to favorites
            </Button>,
            <Button key="close" type="primary" onClick={this.handleCancel}>
              Close
            </Button>
          ]}
        >
          <p>
            <strong>Full description: </strong>
            {this.props.pic.data[0].description}
          </p>
          <br />
          <p>
            <strong>Secondary creator:</strong> {secondCreator}
            <br />
            <strong>Date created: </strong>
            {date}
          </p>
        </Modal>
      </div>
    );
  }
}
