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
  Dimensions,
  TouchableOpacity,
} from "react-native";

import Swiper from "react-native-swiper";

import styles from "./style";

import axios from "axios";


const image1 = require("../../assets/images/pic1.png");

const image2 = require("../../assets/images/pic2.png");

const image3 = require("../../assets/images/pic3.png");

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import Foundation from "react-native-vector-icons/Foundation";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-community/async-storage';

class Welcome extends Component {
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

  async componentDidMount() {
    await AsyncStorage.setItem("@user_onboarded", 'true');
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
        <Content style={styles.imageContainer}>
          <View>
            <View>
              <Swiper
                width={deviceWidth}
                showsButtons={false}
                height={deviceHeight * 0.7}
                dotStyle={styles.dot}
                autoplay={true}
                style={styles.wrapper}
                autoplayTimeout={5}
              >
                <View>
                  <ImageBackground
                    source={image1}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        marginBottom: 40,
                      }}
                    >
                      <Text
                        style={[
                          styles.text,
                          {
                            fontFamily: "ProximaNova-Regular",
                            paddingBottom: 10,
                          },
                        ]}
                      >
                        Give yourself a chance to win amazing products
                      </Text>
                    </View>
                  </ImageBackground>
                </View>

                <View>
                  <ImageBackground
                    source={image2}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        marginBottom: 40,
                      }}
                    >
                      <Text
                        style={[
                          styles.text,
                          {
                            fontFamily: "ProximaNova-Regular",
                            paddingBottom: 10,
                          },
                        ]}
                      >
                        Easy and no hassle entry. Directly from your credit bag
                      </Text>
                    </View>
                  </ImageBackground>
                </View>

                <View>
                  <ImageBackground
                    source={image3}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        marginBottom: 40,
                      }}
                    >
                      <Text
                        style={[
                          styles.text,
                          {
                            fontFamily: "ProximaNova-Regular",
                            paddingBottom: 10,
                          },
                        ]}
                      >
                        Fair and transparent winner selection
                      </Text>
                    </View>
                  </ImageBackground>
                </View>
              </Swiper>

              {/* <Button
                block
                rounded
                style={styles.bottonStyle2}
                onPress={() => this.props.navigation.navigate("Login")}
              ></Button> */}
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => this.props.navigation.push("Login")}
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
                  <Foundation
                    name={"mail"}
                    color={"#fff"}
                    style={{ fontSize: 20, marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      alignSelf: "center",
                      fontFamily: "ProximaNovaBold",
                      marginTop: 2,
                    }}
                  >
                    Continue with email
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => this.props.navigation.push("Guest")}
                  style={{
                    borderColor: "#FF6161",
                    borderWidth: 2,
                    borderRadius: 30,
                    paddingVertical: 15,
                    width: "90%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 15,
                  }}
                >
                  <FontAwesome
                    name={"user"}
                    color={"#000"}
                    style={{ fontSize: 20, marginRight: 10 }}
                  />
                  <Text
                    style={{
                      color: "#000",
                      textAlign: "center",
                      alignSelf: "center",
                      fontFamily: "ProximaNovaBold",
                      marginTop: 2,
                    }}
                  >
                    Continue as a guest
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  color: "#273444",
                  alignSelf: "center",
                  fontSize: 12,
                  textAlign: "center",
                  textAlignVertical: "center",
                  marginTop: 20,
                  marginBottom: 20,
                  marginLeft: 10,
                  marginRight: 10,
                  fontFamily: "ProximaNova-Regular",
                }}
              >
                By using National Uptake, you agree to our
                <Text
                  style={{
                    color: "#5B9DEE",
                    alignSelf: "center",
                    fontSize: 12,
                    fontFamily: "ProximaNova-Regular",
                  }}
                >
                  {" "}
                  Terms of service{" "}
                </Text>{" "}
                &{" "}
                <Text
                  style={{
                    color: "#5B9DEE",
                    alignSelf: "center",
                    fontSize: 12,
                    fontFamily: "ProximaNova-Regular",
                  }}
                >
                  Privacy Policy
                </Text>
              </Text>
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

export default Welcome;
