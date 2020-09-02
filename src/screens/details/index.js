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
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios";

import { NavigationEvents } from "react-navigation";
import AntDesign from "react-native-vector-icons/AntDesign";

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      phonenumber: "",
      baseURL: "http://oftencoftdevapi-test.us-east-2.elasticbeanstalk.com",
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
      userData: {},
    };
  }

  async componentDidMount(){
    await this.getToken();
  }

  getToken = async () => {
    try {
      const userProfile = await AsyncStorage.getItem("userData");
      if (userProfile === null) {
        this.props.navigation.navigate("Login");
      } else {
        const userData = JSON.parse(userProfile);
        console.log(userData);
        await this.setState({ userData });
      }
    } catch (error) {}
  };

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
    this.props.navigation.goBack()
    );
  }
  async loginRequest() {
    this.setState({ Spinner: true });

    axios({
      method: "PUT",
      url: `${this.state.baseURL}/api/account/update/profile/${this.state.userData.userid}`,
      data: {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        phone: this.state.phonenumber,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            this.state.userData.firstname = this.state.firstname
              ? this.state.firstname
              : this.state.userData.firstname;
            this.state.userData.lastname = this.state.lastname
              ? this.state.lastname
              : this.state.userData.lastname;
            this.state.userData.phone = this.state.phonenumber
              ? this.state.phonenumber
              : this.state.userData.phone;

            AsyncStorage.setItem(
              "userData",
              JSON.stringify(this.state.userData)
            );

            this.setState({
              message: "Your profile has been successfully updated 🙌🏽",
            });
            this.showAlert();
          } else {
            this.setState({
              message:
                "There was an error while updating your details, please try again",
            });
            this.showAlert();
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          console.log(error);
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
                  marginBottom: 15,
                },
              ]}
            >
              Profile details
            </Text>
            <View>
              <Item
                regular
                rounded
                style={[styles.inputStyle, { marginVertical: 15 }]}
              >
                <Input
                  value={this.state.firstname}
                  style={{
                    borderColor: "white",
                    borderWidth: 0,
                    color: "#273444",
                    marginLeft: 10,
                    fontFamily: "ProximaNovaReg",
                  }}
                  onChangeText={(text) => {
                    this.setState({ firstname: text });
                  }}
                  placeholder={this.state.userData.firstname}
                />
              </Item>

              <Item
                regular
                rounded
                style={[styles.inputStyle, { marginVertical: 15 }]}
              >
                <Input
                  value={this.state.lastname}
                  style={{
                    borderColor: "white",
                    borderWidth: 0,
                    color: "#273444",
                    marginLeft: 10,
                    fontFamily: "ProximaNovaReg",
                  }}
                  onChangeText={(text) => {
                    this.setState({ lastname: text });
                  }}
                  placeholder={this.state.userData.lastname}
                />
              </Item>

              <Item
                regular
                rounded
                style={[styles.inputStyle, { marginVertical: 15 }]}
              >
                <Input
                  value={this.state.phonenumber}
                  style={{
                    borderColor: "white",
                    borderWidth: 0,
                    color: "#273444",
                    marginLeft: 10,
                    fontFamily: "ProximaNovaReg",
                  }}
                  onChangeText={(text) => {
                    this.setState({ phonenumber: text });
                  }}
                  placeholder={this.state.userData.phone}
                />
              </Item>

              {this.state.password === "" || this.state.password2 === "" ? (
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
                      Set Password
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => this.loginRequest()}
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
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
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
              style={{
                marginTop: 70,
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
                {/* <Image
                  source={require("../../../assets/stack.png")}
                  resizeMode="contain"
                  style={{
                    position: "relative",
                    width: 72,
                    height: 72,
                    alignSelf: "center",
                    marginTop: 50,
                  }}
                ></Image> */}
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
                    {this.state.message}
                  </Text>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 50,
                      marginTop: 30,
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
                        Okay, got it
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
      </Container>
    );
  }
}

export default Details;
