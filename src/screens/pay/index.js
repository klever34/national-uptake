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
  ListItem,
  Textarea,
  Button,
  Spinner,
  Title,
  Right,
  Footer,
  FooterTab,
  Card,
  CardItem,
  Thumbnail,
  Switch,
  Radio,
} from "native-base";
import {
  ScrollView,
  View,
  Image,
  Modal,
  TouchableOpacity,
  BackHandler,
  TextInput,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import styles from "./style";

import axios from "axios";

// import { BlurView } from "@react-native-community/blur";

const robot = require("../../assets/images/rec.png");

const cardi = require("../../assets/images/cardi.png");

const coin = require("../../assets/images/coinss.png");

const no = require("../../assets/images/no.png");
const yes = require("../../assets/images/yes.png");

import "intl";

import "intl/locale-data/jsonp/en";

import Moment from "moment";
import AntDesign from "react-native-vector-icons/AntDesign";
import RBSheet from "react-native-raw-bottom-sheet";

class Pay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      email: "",
      baseURL: "http://oftencoftdevapi-test.us-east-2.elasticbeanstalk.com",
      message: "",
      default_message: "Please check your internet connection",
      showAlert: false,
      message_title: "",
      Spinner: false,
      tokenz: "",
      created_at: "",
      setFeedback: false,
      feebackMsg: "",
      pic: "https://ui-avatars.com/api/?format=png&name=pic",
      userData: {},
      cards: [],
      promos: [],
      showBlur: false,
      showYes: false,
      amount: "",
    };
  }

  goToPay() {
    this.props.navigation.navigate("Web", {
      email: this.state.userData.email,
      amount: this.state.amount,
      page: "Pay",
    });
    this.RBSheet.close();
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
      if (userProfile === null) {
        this.props.navigation.navigate("Login");
      } else {
        const userData = JSON.parse(userProfile);
        await this.setState({ userData });
        console.log(this.state.userData);
        this.getCardRequest();
        this.getPromoRequest();
      }
    } catch (error) {}
  };

  async getCardRequest() {
    this.setState({ Spinner: true });
    const token = await AsyncStorage.getItem("user_token");
    axios({
      method: "GET",
      url: `${this.state.baseURL}/api/payment/getcards/${this.state.userData.userid}`,
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
          console.log(error.response);
          this.setState({ Spinner: false });
          this.setState({ message: this.state.default_message });
          this.showAlert();
        }.bind(this)
      );
  }

  async getPromoRequest() {
    this.setState({ Spinner: true });
    const token = await AsyncStorage.getItem("user_token");

    axios({
      method: "GET",
      url: `${this.state.baseURL}/api/promocodes/userpromocodes/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            this.setState({ promos: response.data.data });
          } else {
            this.setState({ message: this.state.default_message });
            this.showAlert();
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          console.log(error.response);
          this.setState({ Spinner: false });
          this.setState({ message: this.state.default_message });
          this.showAlert();
        }.bind(this)
      );
  }

  async getPromoEnteries() {
    this.setState({ Spinner: true });
    const token = await AsyncStorage.getItem("user_token");

    axios({
      method: "GET",
      url: `${this.state.baseURL}/api/payment/promoentries/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            this.setState({ promos: response.data.data });
          } else {
            this.setState({ message: this.state.default_message });
            this.showAlert();
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          console.log(error.response);
          this.setState({ Spinner: false });
          this.setState({ message: this.state.default_message });
          this.showAlert();
        }.bind(this)
      );
  }

  async changeDefault(id) {
    this.setState({ Spinner: true });
    const token = await AsyncStorage.getItem("user_token");

    axios({
      method: "PUT",
      url: `${this.state.baseURL}/api/payment/makecarddefault/${this.state.userData.userid}/${id}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(
        function (response) {
          this.setState({ Spinner: false });

          if (response.data.status === "success") {
            this.getCardRequest();

            this.setState({ message: "Selected card has been set to default" });
            this.showYes();
          } else {
            this.setState({ message: this.state.default_message });
            this.showAlert();
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          console.log(error.response);
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
    // this.setState({
    //   showBlur: !this.state.showBlur,
    // });
  }

  hideAlert() {
    this.setState({
      showAlert: false,
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

  showFeedback() {
    this.setState({
      setFeedback: true,
    });
  }

  hideFeedback() {
    this.setState({
      setFeedback: false,
    });
  }

  sendFeedback() {
    this.setState({ setFeedback: false });

    axios({
      method: "POST",
      url: `${this.state.baseURL}/addFeedback`,
      data: {
        message: this.state.feebackMsg,
      },
      headers: {
        Authorization: this.state.tokenz,
      },
    })
      .then(function (response) {}.bind(this))
      .catch(function (error) {}.bind(this));
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content>
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
                style={{ fontSize: 24 }}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body></Body>
          </Header>

          <ScrollView>
            <View
              style={{ marginTop: 15, alignSelf: "center", marginBottom: 5 }}
            >
              <Text
                style={[
                  {
                    fontFamily: "ProximaNovaSemiBold",
                    alignItems: "flex-start",
                    fontSize: 20,
                    paddingHorizontal: 20,
                    marginLeft: 10,
                  },
                ]}
              >
                Payment options
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Credit")}
              >
                <View>
                  <Image style={{}} source={robot}></Image>
                  <View style={{ position: "absolute", marginTop: 40 }}>
                    <Text
                      style={{
                        marginLeft: 35,
                        marginTop: 15,
                        color: "white",
                        fontFamily: "ProximaNovaReg",
                      }}
                    >
                      Credit Bag
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginHorizontal: 5,
                        backgroundColor: "#80B3F2",
                        padding: 10,
                        borderRadius: 10,
                        width: 100,
                        marginLeft: 35,
                        marginTop: 15,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Image
                        source={coin}
                        style={{ marginRight: 5, height: 20, width: 20 }}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: "ProximaNovaAltBold",
                          color: "#fff",
                        }}
                      >
                        ₦0.00
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        flex: 1,
                      }}
                    >
                      <AntDesign
                        name={"rightcircleo"}
                        color={"#fff"}
                        style={{
                          fontSize: 22,
                          marginLeft: 340,
                          marginTop: -20,
                        }}
                      />
                    </View>

                    {/* <Button
                      rounded
                      style={[
                        styles.bottoz,
                        {
                          textTransform: "capitalise",
                          marginTop: 10,
                          paddingHorizontal: 5,
                        },
                      ]}
                    >
                      <Icon
                        name="ios-add-circle-outline"
                        style={{ color: "white" }}
                      />
                      <Text
                        style={{
                          color: "white",
                          marginLeft: -25,
                          fontFamily: "ProximaNovaAltBold",
                          textTransform: "capitalize",
                        }}
                      >
                        Add funds
                      </Text>
                    </Button> */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => this.RBSheet.open()}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#FF6161",
                          borderRadius: 30,
                          padding: 10,
                          width: "40%",
                          marginLeft: 30,
                          marginTop: 30,
                        }}
                      >
                        <Icon
                          name="ios-add-circle-outline"
                          style={{ color: "white" }}
                        />
                        <Text
                          style={{
                            color: "white",
                            marginLeft: 10,
                            fontFamily: "ProximaNovaReg",
                          }}
                        >
                          Add funds
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>

              <Text
                style={{
                  marginLeft: 0,
                  alignSelf: "flex-start",
                  fontFamily: "ProximaNovaSemiBold",
                  marginLeft: 20,
                }}
              >
                Your cards
              </Text>
            </View>

            <List>
              {this.state.cards.map((card, i) => {
                return (
                  <ListItem key={card.id} style={styles.selectStyle}>
                    <Left>
                      <Image
                        style={{}}
                        source={cardi}
                        style={{ marginLeft: 10, marginRight: 20 }}
                      ></Image>
                      <Text
                        style={{
                          fontSize: 16,
                          marginTop: 5,
                          fontFamily: "ProximaNovaSemiBold",
                        }}
                      >
                        * * * *{" "}
                      </Text>

                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: "ProximaNovaSemiBold",
                        }}
                      >
                        {card.last4}
                      </Text>
                    </Left>
                    <Right>
                      {/* <Radio
                        selected={card.default === true ? true : false}
                        color={"#5B9DEE"}
                        buttonColor={"transparent"}
                        selectedColor={"#5B9DEE"}
                        style={{
                          backgroundColor: "white",
                          borderRadius: 24,
                          borderWidth: 0,
                          borderColor: "white",
                        }}
                        onPress={() => this.changeDefault(card.id)}
                      /> */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >

                          <View
                            style={[
                              styles.radioButtonHolder,
                              { height: 20, width: 20, borderColor: "#fff" },
                            ]}
                          >
                            {/* {value === item ? ( */}
                            <View
                              style={[
                                styles.radioIcon,
                                {
                                  height: 10,
                                  width: 10,
                                  backgroundColor: card.default === true ? "#2ba2d3" : "fff",
                                },
                              ]}
                            />
                            {/* ) : null} */}
                          </View>
                        </View>
                    </Right>
                  </ListItem>
                );
              })}

              <ListItem
                style={[styles.selectStyle, { marginTop: 20 }]}
                onPress={() => this.props.navigation.navigate("Payment")}
              >
                <Left>
                  {/* <Icon
                    name="ios-add-circle-outline"
                    style={styles.selectIconStyle}
                    onPress={() => this.props.navigation.navigate("Payment")}
                  /> */}
                  <AntDesign
                    name={"pluscircleo"}
                    color={"#5B9DEE"}
                    style={{ fontSize: 16, paddingHorizontal: 15 }}
                    onPress={() => this.props.navigation.navigate("Payment")}
                  />
                  <Text
                    onPress={() => this.props.navigation.navigate("Payment")}
                    style={{
                      color: "#323F50",
                      fontSize: 16,
                      fontFamily: "ProximaNovaReg",
                    }}
                  >
                    Add a debit card
                  </Text>
                </Left>
                <Right>
                  <AntDesign
                    name={"rightcircleo"}
                    color={"#273444"}
                    style={{ fontSize: 16 }}
                    onPress={() => this.props.navigation.navigate("Payment")}
                  />
                </Right>
              </ListItem>
            </List>

            <Text
              style={{
                marginLeft: 20,
                alignSelf: "flex-start",
                marginTop: 20,
                fontFamily: "ProximaNovaSemiBold",
                marginTop: 25,
                marginBottom: 15,
              }}
            >
              Promotions
            </Text>

            <List style={{ marginBottom: 50 }}>
              {this.state.promos.map((promo, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#5B9DEE10",
                      padding: 10,
                      marginHorizontal: 17,
                      borderRadius: 30,
                    }}
                  >
                    <Icon name="ios-gift" style={styles.selectIconStyle} />
                    <View>
                      <Text
                        style={{
                          color: "#323F50",
                          fontSize: 16,
                          fontFamily: "ProximaNovaSemiBold",
                        }}
                      >
                        {promo.value}% Discount {"\n"}
                      </Text>
                      <View
                        style={{
                          marginTop: -15,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#323F50",
                            fontSize: 16,
                            fontFamily: "ProximaNovaReg",
                          }}
                        >
                          {/* Expires {Moment(promo.validUntil).format("hh:mm:ss a")} */}
                          Expires
                        </Text>
                        <Text
                          style={{
                            color: "#323F50",
                            fontSize: 16,
                            fontFamily: "ProximaNovaSemiBold",
                            paddingHorizontal: 5,
                          }}
                        >
                          {/* Expires {Moment(promo.validUntil).format("hh:mm:ss a")} */}
                          {promo.validUntil.split("T")[0]}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  // <ListItem key={i} style={styles.selectStyle}>
                  //   <Left>
                  //     <Icon name="ios-gift" style={styles.selectIconStyle} />
                  //     <View>

                  //     </View>
                  //   </Left>
                  // </ListItem>
                );
              })}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#5B9DEE10",
                  padding: 10,
                  marginHorizontal: 17,
                  borderRadius: 30,
                  paddingHorizontal: 30,
                  marginTop: 20,
                }}
              >
                <Image
                  source={require("../../assets/images/ticket_red.png")}
                  style={{ height: 15, width: 30, marginVertical: 10 }}
                />
                <View style={{ paddingHorizontal: 15 }}>
                  <Text
                    style={{
                      color: "#323F50",
                      fontSize: 16,
                      fontFamily: "ProximaNovaSemiBold",
                    }}
                  >
                    Promo Entries
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: "#323F50",
                        fontSize: 16,
                        fontFamily: "ProximaNovaReg",
                      }}
                    >
                      {/* Expires {Moment(promo.validUntil).format("hh:mm:ss a")} */}
                      2 Entries
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#5B9DEE10",
                  padding: 10,
                  marginHorizontal: 17,
                  borderRadius: 30,
                  paddingHorizontal: 10,
                  marginTop: 20,
                  paddingVertical: 20,
                }}
                onPress={() => this.props.navigation.navigate("Promo")}
              >
                <Icon
                  name="ios-add-circle-outline"
                  style={[
                    styles.selectIconStyle3,
                    { color: "#5B9DEE", marginTop: -1 },
                  ]}
                />
                <View style={{ paddingHorizontal: 5 }}>
                  <Text
                    style={{
                      color: "#323F50",
                      fontSize: 16,
                      fontFamily: "ProximaNovaReg",
                    }}
                  >
                    Add a promo code
                  </Text>
                </View>
              </TouchableOpacity>

              {/* <ListItem style={styles.selectStylex}>
                <Left>
                  <Icon
                    name="ios-add-circle-outline"
                    style={[
                      styles.selectIconStyle3,
                      { color: "#5B9DEE", marginTop: -1 },
                    ]}
                    onPress={() => this.props.navigation.navigate("Promo")}
                  />
                  <Text
                    onPress={() => this.props.navigation.navigate("Promo")}
                    style={{
                      color: "#323F50",
                      fontFamily: "ProximaNovaSemiBold",
                      fontSize: 16,
                    }}
                  >
                    Add a promo code
                  </Text>
                </Left>
                <Right>
                  <Icon
                    name="ios-arrow-dropright"
                    style={{ color: "#000" }}
                    onPress={() => this.props.navigation.navigate("Promo")}
                  />
                </Right>
              </ListItem> */}
            </List>
          </ScrollView>
        </Content>

        {this.state.showBlur === true ? (
          <BlurView
            style={styles.bluring}
            reducedTransparencyFallbackColor="#E5E5E5"
            blurType="dark"
            blurAmount={1}
          />
        ) : (
          <View></View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.Spinner}
          onRequestClose={() => {}}
        >
          <View style={{ marginTop: 300 }}>
            <View>
              <Spinner color="red" />
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
                     Success! 👌🏾
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
                    {this.state.message}
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
                        this.hideYes();;
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
                    Could not set card as default
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

        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={250}
          openDuration={250}
          closeOnDragDown={true}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 20,
              paddingRight: 20,
              paddingLeft: 20,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            },
          }}
        >
          <ScrollView>
            <Text
              style={{
                fontFamily: "ProximaNovaSemiBold",
                fontSize: 18,
                color: "#000",
                textAlign: "center",
                marginTop: 5,
                marginBottom: 5,
              }}
            >
              How much would you like to pay?
            </Text>
            <View
              style={{
                borderColor: "#c4c4c4",
                borderWidth: 0.5,
                paddingHorizontal: 7,
                borderRadius: 20,
                marginVertical: 10,
              }}
            >
              <TextInput
                placeholder={"Enter amount"}
                style={{ fontFamily: "ProximaNovaReg" }}
                onChangeText={(text) => this.setState({ amount: text })}
              />
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.goToPay()}
                style={{
                  backgroundColor: "#FF6161",
                  borderRadius: 30,
                  paddingVertical: 15,
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 15,
                  marginBottom: 10,
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
                  Fund
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </RBSheet>
      </Container>
    );
  }
}

export default Pay;
