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
  AsyncStorage,
  TouchableOpacity,
  BackHandler
} from "react-native";

import styles from "./style";

import axios from "axios";

import SmoothPinCodeInput from "react-native-smooth-pincode-input";

import { NavigationEvents } from "react-navigation";

class Reset extends Component {
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

  componentDidMount() {}

  getToken = async () => {
    try {
      const email = await this.props.navigation.getParam("email");
      await this.setState({ email });
    } catch (error) {
      this.props.navigation.navigate("Login");
    }
  };
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
    this.props.navigation.goBack()
    );
  }

  async verifyRequest() {
    this.setState({ Spinner: true });

    axios({
      method: "POST",
      url: `${this.state.baseURL}/api/auth/verifyToken`,
      data: {
        email: this.state.email,
        token: this.state.password,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            try {
              this.props.navigation.navigate("Change", {
                email: this.state.email,
                token: this.state.password,
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

  async resetRequest() {
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
        <NavigationEvents onDidFocus={() => this.getToken()} />
        <Header
          noShadow
          style={{ backgroundColor: "#FFF" }}
          androidStatusBarColor="#FFFFFF"
          iosBarStyle="dark-content"
        >
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-dropleft" style={{ color: "black" }} />
            </Button>
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
                },
              ]}
            >
              Password reset code
            </Text>
            <Text
              style={[styles.textInput2, { fontFamily: "ProximaNova-Regular" }]}
            >
              Please fill in the OTP sent to your email
            </Text>
            <View>
              <SmoothPinCodeInput
                containerStyle={{ alignSelf: "center", marginTop: 20 }}
                cellSpacing={20}
                cellStyle={{
                  borderWidth: 2,
                  borderRadius: 30,
                  borderColor: "white",
                  backgroundColor: "white",
                }}
                password
                mask="﹡"
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
                  fontFamily: "ProximaNova-Regular",
                }}
                onPress={() => {
                  this.resetRequest();
                }}
              >
                Resend code{" "}
              </Text>

              {this.state.password === "" ? (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#c4c4c4",
                      borderRadius: 30,
                      paddingVertical: 15,
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 15,
                      // opacity: 0.4,
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
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
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
              )}
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

export default Reset;
