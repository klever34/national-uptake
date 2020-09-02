import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Icon,
  Text,
  Card,
  Body,
  CardItem,
  Thumbnail,
  H1,
  Textarea,
  Button,
  Left,
  Title,
  Right,
  Footer,
  FooterTab,
  Badge,
  Fab,
  IconNB,
  Spinner,
} from "native-base";
import {
  ImageBackground,
  View,
  Image,
  Modal,
  AsyncStorage,
  BackHandler,
  StatusBar,
} from "react-native";

import styles from "./style";

import axios from "axios";

import { NavigationEvents } from "react-navigation";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verify: "",
      baseURL: "http://18.197.159.108/api/v1",
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
      active: false,
      visits: [],
      tokenz: "",
      status: "",
      feedback: false,
      feebackMsg: "",
      showPayAlert: false,
      drops: [],
    };
  }

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  showPayAlert = () => {
    this.setState({
      showPayAlert: true,
    });
  };

  hidePayAlert = () => {
    this.setState({
      showPayAlert: false,
    });

    this.props.navigation.navigate("Pay");
  };

  render() {
    return (
      <Container>
        <StatusBar translucent backgroundColor="transparent" />
        <Content padder></Content>
      </Container>
    );
  }
}

export default Homepage;
