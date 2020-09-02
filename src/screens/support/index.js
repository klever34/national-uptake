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
  Linking,
  BackHandler
} from "react-native";

import styles from "./style";

import axios from "axios";

const robot = require("../../assets/images/top.png");

const launchLogo = require("../../assets/images/prof.png");

const inputImage = require("../../assets/images/inputDrop.png");

import "intl";

import "intl/locale-data/jsonp/en";
import AntDesign from "react-native-vector-icons/AntDesign";

class Support extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      email: "",
      baseURL: "http://18.197.159.108/api/v1",
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
      linl: "https://wa.me/07065291575",
      linlB: "mailto:weloveyou@nationaluptake.com?subject=Support",
    };
  }

  componentDidMount() {
    this.getToken();
  }
  UNSAFE_componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
    this.props.navigation.goBack()
    );
  }

  getToken = async () => {
    try {
      const userProfile = await AsyncStorage.getItem("userData");
      if (userProfile === null) {
        this.props.navigation.navigate("Login");
      } else {
        const userData = JSON.parse(userProfile);
        await this.setState({ userData });
      }
    } catch (error) {}
  };

  async getDetails() {
    axios({
      method: "GET",
      url: `${this.state.baseURL}/user`,
      headers: {
        Authorization: this.state.tokenz,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.error === false) {
            this.setState({ username: response.data.user.username });
            this.setState({ email: response.data.user.email });

            this.setState({ created_at: response.data.user.created_at });

            this.setState({
              pic: `https://ui-avatars.com/api/?format=png&name=${response.data.user.username}`,
            });
          } else {
            this.setState({ message: response.data.message });
            this.showAlert();
          }
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

  handleClickA = () => {
    Linking.canOpenURL(this.state.linl).then((supported) => {
      if (supported) {
        Linking.openURL(this.state.linl);
      } else {
        console.log("Don't know how to open URI: " + this.state.linl);
      }
    });
  };

  handleClickB = () => {
    Linking.canOpenURL(this.state.linlB).then((supported) => {
      if (supported) {
        Linking.openURL(this.state.linlB);
      } else {
        console.log("Don't know how to open URI: " + this.state.linlB);
      }
    });
  };

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
          <Text
            style={[
              {
                fontFamily: "ProximaNovaAltBold",
                alignItems: "flex-start",
                fontSize: 20,
                paddingHorizontal: 20,
              },
            ]}
          >
            Support
          </Text>

          <List>
            <TouchableOpacity
              onPress={() => this.handleClickB()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: 20,
                backgroundColor: "#5B9DEE10",
                borderRadius: 24,
                paddingVertical: 15,
                marginVertical: 10,
              }}
            >
              <Left style={{ flexDirection: "row" }}>
                <Image
                  source={require("../../assets/images/mail.png")}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{ fontFamily: "ProximaNovaReg" }}>
                  Send an email
                </Text>
              </Left>
              <Right style={{ marginRight: 20 }}>
                {/* <AntDesign
                  name={"rightcircleo"}
                  color={"#000"}
                  style={{ fontSize: 20, marginRight: 10 }}
                /> */}
              </Right>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleClickA()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: 20,
                backgroundColor: "#5B9DEE10",
                borderRadius: 24,
                paddingVertical: 15,
                marginVertical: 10,
              }}
            >
              <Left style={{ flexDirection: "row" }}>
                <Image
                  source={require("../../assets/images/whatsapp.png")}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{ fontFamily: "ProximaNovaReg" }}>
                  Chat via Whatsapp
                </Text>
              </Left>
              <Right style={{ marginRight: 20 }}>
                {/* <AntDesign
                  name={"rightcircleo"}
                  color={"#000"}
                  style={{ fontSize: 20, marginRight: 10 }}
                /> */}
              </Right>
            </TouchableOpacity>
          </List>
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

export default Support;
