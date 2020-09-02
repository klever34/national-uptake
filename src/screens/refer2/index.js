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
  Right,
  Badge,
  CardItem,
  Card,
  Thumbnail,
  ListItem,
} from "native-base";
import {
  ImageBackground,
  View,
  Image,
  Modal,
  AsyncStorage,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  BackHandler
} from "react-native";

import styles from "./style";

import axios from "axios";

import SmoothPinCodeInput from "react-native-smooth-pincode-input";

const robot = require("../../assets/images/top.png");

const empty = require("../../assets/images/not.png");

const coin = require("../../assets/images/coins.png");

const try1 = require("../../assets/images/try1.png");

import Moment from "moment";

import { NavigationEvents } from "react-navigation";
import AntDesign from "react-native-vector-icons/AntDesign";

class Refer2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      baseURL: "http://oftencoftdevapi-test.us-east-2.elasticbeanstalk.com",
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
      code: "123456",
      userData: {},
      credit: 0,
      available: [],
      now: "",
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
      const userData = JSON.parse(userProfile);
      await this.setState({ userData });
      await this.refUptake();
    } catch (error) {}
  };

  async refUptake() {
    axios({
      method: "GET",
      url: `${this.state.baseURL}/api/account/getrefcodeusers/${this.state.userData.userid}`,
      params: {},
    })
      .then(
        function (response) {
          let available = response.data.data;

          this.setState({ available });
        }.bind(this)
      )
      .catch(
        function (error) {
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
          style={{ backgroundColor: "#fff", marginTop: 10 }}
          androidStatusBarColor="#FFFFFF"
          iosBarStyle="dark-content"
        >
          <Left>
            <AntDesign
              name={"leftcircleo"}
              color={"#273444"}
              style={{ fontSize: 24, marginLeft: 5 }}
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
                marginTop: 10,
              },
            ]}
          >
            Referral code
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginRight: 10,
              marginLeft: 10,
              marginTop: 25,
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Refer")}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#DCEAFD",
                padding: 10,
                fontFamily: "ProximaNovaThin",
                fontSize: 18,
                marginRight: 20,
                borderRadius: 24,
                paddingHorizontal: 20,
                width: "30%",
                opacity: 0.5,
              }}
            >
              <Text>Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Refer2")}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#DCEAFD",
                padding: 10,
                fontFamily: "ProximaNovaBold",
                fontSize: 18,
                borderRadius: 24,
                paddingHorizontal: 20,
                width: "30%",
              }}
            >
              <Text>Status</Text>
            </TouchableOpacity>
          </View>

          {this.state.available.length <= 0 ? (
            <View>
              <Image source={empty} style={styles.imageLogo} />
              <Text
                style={[styles.centerText, { fontFamily: "ProximaNovaSemiBold" }]}
              >
                {" "}
                Nothing to see here
                {"\n"}
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "normal",
                    fontFamily: "ProximaNovaReg",
                    marginTop: 5
                  }}
                >
                  Your referrals will appear here
                </Text>
              </Text>
            </View>
          ) : (
            <View>
              <List>
                {this.state.available.map((item, i) => {
                  return (
                    <ListItem key={i} style={styles.selectStyle}>
                      <Left>
                        <Thumbnail
                          large
                          source={{
                            uri: item.profileImage
                              ? item.profileImage
                              : `https://ui-avatars.com/api/?format=png&name=${item.fullname}`,
                          }}
                          style={styles.imageLogo2}
                        />
                        <Text
                          style={{
                            color: "black",
                            marginLeft: 20,
                            fontSize: 14,
                            fontFamily: "ProximaNovaReg",
                          }}
                        >
                          {item.fullname}
                          {"\n"}
                          <Text
                            style={{
                              color: "black",
                              fontSize: 10,
                              fontWeight: "normal",
                              fontFamily: "ProximaNovaReg",
                            }}
                          >
                            {Moment(item.dateUsed).format("hh:mm:ss a")}
                          </Text>
                        </Text>
                      </Left>
                    </ListItem>
                  );
                })}
              </List>
            </View>
          )}
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
              <Spinner color="white" />
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

export default Refer2;
