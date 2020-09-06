import React, {Component} from 'react';
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
} from 'native-base';
import {
  ImageBackground,
  View,
  Image,
  Modal,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
import axios from 'axios';
import Moment from 'moment';
// import { BlurView } from "@react-native-community/blur";
const sub = require('../../assets/images/sub.png');
const inputImage = require('../../assets/images/inputDrop.png');
const cardi = require('../../assets/images/cardi.png');
const tem = require('../../assets/images/tem.png');
import AsyncStorage from '@react-native-community/async-storage';
const no = require('../../assets/images/no.png');
import RBSheet from 'react-native-raw-bottom-sheet';
import {NavigationEvents} from 'react-navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import PaystackWebView from 'react-native-paystack-webview';

class GuestUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      baseURL: 'https://dragonflyapi.nationaluptake.com/',
      message: '',
      default_message: 'Please check your internet connection',
      showAlert: false,
      message_title: '',
      Spinner: false,
      active: false,
      drawId: '',
      page: 1,
      pagination: 10,
      Timage: 'https://i.ibb.co/DfnLpNS/tem.png',
      uptakes: {},
      value: 1,
      userData: {},
      logged: '',
      cards: [],
      items: [],
      showPay: false,
      imagez: false,
      imagezLink: '',
      showBlur: false,
      showView: false,
      networkStatus: null,
      dynamicHeight: 0.5,
      swapIcon: true,
      paystackMode: false,
      promotionalData: null,
      showIndicator: false,
      showSuccess: false,
      discountData: null,
      chosenItem: 'Choose Payment Option',
      payIndicator: false,
      trxRef: null,
      creditBagData: null,
      totalAmt: 0,
      currentDiscountData: null,
      code: '',
      codeIndicator: false,
      promoData: {},
      showPromo: false,
      showRefer: false,
      buttonAmount: 0,
      chosenItemActive: false,
      discount: 0,
      defaultAmount: null,
    };
  }

  async componentDidMount() {
    const vm = this;
    await this.getToken();
    NetInfo.addEventListener((state) => {
      console.log(state.isConnected);
      vm.setState({networkStatus: state.isConnected});
      this.fetchApi();
    });
    this.fetchApi();
  }

  fetchApi() {
    const vm = this;
    Promise.all([this._upTake()])
      .then(async (results) => {
        let uptakes = results[0].data.draw;
        let items = results[0].data.draw.items;
        this.setState({uptakes: uptakes});
        this.setState({items: items});
        this.setState({showView: true});
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }

  async setInitialAmount() {
    let defAmt = this.state.uptakes.ticketAmount * this.state.value;
    this.setState({defaultAmount: defAmt});
    this.setState({
      buttonAmount: this.state.uptakes.ticketAmount * this.state.value,
    });
  }

  async setDiscountAmount(amt) {
    this.setState({
      buttonAmount:
        this.state.uptakes.ticketAmount * this.state.value * (amt / 100),
    });
  }

  async setPaystackAmount() {
    this.setState({
      buttonAmount: this.state.uptakes.ticketAmount * this.state.value,
    });
  }

  async setCodeAmount() {
    this.setState({
      buttonAmount: this.state.uptakes.ticketAmount * this.state.value,
    });
  }

  async getPromoCode(text) {
    // this.setState({ code: text });
    if (text.length < 8) return;
    this.setState({codeIndicator: true});
    try {
      const token = await AsyncStorage.getItem('user_token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(
        `${this.state.baseURL}/api/account/getcodeinfo/${this.state.userData.userid}/${text}`,
      );
      let promoData = response.data.data;
      // console.log(promoData);
      if (promoData.codeType === 'Promo') {
        this.setState({showPromo: true});
        this.setState({showRefer: false});
      } else if (promoData.codeType === 'Referral') {
        this.setState({showRefer: true});
        this.setState({showPromo: false});
      }
      this.setDiscountAmount(promoData.value);
      this.choseonOption('Code');
      this.setState({promoData: promoData});
      console.log(this.state.promoData);
      this.setState({codeIndicator: false});
    } catch (error) {
      console.log(error);
    }
  }

  getToken = async () => {
    const vm = this;
    const image = this.props.route.params.image;
    const drawId = this.props.route.params.id;
    const userProfile = await AsyncStorage.getItem('userData');
    console.log(image);
    console.log(drawId);
    this.setState({image});
    this.setState({drawId});
  };

  _upTake = async () => {
    const token = await AsyncStorage.getItem('user_token');
    // this.setState({ Spinner: true });

    return axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/draws/getdraw/${this.state.drawId}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // this.setState({ Spinner: false });
  };

  _creditBag = async () => {
    const token = await AsyncStorage.getItem('user_token');
    // this.setState({ Spinner: true });

    return axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/account/creditbag/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // this.setState({ Spinner: false });
  };

  async payUptake() {
    this.setState({showIndicator: true});
    const token = await AsyncStorage.getItem('user_token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (this.state.uptakes.type === 'Promotional') {
      let drawData = {
        userId: this.state.userData.userid,
        drawId: this.state.drawId,
        totalAmount: 0,
        quantity: 0,
        cardId: 0,
        code: '',
        codeType: '',
        paymentOption: 0,
      };

      console.log(drawData);
      try {
        const response = await axios.post(
          `${this.state.baseURL}/api/payment/initialize`,
          drawData,
        );
        console.log(response.data);
        this.setState({showIndicator: false});
        this.setState({message: response.data.responseMessage});
        this.setState({showSuccess: true});
      } catch (error) {
        this.setState({showIndicator: false});
        console.log(error.response.data.responseMessage);
        this.setState({message: error.response.data.responseMessage});
        this.setState({showAlert: true});
      }
    } else {
      try {
        const response = await axios.post(
          `${this.state.baseURL}/api/payment/initialize`,
          {
            userId: this.state.userData.userid,
            drawId: this.state.drawId,
            totalAmount: this.state.uptakes.ticketAmount * this.state.value,
            quantity: this.state.value,
            cardId: this.state.cards.id,
            code: '',
            codeType: '',
            paymentOption: 3,
          },
        );
        console.log(response.data.data);
        this.setState({showIndicator: false});
      } catch (error) {
        this.setState({message: error.response.data.responseMessage});
        this.setState({showAlert: false});
      }
    }
  }


  choseonOption = (item) => {
    this.setState({chosenItem: item});
    this.setState({chosenItemActive: true});
    this.RBSheet.close();
  };
  async initializePaystack() {

  }

  async paidUptake() {
    // this.setState({ Spinner: true });
    axios({
      method: 'POST',
      url: `${this.state.baseURL}/api/payment/initialize`,
      data: {
        userId: this.state.userData.userid,
        drawId: this.state.drawId,
        totalAmount: this.state.uptakes.ticketAmount * this.state.value,
        quantity: this.state.value,
        cardId: this.state.cards.id,
        code: '',
        codeType: '',
        paymentOption: 3,
      },
    })
      .then(
        function (response) {
          this.setState({Spinner: false});

          this.props.navigation.navigate('Suc', {drawId: this.state.drawId});
        }.bind(this),
      )
      .catch(
        function (error) {
          // this.setState({ Spinner: false });
          if (error.response.data.status === 'failed') {
            this.setState({message: error.response.data.responseMessage});
            this.showAlert();
          } else {
            this.setState({message: this.state.default_message});
            this.showAlert();
          }
        }.bind(this),
      );
  }

  _getCardRequest = async () => {
    // this.setState({ Spinner: true });

    const token = await AsyncStorage.getItem('user_token');
    return axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/payment/getdefaultcard/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  _calculateDiscount = async () => {
    // this.setState({ Spinner: true });

    const token = await AsyncStorage.getItem('user_token');
    return axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/account/discount/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  _getPromoEnteries = async () => {
    const token = await AsyncStorage.getItem('user_token');
    return axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/payment/promoentries/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
    // this.setState({
    //   showBlur: !this.state.showBlur,
    // });
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
    console.log(this.state.value);
    let preVal = this.state.value + 1;
    this.setState({
      value: preVal,
    });
    let data = this.state.defaultAmount * preVal;
    this.setState({buttonAmount: data});
  };

  ducValue = () => {
    console.log(this.state.value);
    if (this.state.value == 1) return;
    let preVal = this.state.value - 1;
    this.setState({
      value: preVal,
    });
    let data = this.state.defaultAmount * preVal;
    this.setState({buttonAmount: data});
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
      <Text style={{fontFamily: 'ProximaNovaBold', color: '#fff'}}>
        {props.children}
      </Text>
    );
    const C = (props) => (
      <Text style={{fontFamily: 'ProximaNovaBold', color: '#000'}}>
        {props.children}
      </Text>
    );

    const changeHeight = () => {
      let testSwap = !this.state.swapIcon;
      this.setState({swapIcon: testSwap});
      if (this.state.dynamicHeight === 0.5) {
        this.setState({dynamicHeight: 0.8});
      } else {
        this.setState({dynamicHeight: 0.5});
      }
    };

    const uuidv4 = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
        c,
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    if (this.state.networkStatus) {
      if (this.state.showView) {
        return (
          <Container style={{backgroundColor: 'transparent'}}>
            {/* <NavigationEvents onDidFocus={() => this.getToken()} /> */}
            <ImageBackground
              source={{
                uri: this.state.image ? this.state.image : this.state.Timage,
              }}
              style={styles.imageContainer}
            />

            <View
              style={{
                flexDirection: 'row',
                marginTop: 40,
                marginLeft: 20,
                position: 'absolute',
                marginRight: 20,
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#555558',
                }}>
                <AntDesign
                  name={'closecircleo'}
                  color={'#fff'}
                  style={{fontSize: 23}}
                />
              </TouchableOpacity>

              <Right></Right>
            </View>

            <View
              ref={(img) => {
                this.backgroundImage = img;
              }}
              source={inputImage}
              resizeMode="stretch"
              style={[
                styles.image2,
                {
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                  backgroundColor: 'white',
                  height: deviceHeight * this.state.dynamicHeight,
                },
              ]}>
              <View style={{marginLeft: 10, marginTop: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      {
                        fontFamily: 'ProximaNovaSemiBold',
                        alignItems: 'flex-start',
                        fontSize: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        marginLeft: 5,
                      },
                    ]}>
                    {this.state.uptakes.name}
                  </Text>
                  <TouchableOpacity
                    style={{marginRight: 30}}
                    onPress={() => changeHeight()}>
                    <AntDesign
                      name={this.state.swapIcon ? 'arrowsalt' : 'shrink'}
                      color={'#000'}
                      style={{fontSize: 23}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Content
                padder
                style={{
                  borderRadius: 30,
                  borderColor: 'white',
                  borderWidth: 5,
                  shadowColor: 'white',
                  flex: 1,
                }}>
                <Button
                  transparent
                  rounded
                  style={{
                    backgroundColor: '#00000030',
                    height: 30,
                    marginTop: -10,
                    marginLeft: 10,
                  }}>
                  <Text style={{color: '#FFFFFF', fontSize: 12}}>
                    {Moment(this.state.uptakes.drawDate).format('hh : mm : ss')}
                  </Text>
                </Button>
                <Text
                  style={[
                    {
                      fontFamily: 'ProximaNovaSemiBold',
                      alignItems: 'flex-start',
                      fontWeight: '400',
                      fontSize: 20,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginTop: 10,
                    },
                  ]}>
                  Description
                </Text>
                <Text
                  style={{
                    color: '#273444',
                    fontSize: 14,
                    marginLeft: 10,
                    marginRight: 10,
                    fontFamily: 'ProximaNovaReg',
                    paddingVertical: 5,
                  }}>
                  {this.state.uptakes.description}
                </Text>

                <View>
                  {this.state.items.length > 1 && (
                    <Text
                      style={[
                        {
                          fontFamily: 'ProximaNovaSemiBold',
                          fontWeight: '400',
                          alignItems: 'flex-start',
                          fontSize: 20,
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                        },
                      ]}>
                      Uptakes
                    </Text>
                  )}

                  <List>
                    {this.state.items.length > 1 &&
                      this.state.items.map((item, i) => {
                        return (
                          <ListItem
                            key={i}
                            style={styles.selectStyle2}
                            onPress={() => {
                              this.toggleImagez(item.imageUrl);
                            }}>
                            <Left>
                              <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{borderRadius: 50}}>
                                  <Image
                                    source={{uri: `${item.imageUrl}`}}
                                    style={styles.imageLogo}
                                  />
                                </View>

                                <View
                                  style={{
                                    marginLeft: 20,
                                    flex: 1,
                                    flexDirection: 'row',
                                  }}>
                                  <Text
                                    style={{
                                      color: 'black',
                                      fontSize: 14,
                                      fontWeight: '400',
                                      fontFamily: 'ProximaNovaSemiBold',
                                    }}>
                                    {item.name}
                                  </Text>
                                </View>
                              </View>
                            </Left>
                          </ListItem>
                        );
                      })}
                  </List>
                </View>
                <View>
                  <View
                    style={{
                      marginTop: 15,
                      alignSelf: 'center',
                      marginBottom: 5,
                      width: '100%',
                      flex: 1,
                    }}>
                    <Image
                      style={{resizeMode: 'contain'}}
                      source={require('../../assets/images/bg.png')}
                      // style={styles.showsm}
                      style={{width: '100%', borderRadius: 30}}></Image>

                    <View
                      style={{
                        position: 'absolute',
                        marginTop: 35,
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        style={{
                          // backgroundColor: "#74A9EB",
                          marginLeft: 32,
                          width: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 24,
                          paddingVertical: 5,
                          // paddingHorizontal: 2,
                          marginLeft: 33,
                          marginTop: 5,
                        }}>
                        {/* {(this.state.uptakes.ticketAmount !== null || this.state.uptakes.ticketAmount.length !== undefined) && ( */}
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 20,
                            fontFamily: 'ProximaNovaBold',
                          }}>
                          ₦{this.state.uptakes.ticketAmount}
                        </Text>
                        {/* )} */}
                      </TouchableOpacity>

                      {this.state.uptakes.type === 'Paid' && (
                        <View style={{marginTop: 5, marginRight: 40}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 13,
                                marginLeft: 40,
                                marginRight: 80,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                fontFamily: 'ProximaNovaReg',
                              }}>
                              You do not have{' '}
                              <B>
                                any entry
                              </B>
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 13,
                              fontFamily: 'ProximaNovaReg',
                              marginLeft: 80,
                            }}>
                            for this uptake
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <View>
                  <View style={{alignSelf: 'center', marginBottom: 5}}></View>

                  <View
                    style={{
                      marginTop: 20,
                      flexDirection: 'row',
                      marginBottom: 10,
                      opacity:
                        this.state.uptakes.type === 'Promotional' ? 0.3 : 1,
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 14,
                        marginLeft: 10,
                        position: 'absolute',
                        width: 190,
                        fontFamily: 'ProximaNovaReg',
                      }}>
                      How many entries would you like to buy?
                    </Text>

                    <Right></Right>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        backgroundColor: '#5B9DEE10',
                        padding: 10,
                        marginRight: 10,
                        borderRadius: 30,
                        width: '45%',
                        paddingVertical: 16,
                      }}
                      activeOpacity={0.8}>
                      <AntDesign
                        name={'minuscircleo'}
                        color={'#FF6161'}
                        style={{fontSize: 24, marginRight: 10}}
                        onPress={() => {
                          this.state.uptakes.type === 'Promotional'
                            ? null
                            : this.ducValue();
                        }}
                      />
                      <Text
                        style={{
                          color: 'black',
                          textAlign: 'center',
                          alignSelf: 'center',
                          fontFamily: 'ProximaNovaReg',
                          fontSize: 24,
                          marginRight: -4,
                        }}>
                        {this.state.value}
                      </Text>
                      <AntDesign
                        name={'pluscircleo'}
                        color={'#FF6161'}
                        style={{fontSize: 24, marginLeft: 20}}
                        onPress={() => {
                          this.state.uptakes.type === 'Promotional'
                            ? null
                            : this.addValue();
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      {
                        fontFamily: 'ProximaNovaSemiBold',
                        alignItems: 'flex-start',
                        fontWeight: '400',
                        fontSize: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginTop: 10,
                      },
                    ]}>
                    Payment Option
                  </Text>

                  <View style={{marginTop: -15}}>
                    <List>
                      <ListItem
                        style={[styles.selectStyle, {marginBottom: 15}]}
                        onPress={() => this.props.navigation.push('Login')}>
                        <Left style={{paddingVertical: 3}}>
                          <Text
                            style={{
                              fontSize: 16,
                              marginLeft: 13,
                              fontFamily: 'ProximaNovaReg',
                            }}>
                            Choose Payment Option
                          </Text>
                        </Left>
                        <Right>
                          <AntDesign
                            name={'downcircleo'}
                            color={'#000'}
                            style={{fontSize: 16}}
                            onPress={() => this.props.navigation.push('Login')}
                          />
                        </Right>
                      </ListItem>
                    </List>
                  </View>
                </View>

                {this.state.uptakes.type === 'Promotional' ? (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.push('Login');
                      }}
                      style={{
                        backgroundColor: '#FF6161',
                        borderRadius: 30,
                        paddingVertical: 15,
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 15,
                        marginBottom: 30,
                        // opacity: 0.4,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          alignSelf: 'center',
                          fontFamily: 'ProximaNovaReg',
                        }}>
                        {this.state.uptakes.type === 'Promotional'
                          ? 'Pay'
                          : 'Buy Ticket'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.push('Login');
                      }}
                      style={{
                        backgroundColor: '#FF6161',
                        borderRadius: 30,
                        paddingVertical: 18,
                        width: '97%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 15,
                        marginBottom: 30,
                        marginRight: 10,
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          alignSelf: 'center',
                          fontFamily: 'ProximaNovaReg',
                        }}>
                        Pay
                      </Text>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          alignSelf: 'center',
                          fontFamily: 'ProximaNovaBold',
                          paddingLeft: 4,
                        }}>
                        ₦{this.state.uptakes.ticketAmount * this.state.value}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View></View>
              </Content>
            </View>
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
              onRequestClose={() => {}}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <View
                  style={
                    {
                      // marginTop: 70,
                      // marginLeft: 20,
                      // marginRight: 20,
                      // borderWidth: 10,
                      // borderColor: "white",
                    }
                  }>
                  <View
                    style={{
                      alignSelf: 'center',
                      backgroundColor: 'white',
                      width: 375,
                      borderRadius: 30,
                    }}>
                    <Image
                      source={require('../../assets/images/xbox.png')}
                      resizeMode="contain"
                      style={{
                        position: 'relative',
                        width: 72,
                        height: 72,
                        alignSelf: 'center',
                        marginTop: 50,
                      }}></Image>
                    <View style={{marginTop: 30, alignSelf: 'center'}}>
                      <Text
                        style={{
                          color: '#273444',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          fontSize: 20,
                          fontFamily: 'ProximaNovaSemiBold',
                        }}>
                        Something went wrong 😔
                      </Text>
                      <Text
                        style={{
                          color: '#273444',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          marginTop: 20,
                          marginLeft: 10,
                          marginRight: 10,
                          fontSize: 15,
                          fontFamily: 'ProximaNovaReg',
                          marginBottom: 10,
                        }}>
                        {this.state.message}
                      </Text>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 50,
                          width: '100%',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({showAlert: false});
                          }}
                          style={{
                            backgroundColor: '#FF6161',
                            borderRadius: 30,
                            paddingVertical: 15,
                            width: 330,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 35,
                            // opacity: 0.4,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              alignSelf: 'center',
                              fontFamily: 'ProximaNovaReg',
                            }}>
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
              visible={this.state.Spinner}
              onRequestClose={() => {}}>
              <View style={{marginTop: 300}}>
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
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <View
                  style={{
                    marginTop: 100,
                    alignSelf: 'center',
                    marginBottom: 40,
                  }}>
                  <View>
                    <Image
                      source={{uri: `${this.state.imagezLink}`}}
                      style={{
                        width: 327,
                        height: 393,
                        borderRadius: 30,
                        borderWidth: 0,
                        overflow: 'hidden',
                      }}
                      onPress={() => {
                        this.toggleImagez();
                      }}></Image>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}
                  onPress={() => {
                    this.toggleImagez();
                  }}>
                  <AntDesign
                    name={'closecircleo'}
                    color={'#fff'}
                    style={{fontSize: 30}}
                  />
                </Text>
              </View>
            </Modal>
          </Container>
        );
      } else {
        return (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              backgroundColor: '#fff',
            }}>
            <ActivityIndicator
              size="large"
              color={'#FF6161'}
              // style={{paddingHorizontal: 5, marginTop: -3}}
            />
          </View>
        );
      }
    } else {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            backgroundColor: '#fff',
          }}>
          {/* <SvgXml width="100" height="100" xml={network} /> */}
          <Text
            style={{
              fontFamily: 'ProximaNovaSemiBold',
              fontSize: 16,
              color: '#979797',
              paddingVertical: 20,
              opacity: this.state.networkStatus ? 1 : 0,
            }}>
            There is no internet connection. Please check your internet
            connection and try again.
          </Text>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={() => this.refresh()}>
            <Text style={{color: '#fff', fontFamily: 'ProximaNovaReg'}}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    width: deviceWidth,
    height: 393,
    backgroundColor: 'transparent',
  },
  image2: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    // backgroundColor: '#fff',
    // top: 60
  },
  imageLogo: {
    width: 60,
    height: 60,
    marginLeft: 10,
    borderRadius: 60,
  },
  loginButton: {
    backgroundColor: '#792579',
    alignSelf: 'center',
    marginTop: deviceHeight * 0.8,
  },
  textInput: {
    color: '#273444',
    marginTop: 0,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
  },
  textInput2: {
    color: '#273444',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  textInput3: {
    color: '#121212',
    marginTop: 20,
    alignSelf: 'center',
    fontSize: 12,
  },
  inputStyle: {
    alignSelf: 'center',
    width: deviceWidth * 0.9,
    marginTop: 30,
  },
  bottonStyle: {
    backgroundColor: '#F36C24',
    alignSelf: 'center',
    marginTop: 30,
    width: deviceWidth * 0.4,
    borderRadius: 100,
    textAlign: 'center',
  },
  bottonStyle2: {
    backgroundColor: '#5B9DEE10',
    alignSelf: 'center',
    width: deviceWidth * 0.4,
    borderRadius: 100,
    justifyContent: 'center',
  },
  selectStyle: {
    marginTop: 30,
    backgroundColor: '#5B9DEE10',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#5B9DEE10',
    marginLeft: 0,
    marginRight: 10,
  },
  selectStyle2: {
    marginTop: 10,
    backgroundColor: '#5B9DEE10',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#5B9DEE10',
    marginLeft: 0,
    marginRight: 10,
  },
  selectIconStyle: {
    color: '#5B9DEE',
    marginLeft: 20,
    marginRight: 10,
  },
  bottonStyle3: {
    backgroundColor: '#FF6161',
    alignSelf: 'center',
    marginTop: 30,
    width: deviceWidth * 0.87,
    borderRadius: 100,
    textAlign: 'center',
    marginBottom: 50,
  },
  showsm: {
    width: deviceWidth * 0.8,
    resizeMode: 'contain',
  },
  buttonimg: {
    backgroundColor: '#00000030',
  },
  bluring: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    right: 0,
    width: deviceWidth,
    height: deviceHeight,
  },
  imageLogo2: {
    position: 'relative',
    width: 72,
    height: 72,
    alignSelf: 'center',
    marginTop: 40,
  },
  bottonStylet: {
    backgroundColor: '#FF6161',
    alignSelf: 'center',
    marginTop: 30,
    width: deviceWidth * 0.82,
    borderRadius: 100,
    textAlign: 'center',
    marginBottom: 30,
  },
  radioButton: {
    // flexDirection: 'row',
    margin: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  radioButtonHolder: {
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioIcon: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GuestUser;
