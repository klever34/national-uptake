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
  TextInput,
  BackHandler,
} from "react-native";

import styles from "./style";

import axios from "axios";

import { NavigationEvents } from "react-navigation";

// import { BlurView } from "@react-native-community/blur";
import AsyncStorage from '@react-native-community/async-storage';

const hellp = require("../../assets/images/cc.png");
const yes = require("../../assets/images/yes.png");
const no = require("../../assets/images/no.png");

import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import AntDesign from "react-native-vector-icons/AntDesign";

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cvv: "",
      expiry_month: "",
      expiry_year: "",
      card: "",
      baseURL: "http://oftencoftdevapi-test.us-east-2.elasticbeanstalk.com",
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
      userData: {},
      showHelp: false,
      password: "",
      showNo: false,
      showYes: false,
      showBlur: false,
      indicator: false,
    };
  }

  componentDidMount(){
    this.getToken()
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

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.goBack()
    );
  }

  async addRequest() {
    this.setState({ indicator: true });
    const token = await AsyncStorage.getItem("user_token");
    axios({
      method: "POST",
      url: `${this.state.baseURL}/api/payment/addcard`,
      data: {
        userId: this.state.userData.userid,
        email: this.state.userData.email,
        amount: "100",
        number: this.state.card,
        cvv: this.state.cvv,
        expiry_month: this.state.expiry_month,
        expiry_year: this.state.expiry_year,
        pin: this.state.password,
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            this.showYes();
          } else {
            this.showNo();
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          console.log(error.response);
          this.setState({ indicator: false });
          this.showNo();
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

  helpView() {
    this.setState({
      showHelp: true,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  }

  hideHelp() {
    this.setState({
      showHelp: false,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  }

  showNo() {
    this.setState({
      showNo: true,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  }

  hideNo() {
    this.setState({
      showNo: false,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  }

  showYes() {
    this.setState({
      showYes: true,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  }

  hideYes() {
    this.setState({
      showYes: false,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        {/* <NavigationEvents onDidFocus={() => this.getToken()} /> */}
        <Header
          noShadow
          style={{ backgroundColor: "#FFF", marginTop: 10 }}
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
              Add a debit card
            </Text>
            <View>
              {/* <Item stackedLabel regular rounded style={styles.inputStyle}>
                <Input
                  value={this.state.card}
                  style={{
                    borderColor: "white",
                    borderWidth: 2,
                    color: "#273444",
                    marginLeft: 10,
                    fontFamily: "ProximaNovaReg",
                    fontSize: 13,
                  }}
                  onChangeText={(text) => {
                    this.setState({ card: text });
                  }}
                  placeholder="Card number"
                  placeholderTextColor={"#c4c4c4"}
                  keyboardType={"number-pad"}
                  maxLength={19}
                />
              </Item> */}
              <View
                style={{
                  borderRadius: 30,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: "#c4c4c4",
                  marginHorizontal: 15,
                  marginTop: 20,
                }}
              >
                <TextInput
                  value={this.state.card}
                  style={{
                    color: "#273444",
                    // marginLeft: 10,
                    fontFamily: "ProximaNovaReg",
                    fontSize: 15,
                  }}
                  onChangeText={(text) => {
                    this.setState({ card: text });
                  }}
                  placeholder="Card number"
                  placeholderTextColor={"#c4c4c4"}
                  keyboardType={"number-pad"}
                  maxLength={19}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                  marginHorizontal: 5,
                }}
              >
                <View
                  style={{
                    borderRadius: 30,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#c4c4c4",
                    marginHorizontal: 15,
                    width: "35%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    value={this.state.expiry_month}
                    style={{
                      color: "#273444",
                      // marginLeft: 10,
                      fontFamily: "ProximaNovaReg",
                      fontSize: 15,
                    }}
                    onChangeText={(text) => {
                      this.setState({ expiry_month: text });
                      text.length == 2 ? this.secondTextInput.focus() : null;
                    }}
                    placeholder="MM"
                    placeholderTextColor={"#c4c4c4"}
                    keyboardType={"number-pad"}
                    maxLength={2}
                  />
                  <Text
                    style={{
                      color: "#c4c4c4",
                      // marginLeft: 10,
                      fontFamily: "ProximaNovaReg",
                      fontSize: 15,
                      marginRight: 5,
                    }}
                  >
                    /
                  </Text>
                  <TextInput
                    ref={(input) => {
                      this.secondTextInput = input;
                    }}
                    value={this.state.expiry_year}
                    style={{
                      color: "#273444",
                      // marginLeft: 10,
                      fontFamily: "ProximaNovaReg",
                      fontSize: 15,
                    }}
                    onChangeText={(text) => {
                      this.setState({ expiry_year: text });
                    }}
                    placeholder="YY"
                    placeholderTextColor={"#c4c4c4"}
                    keyboardType={"number-pad"}
                    maxLength={2}
                  />
                </View>
                <View
                  style={{
                    borderRadius: 30,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#c4c4c4",
                    marginHorizontal: 15,
                    width: "35%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    value={this.state.cvv}
                    style={{
                      color: "#273444",
                      width: "55%",
                      fontFamily: "ProximaNovaReg",
                      fontSize: 15,
                    }}
                    onChangeText={(text) => {
                      this.setState({ cvv: text });
                    }}
                    placeholder="CVV"
                    placeholderTextColor={"#c4c4c4"}
                    keyboardType={"number-pad"}
                    maxLength={3}
                  />
                  <AntDesign
                    name={"questioncircleo"}
                    color={"#c4c4c4"}
                    style={{ fontSize: 20, marginRight: 10 }}
                    onPress={() => this.helpView()}
                  />
                </View>
              </View>

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
                    marginVertical: 10,
                    marginHorizontal: 10,
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
                  marginLeft: 25,
                  marginRight: 10,
                  marginTop: 20,
                  fontSize: 14,
                  color: "#000",
                  fontFamily: "ProximaNovaReg",
                }}
              >
                You may be charged a small amount to confirm your details. This
                is immediately refunded.
              </Text>

              {this.state.card !== "" &&
              this.state.expiry_month.length === 2 &&
              this.state.expiry_year.length === 2 &&
              this.state.cvv.length === 3 &&
              this.state.password.length === 4 ? (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity
                  onPress={() => this.addRequest()}
                    style={{
                      backgroundColor: "#FF6161",
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
                      Add card
                    </Text>
                    {this.state.indicator && (
                      <ActivityIndicator
                        size="small"
                        color="#ffffff"
                        style={{ paddingHorizontal: 5, marginTop: -3 }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => this.addRequest()}
                    style={{
                      backgroundColor: "#c4c4c4",
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
                      Add card
                    </Text>
                    {this.state.indicator && (
                      <ActivityIndicator
                        size="small"
                        color="#ffffff"
                        style={{ paddingHorizontal: 5, marginTop: -3 }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 20,
                }}
              >
                <Image
                  source={require("../../assets/images/paystack.png")}
                  style={{ resizeMode: "contain", width: "60%" }}
                />
              </View>
            </View>
          </View>
        </Content>
        {/* {this.state.showBlur === true ? (
          <BlurView
            style={styles.bluring}
            reducedTransparencyFallbackColor="#E5E5E5"
            blurType="dark"
            blurAmount={1}
          />
        ) : (
          <View></View>
        )} */}
        <Modal
          animationType="slide"
          transparent={true}
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showHelp}
          onRequestClose={() => {}}
        >
          <View
            style={{
              marginTop: 200,
              // marginLeft: 20,
              // marginRight: 20,
              // borderWidth: 10,
              // borderColor: "white",
            }}
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
                source={hellp}
                resizeMode="contain"
                style={{
                  position: "relative",
                  width: 72,
                  height: 72,
                  alignSelf: "center",
                  marginTop: 40,
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
                  CVV
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
                  }}
                >
                  A three-digit code that you can find on the back of your card
                </Text>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 30,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.hideHelp();
                    }}
                    style={{
                      backgroundColor: "#FF6161",
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
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showYes}
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
                  source={require("../../assets/images/done.png")}
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
                    Success 👌
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
                    You have successfully added a payment card
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
                        this.setState({ showYes: false });
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
              visible={this.state.showNo}
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
                        There was an error adding your card, please try again
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
                            this.setState({ showAlert: false });
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
      </Container>
    );
  }
}

export default Payment;
