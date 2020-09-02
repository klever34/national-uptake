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
  TouchableOpacity,
  BackHandler
} from "react-native";

import styles from "./style";

import axios from "axios";

const robot = require("../../assets/images/top.png");

const launchLogo = require("../../assets/images/prof.png");

const inputImage = require("../../assets/images/inputDrop.png");
import AsyncStorage from '@react-native-community/async-storage';

import "intl";

import "intl/locale-data/jsonp/en";

import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

class Namings extends Component {
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
              color={"#273444"}
              style={{ fontSize: 24 }}
              onPress={() => this.props.navigation.goBack()}
            />
          </Left>
          <Body></Body>
        </Header>

        <Content>
          <View style={{ marginTop: 15, marginBottom: 10 }}>
            <Text
              style={[
                {
                  fontFamily: "ProximaNovaAltBold",
                  marginLeft: 20,
                  fontSize: 18,
                },
              ]}
            >
              Profile settings
            </Text>
          </View>

          <List>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Details")}
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
                  source={require("../../assets/images/user.png")}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: "contain",
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{ fontFamily: "ProximaNovaReg", marginTop: 5 }}>
                  Edit profile details
                </Text>
              </Left>
              <Right style={{ marginRight: 20 }}>
                <AntDesign
                  name={"rightcircleo"}
                  color={"#000"}
                  style={{ fontSize: 20, marginRight: 10 }}
                />
              </Right>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Email")}
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
                    height: 25,
                    width: 25,
                    resizeMode: "contain",
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{ fontFamily: "ProximaNovaReg", marginTop: 5 }}>
                  Change email address
                </Text>
              </Left>
              <Right style={{ marginRight: 20 }}>
                <AntDesign
                  name={"rightcircleo"}
                  color={"#000"}
                  style={{ fontSize: 20, marginRight: 10 }}
                />
              </Right>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Reset2")}
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
                  source={require("../../assets/images/lock.png")}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: "contain",
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{ fontFamily: "ProximaNovaReg", marginTop: 5 }}>
                  Change password
                </Text>
              </Left>
              <Right style={{ marginRight: 20 }}>
                <AntDesign
                  name={"rightcircleo"}
                  color={"#000"}
                  style={{ fontSize: 20, marginRight: 10 }}
                />
              </Right>
            </TouchableOpacity>
          </List>
        </Content>
        {/* <Footer >
          <FooterTab style={{ backgroundColor: "#FF5A5A" }}>
            <Button  vertical onPress={() => this.props.navigation.navigate("Homepage")}>
              <Icon name="home" style={{fontSize: 25, color: 'white'}}/>
              <Text style={{ fontSize: 7,color: 'white'}}>Home</Text>
            </Button>
            <Button vertical onPress={() => this.props.navigation.navigate("Explore")}>
              <Icon name="ios-cube" style={{fontSize: 25, color: 'white'}}/>
              <Text style={{fontSize: 7, color: 'white'}}>Expore</Text>
            </Button>
            <Button   vertical onPress={() => this.props.navigation.navigate("Camera")}>
              <Icon active name="ios-camera" style={{fontSize: 60, color: 'white'}}/>
            </Button>
            <Button   vertical onPress={() => this.props.navigation.navigate("Gallery")}>
              <Icon active name="ios-image" style={{fontSize: 25, color: 'white'}}/>
              <Text style={{fontSize: 7, color: 'white'}}>Galery</Text>
            </Button>
            <Button vertical onPress={() => this.props.navigation.navigate("Profile")}>
              <Icon name="ios-person" style={{fontSize: 25, color: 'white'}}/>
              <Text style={{fontSize: 7, color: 'white'}}>Profile</Text>
            </Button>
          </FooterTab>
        </Footer> */}

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

export default Namings;
