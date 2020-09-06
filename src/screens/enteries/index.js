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
  StatusBar,
  ScrollView,
  TouchableOpacity,
  BackHandler
} from "react-native";

import styles from "./style";

import axios from "axios";

import SmoothPinCodeInput from "react-native-smooth-pincode-input";

// import { BlurView } from "@react-native-community/blur";
import AsyncStorage from '@react-native-community/async-storage';


const robot = require("../../assets/images/top.png");

const empty = require("../../assets/images/not.png");

const coin = require("../../assets/images/coins.png");

const won = require("../../assets/images/won.png");

const tick = require("../../assets/images/Ticket.png");

const no = require("../../assets/images/no.png");

import Moment from "moment";

var BUTTONS = [
  { text: "All uptakes", icon: "md-done-all", iconColor: "#2c8ef4" },
  { text: "Concluded uptakes", icon: "aperture", iconColor: "#ea943b" },
  { text: "Won uptakes", icon: "analytics", iconColor: "#f42ced" },
];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

import { NavigationEvents } from "react-navigation";

class Enteries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      baseURL: "https://dragonflyapi.nationaluptake.com/",
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
      filter: "All",
      hr: 0,
      showBlur: false,
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
        this.setState({ userData });
      } else {
        const userData = JSON.parse(userProfile);
        this.setState({ userData });
        this.availableUptake();
      }
    } catch (error) {}
  };

  async availableUptake() {
    this.setState({ Spinner: true });
    axios({
      method: "GET",
      url: `${this.state.baseURL}/api/draws/userdraws/${this.state.userData.userid}`,
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

  dateToFromNowDaily( myDate ) {

    // get from-now for this date
    var fromNow = Moment( myDate ).fromNow();

    // ensure the date is displayed with today and yesterday
    return Moment( myDate ).calendar( null, {
        // when the date is closer, specify custom values
        lastWeek: 'YYYY-MM-DD HH:mm:ss',
        lastDay:  '[Yesterday]',
        sameDay:  '[Today]',
        nextDay:  '[Tomorrow]',
        nextWeek: 'dddd',
        // when the date is further away, use from-now functionality             
        sameElse: function () {
            return "[" + fromNow + "]";
        }
    });
}

  async creditBag() {
    axios({
      method: "GET",
      url: `${this.state.baseURL}/api/auth/verifyAccount`,
      params: {
        email: this.state.email,
      },
    })
      .then(
        function (response) {
          if (response.data.accountExist === true) {
            this.props.navigation.navigate("Password", {
              email: this.state.email,
            });
          } else {
            this.props.navigation.navigate("Register", {
              email: this.state.email,
            });
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState({ message: this.state.default_message });
          this.showAlert();
        }.bind(this)
      );
  }

  showAlert() {
    this.setState({
      showAlert: true,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  }

  hideAlert() {
    this.setState({
      showAlert: false,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  }

  async changeFilter() {
    let value;
    if (this.state.clicked.text === "All uptakes") {
      value = "All";
    } else if (this.state.clicked.text === "Concluded uptakes") {
      value = "Drawn";
    } else {
      value = "Won";
    }

    this.setState({
      filter: value,
    });
    await this.availableUptake();
  }

  render() {
    return (
      <Container style={[styles.container, { backgroundColor: "#ffffff" }]}>
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
                style={{ backgroundColor: "#5B9DEE10" }}
              >
                <Text
                  style={{ color: "#273444", fontSize: 12, fontWeight: "bold" }}
                >
                  My Uptakes{" "}
                </Text>
              </Button>

              <Button
                transparent
                small
                rounded
                style={{ backgroundColor: "#EAF3FF0.1" }}
                onPress={() => this.props.navigation.navigate("Win")}
              >
                <Text style={{ color: "#273444", fontSize: 12 }}>
                  Winner Stories{" "}
                </Text>
              </Button>
            </ScrollView>
          </View>
          <View>
            <Button
              small
              transparent
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
                All uptakes
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
                  Uptakes available will appear here
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
                      this.props.navigation.navigate("Udetails2", {
                        image: visits.imageurl,
                        id: visits.drawId,
                        userWonStatus: visits.userWonStatus,
                        drawStatus: visits.drawStatus,
                        claimStatus: visits.claimStatus,
                      })
                    }
                  >
                    <ImageBackground
                      source={{ uri: visits.imageurl }}
                      style={styles.imageMain}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {visits.drawStatus === "Live" ? (
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {visits.drawMode === "Multiple" ? (
                              <View>
                                <Button block rounded style={styles.buttonimg}>
                                  <Text style={styles.textMain4}>
                                    {Moment(visits.drawDate).format(
                                      "hh : mm : ss"
                                    )}{" "}
                                    {"\n"}
                                    <Icon
                                      type="MaterialIcons"
                                      name="layers"
                                      style={{ color: "white", fontSize: 16 }}
                                    ></Icon>
                                    <Text
                                      style={{ fontSize: 16, color: "white" }}
                                    >
                                      Multiple Uptakes
                                    </Text>
                                  </Text>
                                </Button>
                              </View>
                            ) : (
                              <View>
                                <Button block rounded style={styles.buttonimg}>
                                  <Text style={styles.textMain4}>
                                    {Moment(visits.drawDate).format(
                                      "hh : mm : ss"
                                    )}
                                  </Text>
                                </Button>
                              </View>
                            )}
                          </View>
                        ) : (
                          <View>
                            {visits.userWonStatus === "Won" ? (
                              <View>
                                <Image source={won} style={styles.imageLogox} />
                                <Text
                                  style={{
                                    textAlign: "center",
                                    textAlignVertical: "center",
                                    color: "#FFFFFF",
                                    fontSize: 14,
                                  }}
                                >
                                  Congratulations! You won this uptake 🎉 {"\n"}
                                  <Text
                                    style={{
                                      textAlign: "center",
                                      textAlignVertical: "center",
                                      color: "#FFFFFF",
                                      fontSize: 14,
                                    }}
                                  >
                                    {Moment(visits.drawDate).format(
                                      "MMM DD, YYYY"
                                    )}
                                  </Text>
                                </Text>
                              </View>
                            ) : (
                              <View>
                                <Thumbnail
                                  large
                                  source={{
                                    uri: visits.userImageUrl
                                      ? visits.userImageUrl
                                      : `https://ui-avatars.com/api/?format=png&name=${visits.username}`,
                                  }}
                                  style={styles.imageLogoxx}
                                />
                                <Text
                                  style={{
                                    textAlign: "center",
                                    textAlignVertical: "center",
                                    color: "#FFFFFF",
                                    fontSize: 14,
                                  }}
                                >
                                  {visits.username} won this uptake {"\n"}
                                  <Text
                                    style={{
                                      textAlign: "center",
                                      textAlignVertical: "center",
                                      color: "#FFFFFF",
                                      fontSize: 14,
                                    }}
                                  >
                                    {Moment(visits.drawDate).format(
                                      "MMM DD, YYYY"
                                    )}
                                  </Text>
                                </Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </ImageBackground>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text style={styles.textMain}>{visits.name}</Text>

                      <Right>
                        <Text style={styles.textMain2}>
                          {"\u20A6"}
                          {visits.tamount}/entry
                        </Text>
                      </Right>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Right>
                        <View
                          style={{
                            alignSelf: "flex-end",
                            flexDirection: "row",
                            marginBottom: 10,
                            marginRight: 10,
                            marginTop: 10,
                          }}
                        >
                          {visits.drawStatus === "Drawn" ? (
                            visits.userWonStatus === "NotWin" ? (
                              <View></View>
                            ) : visits.claimStatus === "Unclaimed" ? (
                              <Button
                                small
                                block
                                rounded
                                style={styles.bottonEnter}
                                onPress={() =>
                                  this.props.navigation.navigate("Udetails2", {
                                    image: visits.imageurl,
                                    id: visits.drawId,
                                    userWonStatus: visits.userWonStatus,
                                    drawStatus: visits.drawStatus,
                                    claimStatus: visits.claimStatus,
                                  })
                                }
                              >
                                <Text style={styles.textMain3}>
                                  Claim Uptake
                                </Text>
                              </Button>
                            ) : (
                              <Button
                                small
                                block
                                rounded
                                style={styles.bottonEnter}
                                onPress={() =>
                                  this.props.navigation.navigate("Udetails2", {
                                    image: visits.imageurl,
                                    id: visits.drawId,
                                    userWonStatus: visits.userWonStatus,
                                    drawStatus: visits.drawStatus,
                                    claimStatus: visits.claimStatus,
                                  })
                                }
                              >
                                <Text style={styles.textMain3}>
                                  Update claim
                                </Text>
                              </Button>
                            )
                          ) : (
                            <Button
                              small
                              block
                              rounded
                              style={styles.bottonEnter}
                              onPress={() =>
                                this.props.navigation.navigate("Udetails", {
                                  image: visits.imageurl,
                                  id: visits.drawId,
                                })
                              }
                            >
                              <Image
                                source={tick}
                                resizeMode="contain"
                                style={{
                                  width: 12,
                                  marginRight: -10,
                                  marginLeft: 10,
                                }}
                              ></Image>
                              <Text style={styles.textMain3}>
                                Get more enteries
                              </Text>
                            </Button>
                          )}
                        </View>
                      </Right>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </Content>
        {this.state.showBlur === true ? (
          <BlurView
            style={styles.bluring}
            reducedTransparencyFallbackColor="#E5E5E5"
            blurType="dark"
            blurAmount={1}
          />
        ) : (
          <View></View>
        )}

        {/* <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showAlert}
          onRequestClose={() => {}}>
          <View style={{marginTop: 300, backgroundColor:'white'}}>
          <View >
            <Text style={{color: 'black',textAlign: "center", textAlignVertical: "center"}}>{this.state.message}</Text>
            <Button  block rounded style={styles.bottonStyle}  onPress={() => {
                this.hideAlert();
              }}>
            <Text style={{color: 'white', textAlign: 'center',alignSelf: "center",}}>OK</Text>
          </Button>
          </View>
        </View>
      </Modal> */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showAlert}
          onRequestClose={() => {}}
        >
          <View
            style={{
              marginTop: 200,
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 30,
              borderWidth: 10,
              borderColor: "white",
            }}
          >
            <View style={{ alignSelf: "center", backgroundColor: "white" }}>
              <Image
                source={no}
                resizeMode="contain"
                style={styles.imageLogo2}
              ></Image>
              <View style={{ marginTop: 30, alignSelf: "center" }}>
                <Text
                  style={{
                    color: "#273444",
                    textAlign: "center",
                    textAlignVertical: "center",
                    fontSize: 25,
                  }}
                >
                  Something went wrong 😔
                </Text>
                <Text
                  style={{
                    color: "#273444",
                    textAlign: "center",
                    textAlignVertical: "center",
                    marginTop: 20,
                    marginLeft: 10,
                    marginRight: 10,
                    fontSize: 14,
                  }}
                >
                  {this.state.message}
                </Text>
                <Button
                  block
                  rounded
                  style={styles.bottonStylet}
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

export default Enteries;
