import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Icon,
  Text,
  Card,
  Body,
  CardItem,
  Thumbnail,
  H1,
  Input,
  Button,
  Left,
  Title,
  Right,
  Footer,
  FooterTab,
  Badge,
  Fab,
  IconNB,
  Spinner,
  ListItem,
  List,
} from "native-base";
import {
  ImageBackground,
  View,
  Image,
  Modal,
  AsyncStorage,
  BackHandler,
  TouchableOpacity,
} from "react-native";

import styles from "./style";

import axios from "axios";

import Moment from "moment";

// import { BlurView } from "@react-native-community/blur";

const sub = require("../../assets/images/sub.png");

const inputImage = require("../../assets/images/inputDrop.png");

const cardi = require("../../assets/images/cardi.png");

const tem = require("../../assets/images/tem.png");

const no = require("../../assets/images/no.png");

import { NavigationEvents } from "react-navigation";
import AntDesign from "react-native-vector-icons/AntDesign";

class Won extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      baseURL: "http://oftencoftdevapi-test.us-east-2.elasticbeanstalk.com",
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
      active: false,
      drawId: 6,
      page: 1,
      pagination: 10,
      Timage: "https://i.ibb.co/DfnLpNS/tem.png",
      uptakes: {},
      value: 1,
      userData: {},
      logged: "",
      cards: [],
      items: [],
      showPay: false,
      imagez: false,
      imagezLink: "",
      showBlur: false,
    };
  }

  getToken = async () => {
    try {
      this.setState({ Spinner: true });
      const image = await this.props.navigation.getParam("image");
      const drawId = await this.props.navigation.getParam("id");
      const userProfile = await AsyncStorage.getItem("userData");

      await this.setState({ image });
      await this.setState({ drawId });

      if (userProfile === null) {
        this.props.navigation.navigate("Login");
      } else {
        await this.setState({ logged: "yes" });
        const userData = JSON.parse(userProfile);
        await this.setState({ userData });
        await this.Uptake();
        await this.getCardRequest();
      }
    } catch (error) {
      this.props.navigation.navigate("Available");
    }
  };

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
    this.props.navigation.goBack()
    );
  }
  async Uptake() {
    const token = await AsyncStorage.getItem("user_token");
    this.setState({ Spinner: true });
    axios({
      method: "GET",
      url: `${this.state.baseURL}/api/draws/getdraw/${this.state.userData.userid}/${this.state.drawId}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          let uptakes = response.data.draw;
          let items = response.data.draw.items;

          this.setState({ uptakes });
          this.setState({ items });
        }.bind(this)
      )
      .catch(
        function (error) {
          console.log(error.response);
          this.setState({ Spinner: false });
          this.setState({ message: this.state.default_message });
          //   this.showAlert();
        }.bind(this)
      );
  }

  async payUptake() {
    axios({
      method: "POST",
      url: `${this.state.baseURL}/api/payment/initialize`,
      data: {
        userId: this.state.userData.userid,
        drawId: this.state.drawId,
      },
    })
      .then(
        function (response) {
          this.props.navigation.navigate("Suc", { drawId: this.state.drawId });
        }.bind(this)
      )
      .catch(
        function (error) {
          console.log(error.response.data);
          if (error.response.data.status === "failed") {
            this.setState({ message: error.response.data.responseMessage });
            this.showAlert();
          } else {
            this.setState({ message: this.state.default_message });
            // this.showAlert();
          }
        }.bind(this)
      );
  }

  async paidUptake() {
    this.setState({ Spinner: true });
    axios({
      method: "POST",
      url: `${this.state.baseURL}/api/payment/initialize`,
      data: {
        userId: this.state.userData.userid,
        drawId: this.state.drawId,
        totalAmount: this.state.uptakes.ticketAmount * this.state.value,
        quantity: this.state.value,
        cardId: this.state.cards.id,
        code: "",
        codeType: "",
        paymentOption: 3,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          this.props.navigation.navigate("Suc", { drawId: this.state.drawId });
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState({ Spinner: false });
          if (error.response.data.status === "failed") {
            this.setState({ message: error.response.data.responseMessage });
            this.showAlert();
          } else {
            this.setState({ message: this.state.default_message });
            // this.showAlert();
          }
        }.bind(this)
      );
  }

  async getCardRequest() {
    this.setState({ Spinner: true });
    const token = await AsyncStorage.getItem("user_token");
    axios({
      method: "GET",
      url: `${this.state.baseURL}/api/payment/getdefaultcard/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            this.setState({ cards: response.data.data });
          } else {
            this.setState({ message: this.state.default_message });
            this.showAlert();
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState({ Spinner: false });
          this.setState({ message: error.response.data.ResponseMessage });
          //   this.showAlert();
        }.bind(this)
      );
  }

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  };

  addValue = () => {
    this.setState({
      value: this.state.value + 1,
    });
  };

  ducValue = () => {
    if (this.state.value == 1) return;
    this.setState({
      value: this.state.value - 1,
    });
  };

  showPay = () => {
    this.setState({
      showPay: true,
    });
  };

  hidePay = () => {
    this.setState({
      showPay: false,
    });
  };

  toggleImagez = (urlx) => {
    this.setState({
      imagezLink: urlx,
    });

    this.setState({
      imagez: !this.state.imagez,
    });

    this.setState({
      showBlur: !this.state.showBlur,
    });
  };

  render() {
    const B = (props) => (
      <Text style={{ fontFamily: "ProximaNovaBold" }}>{props.children}</Text>
    );
    return (
      <Container>
        <NavigationEvents onDidFocus={() => this.getToken()} />
        <ImageBackground
          source={{
            uri: "https://picsum.photos/id/237/200/300",
          }}
          style={styles.imageContainer}
        />

        <View
          style={{
            flexDirection: "row",
            marginTop: 40,
            marginLeft: 20,
            position: "absolute",
            marginRight: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{
              height: 40,
              width: 40,
              borderRadius: 40,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#555558",
            }}
          >
            <AntDesign
              name={"closecircleo"}
              color={"#fff"}
              style={{ fontSize: 23 }}
            />
          </TouchableOpacity>

          <Right>
            {/* <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#555558",
              }}
            >
              <Image
                source={require("../../assets/images/chatt.png")}
                style={{ height: 23, width: 23 }}
              />
            </TouchableOpacity> */}
          </Right>
        </View>

        <View
          ref={(img) => {
            this.backgroundImage = img;
          }}
          // source={inputImage}
          // resizeMode="stretch"
          style={[styles.image2, { marginTop: 150 }]}
        >
          <View style={{ marginLeft: 10, marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={[
                  {
                    fontFamily: "ProximaNovaSemiBold",
                    alignItems: "flex-start",
                    fontSize: 18,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    marginLeft: 5,
                  },
                ]}
              >
                Soak up the Lekki Resort
              </Text>
              <View style={{ paddingRight: 10 }}>
                <Text
                  style={[
                    {
                      fontFamily: "ProximaNovaReg",
                      alignItems: "flex-start",
                      fontSize: 10,
                    },
                  ]}
                >
                  Draw date
                </Text>
                <Text
                  style={[
                    {
                      fontFamily: "ProximaNovaReg",
                      alignItems: "flex-start",
                      fontSize: 12,
                    },
                  ]}
                >
                  July 20, 2020
                </Text>
              </View>
            </View>
          </View>
          <Content
            padder
            style={{
              borderRadius: 30,
              borderColor: "white",
              borderWidth: 5,
              shadowColor: "white",
              flex: 1,
            }}
          >
            <Text
              style={[
                {
                  fontFamily: "ProximaNovaSemiBold",
                  alignItems: "flex-start",
                  fontWeight: "400",
                  fontSize: 16,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  marginTop: 10,
                },
              ]}
            >
              Uptake winner
            </Text>

            <ListItem
              // key={i}
              style={styles.selectStyle2}
              onPress={() => {
                this.toggleImagez(item.imageUrl);
              }}
            >
              <Left>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View style={{ borderRadius: 50 }}>
                    <Image
                      source={{ uri: `https://picsum.photos/id/237/200/300` }}
                      style={styles.imageLogo}
                    />
                  </View>

                  <View
                    style={{
                      marginLeft: 20,
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: 14,
                        fontWeight: "400",
                        fontFamily: "ProximaNovaSemiBold",
                      }}
                    >
                      Fortune Bond
                    </Text>
                  </View>
                </View>
              </Left>
            </ListItem>

            <ListItem
              // key={i}
              style={styles.selectStyle2}
              onPress={() => {
                this.toggleImagez(item.imageUrl);
              }}
            >
              <Left>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ borderRadius: 50 }}>
                    <Image
                      source={{ uri: `https://picsum.photos/id/237/200/300` }}
                      style={[
                        styles.imageLogo,
                        { backgroundColor: "#0000", borderRadius: 20 },
                      ]}
                    />
                  </View>

                  <View
                    style={{
                      marginLeft: 5,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={
                        {
                          // borderBottomWidth: 0.5,
                          // borderBottomColor: "#c4c4c4",
                        }
                      }
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 14,
                          fontWeight: "400",
                          fontFamily: "ProximaNovaSemiBold",
                        }}
                      >
                        Macbook Pro
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 7,
                      }}
                    >
                      <Image
                        source={{ uri: `https://picsum.photos/id/237/200/300` }}
                        style={[
                          styles.imageLogo,
                          { backgroundColor: "#000", height: 30, width: 30 },
                        ]}
                      />
                      <Text
                        style={{
                          color: "black",
                          fontSize: 10,
                          fontFamily: "ProximaNovaReg",
                          paddingHorizontal: 7,
                        }}
                      >
                        Fortune Bond
                      </Text>
                    </View>
                  </View>
                </View>
              </Left>
            </ListItem>

            <ListItem
              // key={i}
              style={[styles.selectStyle2, { backgroundColor: "#5B9DEE" }]}
              onPress={() => {
                this.toggleImagez(item.imageUrl);
              }}
            >
              <Left>
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "#fff",
                    borderRadius: 30,
                    height: 30,
                    width: 30,
                    alignItems: "center",
                    justify: "center",
                    left: 340,
                    top: -20,
                  }}
                >
                  <Image
                    source={require("../../assets/images/cupu.png")}
                    style={{ width: 20, height: 20, marginTop: 5 }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ borderRadius: 50 }}>
                    <Image
                      source={{ uri: `https://picsum.photos/id/237/200/300` }}
                      style={[
                        styles.imageLogo,
                        { backgroundColor: "#0000", borderRadius: 20 },
                      ]}
                    />
                  </View>

                  <View
                    style={{
                      marginLeft: 5,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={
                        {
                          // borderBottomWidth: 0.5,
                          // borderBottomColor: "#c4c4c4",
                        }
                      }
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 14,
                          fontWeight: "400",
                          fontFamily: "ProximaNovaSemiBold",
                        }}
                      >
                        Macbook Pro
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 7,
                      }}
                    >
                      <Image
                        source={{ uri: `https://picsum.photos/id/237/200/300` }}
                        style={[
                          styles.imageLogo,
                          { backgroundColor: "#000", height: 30, width: 30 },
                        ]}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 10,
                          fontFamily: "ProximaNovaReg",
                          paddingHorizontal: 7,
                        }}
                      >
                        Fortune Bond
                      </Text>
                    </View>
                  </View>
                </View>
              </Left>
            </ListItem>
            <Text
              style={[
                {
                  fontFamily: "ProximaNovaSemiBold",
                  alignItems: "flex-start",
                  fontWeight: "400",
                  fontSize: 16,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  marginTop: 10,
                },
              ]}
            >
              Your enteries
            </Text>
            <List>
              <ListItem
                onPress={() => {
                  this.toggleEnt();
                }}
                style={styles.selectStyle}
              >
                <Left>
                  <Text
                    style={{
                      color: "black",
                      marginLeft: 20,
                      fontFamily: "ProximaNovaReg",
                    }}
                  >
                    4 enteries.
                  </Text>
                </Left>
                <Right>
                  {this.state.ent === true ? (
                    <Icon name="ios-arrow-dropup" style={{ color: "black" }} />
                  ) : (
                    <Icon
                      name="ios-arrow-dropdown"
                      style={{ color: "black" }}
                    />
                  )}
                </Right>
              </ListItem>
              <View
                style={{
                  backgroundColor: "#5B9DEE10",
                  marginTop: 5,
                  borderRadius: 6,
                }}
              >
                {["0", "1", "2", "3"].map((item, i) => {
                  return (
                    <ListItem key={i} style={[{ marginVertical: 5 }]}>
                      <Left>
                        <Text
                          style={{
                            color: "black",
                            marginLeft: 5,
                            fontSize: 11,
                            fontFamily: "ProximaNovaReg",
                          }}
                        >
                          Ticket No: {"TBT673998h"} {"\n"}
                          <Text
                            style={{
                              color: "black",
                              marginLeft: 5,
                              fontSize: 11,
                              fontFamily: "ProximaNovaReg",
                            }}
                          >
                            Reference ID: {"kjskbkjbksbksbkskjbksbskbsk"}
                          </Text>
                        </Text>
                      </Left>
                      <Right>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 11,
                            fontFamily: "ProximaNovaReg",
                          }}
                        >
                          N1000
                        </Text>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 11,
                            fontFamily: "ProximaNovaReg",
                          }}
                        >
                          {Moment("2020-09-28T09:40:37").format("hh:mm a")}
                        </Text>
                      </Right>
                    </ListItem>
                  );
                })}
              </View>
              <View style={{ marginTop: 10 }}>
                <Text
                  style={[
                    {
                      fontFamily: "ProximaNovaSemiBold",
                      alignItems: "flex-start",
                      fontSize: 20,
                      paddingHorizontal: 10,
                      marginTop: 10,
                    },
                  ]}
                >
                  Uptake claim instructions
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: 14,
                    marginLeft: 10,
                    // marginRight: 10,
                    marginTop: 10,
                    fontFamily: "ProximaNovaReg",
                  }}
                >
                  You are a winner! Please click the "Claim" button to claim
                  your win! You have <B>180 days</B> from the draw date to
                  claim.
                </Text>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    // this.props.navigation.navigate("Udetails", {
                    //   image: this.state.uptakes.imageUrl,
                    //   id: this.state.uptakes.drawId,
                    // })
                    this.setState({ drawTaken: true })
                  }
                  style={{
                    backgroundColor: "#FF6161",
                    borderRadius: 30,
                    paddingVertical: 15,
                    width: "95%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 30,
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
                    Claim
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => this.claimUptake()}
                  style={{
                    backgroundColor: "rgba(244,64,53,0.1)",
                    borderRadius: 20,
                    paddingVertical: 20,
                    width: "95%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 30,
                    padding: 10,
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "#f44035",
                      textAlign: "justify",
                      fontFamily: "ProximaNovaReg",
                      fontSize: 10,
                      lineHeight: 20,
                    }}
                  >
                    Uptake product draw winners will not be able to claim
                    winnings unless their identity has been confirmed
                  </Text>
                </TouchableOpacity>
              </View>
            </List>
          </Content>
        </View>

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
          transparent={false}
          visible={this.state.showPay}
          onRequestClose={() => {}}
        >
          <View style={{ marginTop: 300, backgroundColor: "white" }}>
            <View>
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontFamily: "ProximaNovaSemiBold",
                }}
              >
                Please Add a default card to complete this payment
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.hidePay();
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
                    fontFamily: "ProximaNovaBold",
                  }}
                >
                  Ok
                </Text>
              </TouchableOpacity>
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
          visible={this.state.imagez}
          onRequestClose={() => {
            this.toggleImagez();
          }}
        >
          <View
            style={{ marginTop: 100, alignSelf: "center", marginBottom: 40 }}
          >
            <View>
              <Image
                source={{ uri: `${this.state.imagezLink}` }}
                style={{
                  width: 327,
                  height: 393,
                  borderRadius: 30,
                  borderWidth: 0,
                  overflow: "hidden",
                }}
                onPress={() => {
                  this.toggleImagez();
                }}
              ></Image>
            </View>
          </View>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              textAlignVertical: "center",
            }}
            onPress={() => {
              this.toggleImagez();
            }}
          >
            <AntDesign
              name={"closecircleo"}
              color={"#fff"}
              style={{ fontSize: 30 }}
            />
          </Text>
        </Modal>
      </Container>
    );
  }
}

export default Won;
