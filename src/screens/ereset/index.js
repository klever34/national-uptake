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

import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import AsyncStorage from '@react-native-community/async-storage';

import { NavigationEvents } from "react-navigation";
import AntDesign from "react-native-vector-icons/AntDesign";

class Ereset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      baseURL: "http://oftencoftdevapi-test.us-east-2.elasticbeanstalk.com",
      message: "",
      default_message: "Invalid Token, Please confirm from your mail again",
      showAlert: false,
      message_title: "",
      Spinner: false,
      code: "123456",
    };
  }

  componentDidMount() {
    this.getToken()
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
        this.emailResetRequest();
      }
    } catch (error) {}
  };

  async emailResetRequest() {
    this.setState({ Spinner: true });
    axios({
      method: "PUT",
      url: `${this.state.baseURL}/api/account/sendtoken/${this.state.userData.userid}`,
      data: {
        email: this.state.userData.email,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState({ Spinner: false });
          this.setState({ message: "Please click on the resend button" });
          this.showAlert();
        }.bind(this)
      );
  }

  async verifyRequest() {
    this.setState({ Spinner: true });

    axios({
      method: "POST",
      url: `${this.state.baseURL}/api/account/verifytoken`,
      data: {
        userId: this.state.userData.userid,
        token: this.state.password,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            try {
              this.props.navigation.navigate("Email", {
                tokenr: this.state.password,
              });
            } catch (error) {
              this.setState({ message: error });
              this.showAlert();
            }
          } else {
            this.setState({
              message: "Please check your credentials and Try again",
            });
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

  async resendRequest() {
    this.setState({ Spinner: true });

    axios({
      method: "POST",
      url: `${this.state.baseURL}/api/auth/sendResetToken`,
      data: {
        email: this.state.email,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            try {
              this.setState({ message: "Your reset Token has been resent" });
              this.showAlert();
            } catch (error) {
              this.setState({ message: error });
              this.showAlert();
            }
          } else {
            this.setState({
              message: "Please check your credentials and Try again",
            });
            this.showAlert();
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState({ Spinner: false });

          if (error.response.data.status === "fail") {
            this.setState({
              message: `${error.response.data.responseMessage}, Please try again`,
            });
            this.showAlert();
          }
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
        {/* <NavigationEvents onDidFocus={() => this.getToken()} /> */}
        <Header
          noShadow
          style={{ backgroundColor: "#fff" }}
          androidStatusBarColor="#FFFFFF"
          iosBarStyle="dark-content"
        >
          <Left style={{ marginLeft: 10 }}>
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
          <View>
            <Text
              style={[
                {
                  fontFamily: "ProximaNovaAltBold",
                  alignItems: "flex-start",
                  fontSize: 20,
                  paddingHorizontal: 20,
                  marginLeft: 3,
                },
              ]}
            >
              Email reset code
            </Text>
            <Text style={[styles.textInput2, { fontFamily: "ProximaNovaReg" }]}>
              Please fill in the OTP sent to your email
            </Text>
            <View>
              <SmoothPinCodeInput
                containerStyle={{ alignSelf: "center", marginTop: 20 }}
                cellSpacing={20}
                cellStyle={[
                  styles.card,
                  {
                    borderWidth: 2,
                    borderRadius: 30,
                    borderColor: "white",
                    backgroundColor: "white",
                  },
                ]}
                password
                mask="●"
                cellSize={60}
                codeLength={4}
                value={this.state.password}
                onTextChange={(password) => this.setState({ password })}
              />

              <Text
                style={{
                  color: "black",
                  alignSelf: "center",
                  marginTop: 20,
                  fontFamily: "ProximaNovaReg",
                }}
                onPress={() => {
                  this.emailResetRequest();
                }}
              >
                Resend code{" "}
              </Text>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => this.verifyRequest()}
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
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
              <Spinner color="#FF6161" />
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

export default Ereset;
