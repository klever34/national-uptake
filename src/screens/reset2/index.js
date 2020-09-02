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
import AntDesign from "react-native-vector-icons/AntDesign";

class Reset2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password2: "",
      password: "",
      baseURL: "http://oftencoftdevapi-test.us-east-2.elasticbeanstalk.com",
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
      view: true,
      userData: {},
      view2: true,
    };
  }

  async componentDidMount() {
    await this.getToken();
  }

  getToken = async () => {
    try {
      const userProfile = await AsyncStorage.getItem("userData");
      if (userProfile === null) {
        this.props.navigation.navigate("Login");
      } else {
        const userData = JSON.parse(userProfile);
        this.setState({ userData });
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
      url: `${this.state.baseURL}/api/account/update/password/${this.state.userData.userid}`,
      data: {
        currentPassword: this.state.password,
        newPassword: this.state.password2,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            this.setState({
              message: "Your password has been successfully changed",
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
          if (error.response.data.status === "failed") {
            this.setState({ Spinner: false });
            this.setState({ message: error.response.data.data[0] });
            this.showAlert();
          } else {
            this.setState({ Spinner: false });
            this.setState({ message: this.state.default_message });
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

  toggleView() {
    this.setState({
      view: !this.state.view,
    });
  }

  toggleView2() {
    this.setState({
      view2: !this.state.view2,
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        {/* <NavigationEvents onDidFocus={() => this.getToken()} /> */}
        <Header
          noShadow
          style={{ backgroundColor: "#FFF" }}
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
                  fontSize: 25,
                  paddingHorizontal: 20,
                },
              ]}
            >
              Reset Password
            </Text>
            <Text
              style={[
                styles.textInput2,
                { fontFamily: "ProximaNovaReg", fontSize: 14 },
              ]}
            >
              Set your new password
            </Text>
            <View>
              {/* <Item regular rounded style={styles.inputStyle}>
                <Input
                  secureTextEntry={this.state.view}
                  value={this.state.password}
                  style={{
                    borderColor: "white",
                    color: "#273444",
                    marginLeft: 10,
                    fontFamily: "ProximaNovaReg",
                  }}
                  onChangeText={(text) => {
                    this.setState({ password: text });
                  }}
                  placeholder="Current Password"
                  placeholderTextColor={"#c4c4c4"}

                />
                <Icon
                  active
                  name="eye"
                  style={{ fontSize: 25, color: "#5B9DEE", marginRight: 10 }}
                  onPress={() => this.toggleView()}
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
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginVertical: 10,
                    width: "90%",
                  }}
                >
                  <TextInput
                    value={this.state.password}
                    style={{
                      color: "#273444",
                      // marginLeft: 10,
                      fontFamily: "ProximaNovaReg",
                      fontSize: 15,
                      width: "60%",
                    }}
                    onChangeText={(text) => {
                      this.setState({ password: text });
                    }}
                    placeholder="Current Password"
                    placeholderTextColor={"#c4c4c4"}
                    secureTextEntry={this.state.view}
                  />
                  <AntDesign
                    name={"eyeo"}
                    color={"#5B9DEE"}
                    style={{ fontSize: 20, marginRight: 10 }}
                    onPress={() => this.toggleView()}
                  />
                </View>
                <View
                  style={{
                    borderRadius: 30,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "#c4c4c4",
                    marginHorizontal: 15,
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginVertical: 10,
                    width: "90%",
                  }}
                >
                  <TextInput
                    value={this.state.password2}
                    style={{
                      color: "#273444",
                      // marginLeft: 10,
                      fontFamily: "ProximaNovaReg",
                      fontSize: 15,
                      width: "60%",
                    }}
                    onChangeText={(text) => {
                      this.setState({ password2: text });
                    }}
                    placeholder="New Password"
                    placeholderTextColor={"#c4c4c4"}
                    secureTextEntry={this.state.view2}
                  />
                  <AntDesign
                    name={"eyeo"}
                    color={"#5B9DEE"}
                    style={{ fontSize: 20, marginRight: 10 }}
                    onPress={() => this.toggleView2()}
                  />
                </View>
              </View>

              {(this.state.password === "" || this.state.password2 === "")  || (this.state.password !== this.state.password2 )? (
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
                      marginHorizontal: 15,
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
                      marginHorizontal: 15,
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

export default Reset2;
