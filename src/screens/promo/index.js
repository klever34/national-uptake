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
  TextInput,
  BackHandler
} from "react-native";

import styles from "./style";

import axios from "axios";

import { NavigationEvents } from "react-navigation";

const yes = require("../../assets/images/yes.png");
const no = require("../../assets/images/no.png");
import AntDesign from "react-native-vector-icons/AntDesign";

class Promo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      promoCode: "",
      lastname: "",
      phonenumber: "",
      baseURL: "https://dragonflyapi.nationaluptake.com/",
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
      userData: {},
      showHelp: false,
      showNo: false,
    };
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


  async codeRequest() {
    // this.setState({
    //   showHelp: true,
    // });
    // return;
    this.setState({ Spinner: true });

    axios({
      method: "POST",
      url: `${this.state.baseURL}/api/promocodes/addcodebyuser`,
      data: {
        userId: this.state.userData.userid,
        promoCode: this.state.promoCode,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            this.helpView();
          } else {
            this.showNo();
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState({ Spinner: false });
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
  }

  hideHelp() {
    this.setState({
      showHelp: false,
    });
  }

  showNo() {
    this.setState({
      showNo: true,
    });
  }

  hideNo() {
    this.setState({
      showNo: false,
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        {/* <NavigationEvents onDidFocus={() => this.getToken()} /> */}
        <Header
          noShadow
          style={{ backgroundColor: "#fff", marginTop: 10 }}
          androidStatusBarColor="#FFFFFF"
          iosBarStyle="dark-content"
        >
          <Left>
            <AntDesign
              name={"closecircleo"}
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
                  fontSize: 25,
                  paddingHorizontal: 20,
                  marginLeft: 5,
                },
              ]}
            >
              Add a promo code
            </Text>

            <View>
              <Text
                style={{
                  textAlign: "left",
                  marginLeft: 20,
                  marginRight: 10,
                  marginTop: 10,
                  fontSize: 14,
                  color: "#273444",
                  fontFamily: "ProximaNovaReg",
                }}
              >
                Enter the promo code and it will be applied to your next uptake
                entry purchase
              </Text>

              {/* <Item stackedLabel regular rounded style={styles.inputStyle}>
                <Input
                  value={this.state.promoCode}
                  style={{
                    borderColor: "white",
                    borderWidth: 1,
                    color: "#273444",
                    fontFamily: "ProximaNovaReg",
                  }}
                  onChangeText={(text) => {
                    this.setState({ promoCode: text });
                  }}
                  placeholder="  Promo code "
                />
              </Item> */}
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View
                  style={{
                    borderRadius: 30,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#c4c4c4",
                    marginHorizontal: 15,
                    marginTop: 20,
                    width: "90%",
                  }}
                >
                  <TextInput
                    value={this.state.card}
                    style={{
                      color: "#273444",
                      // marginLeft: 10,
                      fontFamily: "ProximaNovaReg",
                      fontSize: 13,
                    }}
                    onChangeText={(text) => {
                      this.setState({ promoCode: text });
                    }}
                    placeholder="Promo code"
                    placeholderTextColor={"#c4c4c4"}
                    maxLength={8}
                  />
                </View>
              </View>

              {this.state.promoCode.length === 8 ? (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => this.codeRequest()}
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
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => this.codeRequest()}
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
                      Apply
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
                  {/* <Text
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
                  This uptake contains multiple products available to be won
                </Text> */}
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
                        Try again
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ showNo: false });
                      }}
                      style={{
                        borderColor: "#FF6161",
                        borderWidth: 2,
                        borderRadius: 30,
                        paddingVertical: 13,
                        width: 330,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 12,
                        // opacity: 0.4,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FF6161",
                          textAlign: "center",
                          alignSelf: "center",
                          fontFamily: "ProximaNovaReg",
                        }}
                      >
                        Okay
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
              <Spinner color="#FF6161" />
            </View>
          </View>
        </Modal>

        {/* <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showHelp}
          onRequestClose={() => {}}
        >
          <View style={{ marginTop: 200, alignSelf: "center" }}>
            <Image
              source={yes}
              resizeMode="contain"
              style={styles.imageLogo}
            ></Image>
            <View style={{ marginTop: 50, alignSelf: "center" }}>
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                You have successfully added a promo code
              </Text>
              <Button
                block
                rounded
                style={styles.bottonStyle}
                onPress={() => {
                  this.hideHelp();
                  this.props.navigation.navigate("Pay");
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
        </Modal> */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showHelp}
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
                    Success! 👌
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
                  You have successfully added a promo code
                </Text>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                      width: "100%",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.hideHelp();
                        this.props.navigation.navigate("Pay");
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
                        marginBottom: 50
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
                        Okay
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showNo}
          onRequestClose={() => {}}
        >
          <View style={{ marginTop: 200, alignSelf: "center" }}>
            <Image
              source={no}
              resizeMode="contain"
              style={styles.imageLogo}
            ></Image>
            <View style={{ marginTop: 50, alignSelf: "center" }}>
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                This promo code is no longer valid..
              </Text>
              <Button
                block
                rounded
                style={styles.bottonStyle}
                onPress={() => {
                  this.hideNo();
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
        </Modal> */}
      </Container>
    );
  }
}

export default Promo;
