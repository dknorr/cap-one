import React, { Component } from "react";
import { Card, Modal, Button, message } from "antd";
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon
} from "react-share";
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

  /**
   * Handles the visibility of the full image modal
   */
  showView = () => {
    this.setState({
      visibleView: true
    });
  };

  /**
   * Handles the visibility of the image details modal
   */
  showDetails = () => {
    this.setState({
      visibleDetails: true
    });
  };

  /**
   * Handles the cancel/close out for both full image and details modal
   */
  handleCancel = e => {
    console.log(e);
    this.setState({
      visibleView: false,
      visibleDetails: false
    });
  };

  /**
   * Handles the remove from favorites functionality. Removes item by id from Firebase
   */
  unFavPic = () => {
    const path = "users/" + this.props.user.uid + "/" + this.props.pic.key;
    console.log(path);
    const picRef = firebase.database().ref(path);
    picRef.remove();
  };

  /**
   * Handles the add to favorites functionality. Checks if image already favorited,
   * closes out modal after adding favorite image to client and database favorites.
   * Uses modal close out to give time for asynchroncities.
   */
  handleFav = e => {
    if (this.props.favBool) {
      this.unFavPic();
      this.handleCancel(e);
      this.props.reshowFavs();
      message.success("Removed from favorites!");
    } else {
      this.setState({
        visibleDetails: false,
        visibleView: false
      });
      let path = "users/" + this.props.user.uid;
      let prevFavs = this.state.favorites;
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
      }
    }
  };

  render() {
    /**
     * Make button variable based on if image is already in favorites or not
     */
    let buttonText = "Add to favorites";
    let link = this.props.pic.links[0].href;
    let logBool = false;
    if (this.props.user === null) {
      logBool = true;
    }
    if (this.props.favBool) {
      buttonText = "Remove from favorites";
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
            <FacebookShareButton
              url={this.props.pic.links[0].href}
              style={{ width: "2vw", position: "absolute" }}
            >
              <FacebookIcon size={"2vw"} round />
            </FacebookShareButton>,
            <TwitterShareButton
              url={this.props.pic.links[0].href}
              style={{
                width: "2vw",
                position: "absolute",
                marginLeft: "2vw"
              }}
            >
              <TwitterIcon size={"2vw"} round />
            </TwitterShareButton>,
            <Button key="fav" onClick={this.handleFav} disabled={logBool}>
              {buttonText}
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
            <FacebookShareButton
              url={this.props.pic.links[0].href}
              style={{ width: "2vw", position: "absolute" }}
            >
              <FacebookIcon size={"2vw"} round />
            </FacebookShareButton>,
            <TwitterShareButton
              url={this.props.pic.links[0].href}
              style={{
                width: "2vw",
                position: "absolute",
                marginLeft: "2vw"
              }}
            >
              <TwitterIcon size={"2vw"} round />
            </TwitterShareButton>,
            <Button key="fav" onClick={this.handleFav} disabled={logBool}>
              {buttonText}
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
