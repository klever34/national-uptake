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
  ListItem,
  Textarea,
  Button,
  Spinner,
  Title,
  Right,
  Footer,
  FooterTab,
  Card,
  CardItem,
  Thumbnail,
} from "native-base";
import {
  ImageBackground,
  View,
  Image,
  Modal,
  AsyncStorage,
  TouchableOpacity,
  BackHandler
} from "react-native";

import styles from "./style";

import axios from "axios";

import Moment from "moment";

const robot = require("../../assets/images/top.png");

const suc = require("../../assets/images/suc.png");

const great = require("../../assets/images/great.png");

import "intl";

import "intl/locale-data/jsonp/en";

class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      email: "",
      baseURL: "http://oftencoftdevapi-test.us-east-2.elasticbeanstalk.com",
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
      tokenz: "",
      created_at: "",
      setFeedback: false,
      feebackMsg: "",
      pic: "https://ui-avatars.com/api/?format=png&name=pic",
      userData: {},
      drawId: "",
      uptakes: {},
      items: [],
      userTickets: [],
    };
  }

  componentDidMount() {
    this.getToken();
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
    this.props.navigation.goBack()
    );
  }

  getToken = async () => {
    try {
      this.setState({ Spinner: true });
      const userProfile = await AsyncStorage.getItem("userData");
      const drawId = await this.props.navigation.getParam("drawId");
      if (userProfile === null) {
        this.props.navigation.navigate("Login");
      } else {
        const userData = JSON.parse(userProfile);
        await this.setState({ userData });
        await this.setState({ drawId });
        this.Uptake();
        this.setState({ Spinner: false });
      }
    } catch (error) {
      this.setState({ Spinner: false });
    }
  };

  async Uptake() {
    this.setState({ Spinner: true });
    axios({
      method: "GET",
      url: `${this.state.baseURL}/api/draws/getdraw/${this.state.userData.userid}/${this.state.drawId}`,
      params: {},
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          let uptakes = response.data.draw;
          let items = response.data.draw.items;
          let userTickets = response.data.draw.userTickets;

          this.setState({ uptakes });
          this.setState({ items });
          this.setState({ userTickets });
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

  showFeedback() {
    this.setState({
      setFeedback: true,
    });
  }

  hideFeedback() {
    this.setState({
      setFeedback: false,
    });
  }

  sendFeedback() {
    this.setState({ setFeedback: false });

    axios({
      method: "POST",
      url: `${this.state.baseURL}/addFeedback`,
      data: {
        message: this.state.feebackMsg,
      },
      headers: {
        Authorization: this.state.tokenz,
      },
    })
      .then(function (response) {}.bind(this))
      .catch(function (error) {}.bind(this));
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content>
          <View>
            <View>
              <Image
                source={suc}
                style={{ marginTop: 60, alignSelf: "center" }}
              />
            </View>

            <View
              style={{ marginTop: 40, alignSelf: "center", marginBottom: 30 }}
            >
              <Image source={great} />
            </View>
          </View>

          <List>
            <ListItem style={styles.selectStyle2}>
              <Left>
                <View style={{}}>
                  <Thumbnail
                    large
                    source={{ uri: `${this.state.uptakes.imageUrl}` }}
                    style={styles.imageLogo}
                  />
                </View>
              </Left>
              <Body>
                <View style={{ marginLeft: -80 }}>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontWeight: "bold",
                      fontFamily: "ProximaNovaBold",
                    }}
                  >
                    {this.state.uptakes.name}
                    {"\n"} {"\n"}
                    <Text
                      style={{
                        color: "black",
                        fontSize: 10,
                        fontWeight: "normal",
                        fontFamily: "ProximaNovaBold",
                      }}
                    >
                      {this.state.uptakes.description}
                    </Text>
                  </Text>
                </View>
                <Button
                  small
                  rounded
                  style={{
                    backgroundColor: "#00000030",
                    marginLeft: -80,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "ProximaNovaReg",
                    }}
                  >
                    ₦{this.state.uptakes.ticketAmount}
                  </Text>
                </Button>
              </Body>
            </ListItem>
          </List>

          <View>
            <List>
              <View>
                {this.state.userTickets.map((item, i) => {
                  return (
                    <ListItem key={i} style={styles.selectStyle}>
                      <Left>
                        <Text
                          style={{
                            color: "black",
                            marginLeft: 20,
                            fontSize: 11,
                            fontFamily: "ProximaNovaReg",
                          }}
                        >
                          Ticket No: {item.ticketId} {"\n"}
                          <Text
                            style={{
                              color: "black",
                              marginLeft: 20,
                              fontSize: 11,
                              fontFamily: "ProximaNovaReg",
                            }}
                          >
                            Reference ID: {item.reference}
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
                          {this.state.uptakes.dateCreated}
                          {Moment(item.dateCreated).format("hh:mm:ss a")}
                        </Text>
                      </Right>
                    </ListItem>
                  );
                })}
              </View>
            </List>
          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Available")}
              style={{
                backgroundColor: "#FF6161",
                borderRadius: 30,
                paddingVertical: 15,
                width: "90%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 15,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  alignSelf: "center",
                  fontFamily: "ProximaNovaBold",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
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
              <Spinner color="red" />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.setFeedback}
          onRequestClose={() => {}}
        >
          <View style={{ marginTop: 200 }}>
            <View style={{ backgroundColor: "#FF5A5A" }}>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  marginBottom: 20,
                  marginTop: 10,
                }}
              >
                Please Enter a Feedback
              </Text>

              <Textarea
                rowSpan={5}
                bordered
                placeholder="Enter Feedback"
                style={{ color: "white" }}
                onChangeText={(feebackMsg) => this.setState({ feebackMsg })}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                <Button
                  light
                  style={styles.bottonStyle2}
                  onPress={() => this.sendFeedback()}
                >
                  <Text
                    style={{
                      color: "#FF5A5A",
                      textAlign: "center",
                      alignSelf: "center",
                    }}
                  >
                    Send
                  </Text>
                </Button>

                <Button
                  style={styles.bottonStyle3}
                  onPress={() => this.hideFeedback()}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      alignSelf: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

export default Success;
