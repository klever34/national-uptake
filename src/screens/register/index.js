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
  Input,
  Button,
  Spinner,
  Right,
  Switch,
} from "native-base";
import {
  View,
  Modal,
  TouchableOpacity,
  BackHandler
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import styles from "./style";
import {baseUrl} from '../../constants/index';
import axios from "axios";

import { NavigationEvents } from "react-navigation";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      baseURL: baseUrl,
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
      referral: "",
      firstname: "",
      lastname: "",
      phonenumber: "",
      referralCode: "",
      age: false,
    };
  }

  getToken = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      const email = await this.props.navigation.getParam("email");
      await this.setState({ email });
    } catch (error) {
      this.props.navigation.navigate("Welcome");
    }
  };

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
    this.props.navigation.goBack()
    );
  }

  async loginRequest() {
    this.setState({ Spinner: true });

    axios({
      method: "POST",
      url: `${this.state.baseURL}/api/auth/register`,
      data: {
        email: this.state.email,
        password: this.state.password,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        phonenumber: this.state.phonenumber,
        referralCode: this.state.referral,
        rememberMe: true,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            try {
              AsyncStorage.setItem(
                "userData",
                JSON.stringify(response.data.userSignInResult)
              );
              AsyncStorage.setItem('user_token', response.data.userSignInResult.token)
              AsyncStorage.setItem('referral_code', response.data.userSignInResult.referralCode)
              this.props.navigation.navigate("Available");
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

  toggleAge() {
    this.setState({
      age: !this.state.age,
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
              Join the national update community
            </Text>
            <Text
              style={[styles.textInput2, { fontFamily: "ProximaNova-Regular" }]}
            >
              Please provide the following details to create your account.
            </Text>
            <View>
              <Item regular rounded style={[styles.inputStyle, {marginVertical: 10}]}>
                <Input
                  value={this.state.firstname}
                  style={{
                    borderColor: "white",
                    borderWidth: 0,
                    color: "#273444",
                    marginLeft: 10,
                    fontFamily: "ProximaNova-Regular",
                  }}
                  onChangeText={(text) => {
                    this.setState({ firstname: text });
                  }}
                  placeholder="Firstname"
                />
              </Item>

              <Item regular rounded style={[styles.inputStyle, {marginVertical: 10}]}>
                <Input
                  value={this.state.lastname}
                  style={{
                    borderColor: "white",
                    borderWidth: 0,
                    color: "#273444",
                    marginLeft: 10,
                    fontFamily: "ProximaNova-Regular",
                  }}
                  onChangeText={(text) => {
                    this.setState({ lastname: text });
                  }}
                  placeholder="Lastname"
                />
              </Item>

              <Item regular rounded style={[styles.inputStyle, {marginVertical: 10}]}>
                <Input
                  value={this.state.phonenumber}
                  style={{
                    borderColor: "white",
                    borderWidth: 0,
                    color: "#273444",
                    marginLeft: 10,
                    fontFamily: "ProximaNova-Regular",
                  }}
                  onChangeText={(text) => {
                    this.setState({ phonenumber: text });
                  }}
                  placeholder="Phone number"
                />
              </Item>

              <Item regular rounded style={[styles.inputStyle, {marginVertical: 10}]}>
                <Input
                  value={this.state.password}
                  style={{
                    borderColor: "white",
                    borderWidth: 0,
                    color: "#273444",
                    marginLeft: 10,
                    fontFamily: "ProximaNova-Regular",
                  }}
                  onChangeText={(text) => {
                    this.setState({ password: text });
                  }}
                  placeholder="Password"
                />
              </Item>

              <Text
                style={{
                  color: "black",
                  marginTop: 10,
                  marginLeft: 20,
                  fontSize: 12,
                  fontFamily: "ProximaNova-Regular",
                }}
              >
                <Icon
                  name="ios-close-circle-outline"
                  style={{ color: "red", fontSize: 12 }}
                />
                {"  "}More than 6 characters
              </Text>

              <Item regular rounded style={[styles.inputStyle, {marginVertical: 10}]}>
                <Input
                  value={this.state.referral}
                  style={{
                    borderColor: "#EAF3FF",
                    borderWidth: 0,
                    color: "#273444",
                    marginLeft: 10,
                    fontFamily: "ProximaNova-Regular",
                  }}
                  onChangeText={(text) => {
                    this.setState({ referral: text });
                  }}
                  placeholder="Referral code "
                />
              </Item>
              <View style={{ flexDirection: "row", marginRight: 30 }}>
                <Text
                  style={{
                    color: "black",
                    marginTop: 10,
                    marginLeft: 20,
                    fontSize: 12,
                    fontFamily: "ProximaNova-Regular",
                  }}
                >
                  You are above 16 years old
                </Text>
                <Right>
                  <Switch
                    value={this.state.age}
                    onValueChange={() => {
                      this.toggleAge();
                    }}
                  />
                </Right>
              </View>

              {this.state.lastname === "" ||
              this.state.firstname === "" ||
              this.state.phonenumber === "" ||
              this.state.password.length < 6 ||
              this.state.age === false ? (
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
                      Sign up
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
                      Sign up
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

export default Register;
