import React, { Component } from "react";
import {
  Container,
  Header,
  Left,
  Content,
  Icon,
  Text,
  Item,
  Body,
  Label,
  List,
  H1,
  Input,
  Button,
  Spinner,
  Right,
  Badge,
  CardItem,
  Card,
  Thumbnail,
  ActionSheet,
} from "native-base";
import {
  ImageBackground,
  View,
  Image,
  Modal,
  AsyncStorage,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import styles from "./style";

import axios from "axios";

import SmoothPinCodeInput from "react-native-smooth-pincode-input";

const robot = require("../../assets/images/top.png");

const empty = require("../../assets/images/not.png");

const coin = require("../../assets/images/coins.png");

const won = require("../../assets/images/won.png");

import Moment from "moment";

var BUTTONS = [
  { text: "Last month", icon: "md-done-all", iconColor: "#2c8ef4" },
  { text: "3 months ago", icon: "aperture", iconColor: "#ea943b" },
  { text: "All time", icon: "analytics", iconColor: "#f42ced" },
];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

import { NavigationEvents } from "react-navigation";

class Winner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      baseURL: "http://oftencoftdevapi-test.us-east-2.elasticbeanstalk.com",
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
      code: "123456",
      userData: {},
      credit: 0,
      available: [],
      now: "",
      clicked: 0,
      filter: "all",
      hr: 0,
    };
  }

  componentDidMount() {
    const now = Moment().format("a");
    const hr = Moment().format("h");
    this.setState({ now });
    this.setState({ hr });

    this.getToken();
  }

  getToken = async () => {
    try {
      const userProfile = await AsyncStorage.getItem("userData");
      if (userProfile === null) {
        const userData = {
          firstname: "Guest",
          lastname: "Guest",
        };
        await this.setState({ userData });
        await this.availableUptake();
      } else {
        const userData = JSON.parse(userProfile);
        await this.setState({ userData });
        await this.availableUptake();
      }
    } catch (error) {}
  };

  async availableUptake() {
    this.setState({ Spinner: true });
    axios({
      method: "GET",
      url: `${this.state.baseURL}/api/winnerstories`,
      params: {
        filterby: this.state.filter,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          let available = response.data.data;

          this.setState({ available });
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState({ Spinner: false });
          this.setState({ message: this.state.default_message });
          this.showAlert();
        }.bind(this)
      );
  }

  showAlert() {
    this.setState({
      showAlert: true,
    });
  }

  hideAlert() {
    this.setState({
      showAlert: false,
    });
  }

  async changeFilter() {
    let value;
    if (this.state.clicked.text === "All time") {
      value = "all";
    } else if (this.state.clicked.text === "3 months ago") {
      value = "threemonth";
    } else {
      value = "lastmonth";
    }

    this.setState({
      filter: value,
    });
    await this.availableUptake();
  }

  render() {
    return (
      <Container style={[styles.container, { backgroundColor: "#EDEDEE" }]}>
        {/* <StatusBar  translucent backgroundColor="transparent" barStyle="dark-content"/> */}
        <Content>
          <View
            style={{
              flexDirection: "row",
              marginRight: 10,
              marginLeft: 10,
              marginTop: 30,
            }}
          >
            <View style={{ marginLeft: 10, flex: 1, flexDirection: "row" }}>
              <Text
                style={{
                  color: "#273444",
                  marginLeft: 10,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {this.state.userData.firstname} {"\n"}
                {this.state.now === "pm" ? (
                  this.state.hr >= 4 ? (
                    <Text
                      style={{
                        color: "#273444",
                        marginLeft: 20,
                        fontSize: 14,
                        fontWeight: "normal",
                      }}
                    >
                      Good evening 🌑️
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: "#273444",
                        marginLeft: 20,
                        fontSize: 14,
                        fontWeight: "normal",
                      }}
                    >
                      Good afternoon ☀️
                    </Text>
                  )
                ) : (
                  <Text
                    style={{
                      color: "#273444",
                      marginLeft: 20,
                      fontSize: 14,
                      fontWeight: "normal",
                    }}
                  >
                    Good morning 🌤
                  </Text>
                )}
              </Text>

              <View style={{ flex: 1, marginTop: 20 }}>
                <Button
                  transparent
                  small
                  rounded
                  style={{
                    textAlign: "right",
                    alignSelf: "flex-end",
                    backgroundColor: "#5B9DEE10",
                  }}
                >
                  <Image source={coin} style={{ marginLeft: 7 }} />
                  <Text
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontWeight: "normal",
                    }}
                  >
                    <Text>{"\u20A6"}</Text>
                    0.00
                  </Text>
                </Button>
              </View>
              {this.state.userData.firstname === "Guest" ? (
                <View>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("Welcome")}
                  >
                    <View>
                      <Image source={robot} />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {this.state.userData.pictureUrl === null ? (
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate("Profile")}
                    >
                      <View>
                        <Image source={robot} />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate("Profile")}
                    >
                      <View>
                        <Image
                          source={{ uri: this.state.userData.pictureUrl }}
                        />
                        <Thumbnail
                          medium
                          source={{ uri: `${this.state.userData.pictureUrl}` }}
                          style={{
                            borderWidth: 1,
                            borderColor: "#EF3C3C",
                            marginLeft: 10,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginRight: 10,
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <Button
                transparent
                small
                rounded
                style={{ backgroundColor: "#EAF3FF0.1" }}
                onPress={() => this.props.navigation.navigate("Available")}
              >
                <Text style={{ color: "#273444", fontSize: 12 }}>
                  Available Uptakes
                </Text>
              </Button>

              <Button
                transparent
                small
                rounded
                style={{ backgroundColor: "#EAF3FF0.1" }}
                onPress={() => this.props.navigation.navigate("Enteries")}
              >
                <Text style={{ color: "#273444", fontSize: 12 }}>
                  My Uptakes{" "}
                </Text>
              </Button>

              <Button
                transparent
                small
                rounded
                style={{ backgroundColor: "#5B9DEE10" }}
              >
                <Text
                  style={{ color: "#273444", fontSize: 12, fontWeight: "bold" }}
                >
                  Winner Stories{" "}
                </Text>
              </Button>
            </ScrollView>
          </View>
          <View>
            <Button
              transparent
              small
              rounded
              style={{ backgroundColor: "#5B9DEE10", marginLeft: 20 }}
              onPress={() =>
                ActionSheet.show(
                  {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    destructiveButtonIndex: DESTRUCTIVE_INDEX,
                    title: "Filter options",
                  },
                  (buttonIndex) => {
                    this.setState({ clicked: BUTTONS[buttonIndex] });
                    this.changeFilter();
                  }
                )
              }
            >
              <Text
                style={{ color: "#273444", fontSize: 12, fontWeight: "bold" }}
              >
                All time
              </Text>
              <Icon
                name="ios-arrow-dropdown"
                style={{ color: "black", fontSize: 12, marginLeft: -10 }}
              ></Icon>
            </Button>
          </View>
          {this.state.available.length <= 0 ? (
            <View>
              <Image source={empty} style={styles.imageLogo} />
              <Text style={styles.centerText}>
                {" "}
                Nothing to see here
                {"\n"}
                <Text style={{ fontSize: 12, fontWeight: "normal" }}>
                  Winners are being made, will your story be told?
                </Text>
              </Text>
            </View>
          ) : (
            this.state.available.map((visits, i) => {
              return (
                <View
                  key={i}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    borderWidth: 10,
                    borderColor: "white",
                    width: 390,
                    alignSelf: "center",
                    marginTop: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("Story", {
                        id: visits.id,
                        dimage: visits.imageurl,
                      })
                    }
                  >
                    <ImageBackground
                      source={{ uri: visits.imageUrl }}
                      style={styles.imageMain}
                    ></ImageBackground>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text style={styles.textMain}>{visits.title}</Text>

                      <Right>
                        <Button small rounded style={styles.bottonEnter}>
                          <Text style={styles.textMain3}>See story</Text>
                        </Button>
                      </Right>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </Content>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showAlert}
          onRequestClose={() => {}}
        >
          <View style={{ marginTop: 300, backgroundColor: "white" }}>
            <View>
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                {this.state.message}
              </Text>
              <Button
                block
                rounded
                style={styles.bottonStyle}
                onPress={() => {
                  this.hideAlert();
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  OK
                </Text>
              </Button>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.Spinner}
          onRequestClose={() => {}}
        >
          <View style={{ marginTop: 300 }}>
            <View>
              <Spinner color="#FF6161" />
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

export default Winner;
