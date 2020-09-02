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
  ListItem,
} from "native-base";
import {
  ImageBackground,
  View,
  Image,
  Modal,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from "react-native";

import styles from "./style";

import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';

import SmoothPinCodeInput from "react-native-smooth-pincode-input";

const robot = require("../../assets/images/top.png");

const empty = require("../../assets/images/not.png");

// const coin = require("../../assets/images.png");

const try1 = require("../../assets/images/try1.png");

import Moment from "moment";

import { NavigationEvents } from "react-navigation";
import AntDesign from "react-native-vector-icons/AntDesign";

class History extends Component {
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
      history: [],
      now: "",
    };
  }
  UNSAFE_componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.goBack()
    );
  }

  componentDidMount() {
    const now = Moment().format("a");
    this.setState({ now });

    this.getToken();
  }

  getToken = async () => {
    try {
      this.setState({ Spinner: true });
      const userProfile = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(userProfile);
      await this.setState({ userData });
      await this.historyUptake();

      this.setState({ Spinner: false });
    } catch (error) {}
  };

  async historyUptake() {
    const token = await AsyncStorage.getItem("user_token");

    this.setState({ Spinner: true });
    axios({
      method: "GET",
      url: `${this.state.baseURL}/api/transactions/history/ticket/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          let history = response.data.data;

          this.setState({ history });
        }.bind(this)
      )
      .catch(
        function (error) {
          console.log(error.response);
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

  render() {
    return (
      <Container style={styles.container}>
        <Header
          noShadow
          style={{ backgroundColor: "#fff", marginTop: 10 }}
          androidStatusBarColor="#FFFFFF"
          iosBarStyle="dark-content"
        >
          <Left>
            <AntDesign
              name={"leftcircleo"}
              color={"#000"}
              style={{ fontSize: 20, marginRight: 10 }}
              onPress={() => this.props.navigation.goBack()}
            />
          </Left>
          <Body></Body>
        </Header>
        <Content>
          <View
            style={{
              flexDirection: "row",
              marginRight: 10,
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            <View style={{ marginLeft: 10, flex: 1, flexDirection: "row" }}>
              <Text
                style={{
                  color: "#273444",
                  marginLeft: 0,
                  fontSize: 20,
                  marginTop: 0,
                  fontFamily: "ProximaNovaBold",
                }}
              >
                Entry History
              </Text>
            </View>
          </View>
          {this.state.history.length <= 0 ? (
            <View>
              <Image
                source={require("../../assets/images/alien.png")}
                style={[styles.imageLogo, { height: 100, width: 100, resizeMode: 'contain'}]}
              />
              <Text
                style={[
                  styles.centerText,
                  { fontFamily: "ProximaNovaSemiBold",paddingBottom: 15 },
                ]}
              >
                {" "}
                Nothing to see here
                {"\n"}
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "normal",
                    fontFamily: "ProximaNovaReg",
                  }}
                >
                  Credit Bag transactions will appear here
                </Text>
              </Text>
            </View>
          ) : (
            <View>
              <List>
                {this.state.history.map((item, i) => {
                  return (
                    <ListItem key={i} style={styles.selectStyle}>
                      <Left>
                        <Text
                          style={{
                            color: "black",
                            fontFamily: "ProximaNovaReg",
                          }}
                        >
                          Ticket No. {item.ticketId} {"\n"}
                          <Text
                            style={{
                              color: "black",
                              fontSize: 11,
                              fontWeight: "normal",
                              fontFamily: "ProximaNovaReg",
                              paddingVertical: 5,
                            }}
                          >
                            Reference. {item.reference}
                          </Text>
                        </Text>
                      </Left>
                      <Right>
                        <Text
                          style={{
                            color: "red",
                            fontSize: 11,
                            fontFamily: "ProximaNovaReg",
                          }}
                        >
                          ₦{item.amount} {"\n"}
                          <Text
                            style={{
                              color: "black",
                              fontSize: 11,
                              fontFamily: "ProximaNovaReg",
                              paddingVertical: 5,
                            }}
                          >
                            {Moment(item.paymentDate).format("hh:mm:ss a")}
                          </Text>
                        </Text>
                      </Right>
                    </ListItem>
                  );
                })}
              </List>
            </View>
          )}
        </Content>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showAlert}
          onRequestClose={() => {}}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={
                {
                  // marginTop: 70,
                  // marginLeft: 20,
                  // marginRight: 20,
                  // borderWidth: 10,
                  // borderColor: "white",
                }
              }
            >
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: "white",
                  width: 375,
                  borderRadius: 30,
                }}
              >
                <Image
                  source={require("../../assets/images/xbox.png")}
                  resizeMode="contain"
                  style={{
                    position: "relative",
                    width: 72,
                    height: 72,
                    alignSelf: "center",
                    marginTop: 50,
                  }}
                ></Image>
                <View style={{ marginTop: 30, alignSelf: "center" }}>
                  <Text
                    style={{
                      color: "#273444",
                      textAlign: "center",
                      textAlignVertical: "center",
                      fontSize: 20,
                      fontFamily: "ProximaNovaSemiBold",
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
                      fontSize: 15,
                      fontFamily: "ProximaNovaReg",
                      marginBottom: 10,
                    }}
                  >
                    {/* {this.state.message} */}
                  </Text>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 50,
                      width: "100%",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.hideAlert();
                      }}
                      style={{
                        backgroundColor: "#FF6161",
                        borderRadius: 30,
                        paddingVertical: 15,
                        width: 330,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 35,
                        // opacity: 0.4,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          alignSelf: "center",
                          fontFamily: "ProximaNovaReg",
                        }}
                      >
                        Okay, got it!
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
              <Spinner color="red" />
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

export default History;
