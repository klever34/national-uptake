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
  BackHandler
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import styles from "./style";

import axios from "axios";

class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      baseURL: "http://18.197.159.108/api/v1",
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
    };
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
    this.props.navigation.goBack()
    );
  }

  async loginRequest() {
    this.setState({ Spinner: true });

    axios({
      method: "POST",
      url: `${this.state.baseURL}/login`,
      data: {
        email: this.state.email,
        password: this.state.password,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.error === false) {
            try {
              AsyncStorage.setItem(
                "token",
                `Bearer ${response.data.access_token}`
              );

              AsyncStorage.setItem("status", response.data.status);

              this.props.navigation.navigate("Homepage");
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

  render() {
    return (
      <Container style={styles.container}>
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
            <H1 style={styles.textInput}>Reset password</H1>
            <Text style={[styles.textInput2, {fontFamily: "ProximaNovaAltBold",}]}>Set your new password</Text>
            <View>
              <Item stackedLabel regular rounded style={styles.inputStyle}>
                <Input
                  value={this.state.email}
                  style={{
                    borderColor: "white",
                    borderWidth: 1,
                    color: "#273444",
                    marginLeft: 30,
                    fontFamily: "ProximaNovaReg",
                  }}
                  onChangeText={(text) => {
                    this.setState({ email: text });
                  }}
                  placeholder="Thisismynewpassword"
                />
              </Item>

              <Text
                style={{
                  color: "black",
                  marginTop: 10,
                  marginLeft: 20,
                  fontSize: 12,
                  fontFamily: "ProximaNovaReg",
                }}
              >
                <Icon
                  name="ios-close-circle-outline"
                  style={{ color: "red", fontSize: 12 }}
                />
                {"  "}More than 6 characters
              </Text>

              <Button
                block
                rounded
                style={styles.bottonStyle2}
                onPress={() => this.props.navigation.navigate("Register")}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    alignSelf: "center",
                    fontFamily: "ProximaNovaReg",
                  }}
                >
                  Set password
                </Text>
              </Button>
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
                  fontFamily: "ProximaNovaReg",
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
                    fontFamily: "ProximaNovaReg",
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

export default Confirm;
