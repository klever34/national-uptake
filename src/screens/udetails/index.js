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
} from 'react-native';

import styles from './style';

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
const deviceHeight = Dimensions.get('window').height;
import {NavigationEvents} from 'react-navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import PaystackWebView from 'react-native-paystack-webview';

class Udetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      baseURL: 'http://oftencoftdevapi-test.us-east-2.elasticbeanstalk.com',
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
    await this.getToken();
    const vm = this;
    NetInfo.addEventListener((state) => {
      console.log(state.isConnected);
      vm.setState({networkStatus: state.isConnected});
      this.fetchApi();
    });
    this.fetchApi();
  }

  fetchApi() {
    const vm = this;
    Promise.all([
      this._upTake(),
      this._getCardRequest(),
      this._getPromoEnteries(),
      this._calculateDiscount(),
      this._creditBag(),
    ])
      .then(async (results) => {
        let uptakes = results[0].data.draw;
        let items = results[0].data.draw.items;
        this.setState({uptakes: uptakes});
        this.setState({items: items});
        // console.log(results[3].data);
        this.setState({promotionalData: results[2].data});
        this.setState({discountData: results[3].data});
        console.log(results[3].data);
        this.setState({creditBagData: results[4].data});
        this.setInitialAmount();
        if (results[1].data.status === 'success') {
          this.setState({cards: results[1].data.data});
        } else {
          this.showAlert();
        }
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
    try {
      const vm = this;
      const image = this.props.route.params.image;
      const drawId = this.props.route.params.id;
      const userProfile = await AsyncStorage.getItem('userData');

      this.setState({image});
      this.setState({drawId});

      if (userProfile === null) {
        this.props.navigation.navigate('Login');
      } else {
        this.setState({logged: 'yes'});
        const userData = JSON.parse(userProfile);
        console.log(userData);
        this.setState({userData});
      }
    } catch (error) {
      this.props.navigation.navigate('Available');
    }
  };

  _upTake = async () => {
    const token = await AsyncStorage.getItem('user_token');
    // this.setState({ Spinner: true });

    return axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/draws/getdraw/${this.state.userData.userid}/${this.state.drawId}`,
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
  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    );
  }

  choseonOption = (item) => {
    this.setState({chosenItem: item});
    this.setState({chosenItemActive: true});
    this.RBSheet.close();
  };
  async initializePaystack() {
    // console.log(this.state.uptakes.ticketAmount);
    // console.log(this.state.value);
    // console.log(this.state.discountData.data.value )
    // console.log(this.state.uptakes.ticketAmount);
    console.log(this.state.chosenItem);
    var totalMoney = 0;
    if (!this.state.chosenItemActive) {
      this.setState({showAlert: true});
      this.setState({message: "You haven't chosen a payment plan"});
      return;
    }
    this.setState({payIndicator: true});
    // try {
    //   if (this.state.discountData.data !== null) {
    //     var res =
    //       this.state.uptakes.ticketAmount * this.state.value -
    //       (this.state.discountData.data.value / 100) *
    //         this.state.uptakes.ticketAmount *
    //         this.state.value;
    //     this.setState({ totalAmt: res });
    //   } else if (this.state.promoData.value !== null) {
    //     var res =
    //       this.state.uptakes.ticketAmount *
    //       this.state.value *
    //       (this.state.promoData.value / 100);
    //     console.log(this.state.uptakes.ticketAmount);
    //     console.log(res);
    //     totalMoney = res;
    //     this.setState({ totalAmt: res });
    //     console.log(this.state.totalAmt);
    //   } else {
    //     var res = this.state.uptakes.ticketAmount * this.state.value;
    //     console.log(this.state.uptakes.ticketAmount);
    //     console.log(res);
    //     totalMoney = res;
    //     this.setState({ totalAmt: res });
    //     console.log(this.state.totalAmt);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    // this.setState({
    //   totalAmt:
    //     this.state.discountData.data !== null
    //       ? this.state.uptakes.ticketAmount * this.state.value -
    //         (this.state.discountData.data.value / 100) *
    //           this.state.uptakes.ticketAmount *
    //           this.state.value
    //       : this.state.uptakes.ticketAmount * this.state.value,
    // });
    // console.log(
    //   this.state.uptakes.ticketAmount * this.state.value - (this.state.discountData.data.value / 100) * this.state.uptakes.ticketAmount * this.state.value
    // );
    // console.log(this.state.uptakes.ticketAmount * this.state.value);

    // console.log(this.state.totalAmt);
    if (this.state.chosenItem === 'Paystack') {
      // this.initializePaystack();
      // this.setState({paystackMode: true})

      try {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer sk_test_fc780c4bc0264bd7dd194dc92afc1fb3afa37c94`;
        try {
          let paymentData = {
            userId: this.state.userData.userid,
            drawId: this.state.drawId,
            totalAmount: this.state.buttonAmount,
            quantity: this.state.value,
            cardId: 0,
            code: '',
            codeType: '',
            paymentOption: 2,
            reference: '',
          };
          const token = await AsyncStorage.getItem('user_token');
          const res = await axios.post(
            `${this.state.baseURL}/api/payment/initialize`,
            paymentData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (res.data.status == 'success') {
            // console.log("successful");
            this.props.navigation.push('Web', {
              email: this.state.cards.email,
              amount: this.state.buttonAmount,
              page: 'Details',
            });
            this.setState({payIndicator: false});
          } else {
            this.setState({message: error.res.data.responseMessage});
            this.setState({showAlert: true});
          }
          // this.setState({payIndicator: false});
          // this.props.navigation.push("Available ");
        } catch (error) {
          this.setState({payIndicator: false});
          console.log(error);
          // this.setState({ message: error.response.data.responseMessage });
          // this.setState({ showAlert: true });
        }
      } catch (error) {
        console.log(error);
        this.setState({payIndicator: false});
      }
    } else if (this.state.chosenItem === 'Credit Bag') {
      //     var res =
      //       this.state.uptakes.ticketAmount * this.state.value -
      //       (this.state.discountData.data.value / 100) *
      //         this.state.uptakes.ticketAmount *
      //         this.state.value;
      //     this.setState({ totalAmt: res });
      if (this.state.buttonAmount > this.state.creditBagData.data) {
        this.setState({message: 'Not enough fund in Credit bag'});
        this.setState({showAlert: true});
        this.setState({payIndicator: false});

        return;
      }
      try {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer sk_test_fc780c4bc0264bd7dd194dc92afc1fb3afa37c94`;

        let drawData = {
          userId: this.state.userData.userid,
          drawId: this.state.drawId,
          totalAmount: this.state.buttonAmount,
          quantity: this.state.value,
          cardId: 0,
          code: '',
          codeType: '',
          paymentOption: 1,
          reference: null,
        };

        // console.log(drawData);
        try {
          const token = await AsyncStorage.getItem('user_token');
          const res = await axios.post(
            `${this.state.baseURL}/api/payment/initialize`,
            drawData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          console.log(res.data);
          if (res.data.status == 'success') {
            this.setState({showSuccess: true});
            // this.setState({ message: res.data.responseMessage });
            this.props.navigation.navigate('Invoice');
            this.setState({payIndicator: false});
          } else {
            this.setState({message: error.response.data.responseMessage});
            this.setState({showAlert: true});
          }
          this.setState({payIndicator: false});
        } catch (error) {
          this.setState({payIndicator: false});
          console.log(error.response.data.responseMessage);
          // this.setState({ message: error.response.data.responseMessage });
          // this.setState({ showAlert: true });
        }
      } catch (error) {
        console.log(error);
        this.setState({payIndicator: false});
      }
    } else if (this.state.chosenItem === 'Saved Card') {
      try {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer sk_test_fc780c4bc0264bd7dd194dc92afc1fb3afa37c94`;
        const response = await axios.post(
          `https://api.paystack.co/transaction/charge_authorization`,
          {
            email: this.state.cards.email,
            amount: this.state.buttonAmount * 100,
            authorization_code: this.state.cards.authorizationCode,
          },
        );
        console.log(response.data);
        // return;
        if (response.data.data.status == 'success') {
          let drawData = {
            userId: this.state.userData.userid,
            drawId: this.state.drawId,
            totalAmount: this.state.buttonAmount,
            quantity: this.state.value,
            cardId: this.state.cards.id,
            code: '',
            codeType: '',
            paymentOption: 3,
            reference: response.data.data.reference,
          };

          console.log(drawData);
          try {
            const token = await AsyncStorage.getItem('user_token');
            const res = await axios.post(
              `${this.state.baseURL}/api/payment/initialize`,
              drawData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log(res.data);
            if (res.data.status == 'success') {
              // console.log("successful");
              // this.setState({ showSuccess: true });
              // this.setState({ message: res.data.responseMessage });
              this.props.navigation.navigate('Invoice');
            }
            this.setState({payIndicator: false});
          } catch (error) {
            this.setState({payIndicator: false});
            console.log(error.response.data.responseMessage);
          }
        } else {
          this.setState({showAlert: true});
          this.setState({message: response.data.data.gateway_response});
        }
      } catch (error) {
        console.log(error);
        this.setState({payIndicator: false});
      }
    } else if (this.state.chosenItem === 'Code') {
      try {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer sk_test_fc780c4bc0264bd7dd194dc92afc1fb3afa37c94`;
        const response = await axios.post(
          `https://api.paystack.co/transaction/charge_authorization`,
          {
            email: this.state.cards.email,
            amount: this.state.buttonAmount * 100,
            authorization_code: this.state.cards.authorizationCode,
          },
        );
        console.log(response.data);
        // return;
        if (response.data.data.status == 'success') {
          let drawData = {
            userId: this.state.userData.userid,
            drawId: this.state.drawId,
            totalAmount: this.state.buttonAmount,
            quantity: this.state.value,
            cardId: this.state.cards.id,
            code: this.state.code,
            codeType: this.state.promoData.codeType,
            paymentOption: 3,
            reference: response.data.data.reference,
          };

          console.log(drawData);
          try {
            const token = await AsyncStorage.getItem('user_token');
            const res = await axios.post(
              `${this.state.baseURL}/api/payment/initialize`,
              drawData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log(res.data);
            if (res.data.status == 'success') {
              console.log('successful');
              this.setState({showSuccess: true});
              this.setState({message: res.data.responseMessage});
            }
            this.setState({payIndicator: false});
          } catch (error) {
            this.setState({payIndicator: false});
            console.log(error.response.data.responseMessage);
          }
        } else {
          this.setState({showAlert: true});
          this.setState({message: response.data.data.gateway_response});
        }
      } catch (error) {
        console.log(error);
        this.setState({payIndicator: false});
      }
    }
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
                  source={require("../../../assets/chatt.png")}
                  style={{ height: 23, width: 23 }}
                />
              </TouchableOpacity> */}
              </Right>
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
                              You currently have{' '}
                              <B>
                                {this.state.uptakes.ticketCount}{' '}
                                {this.state.uptakes.ticketCount <= 1
                                  ? 'entry'
                                  : 'entries'}
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

                      {this.state.uptakes.type === 'Promotional' && (
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
                              You currently have{' '}
                              <B>
                                {this.state.promotionalData.data}{' '}
                                {this.state.promotionalData.data <= 1
                                  ? 'entry'
                                  : 'entries'}
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
                      {this.state.cards != null &&
                      this.state.chosenItem === 'Choose Payment Option' ? (
                        <ListItem
                          style={[styles.selectStyle, {marginBottom: 15}]}
                          onPress={() => this.RBSheet.open()}>
                          <Left style={{paddingVertical: 3}}>
                            <Text
                              style={{
                                fontSize: 16,
                                marginLeft: 13,
                                fontFamily: 'ProximaNovaReg',
                              }}>
                              {this.state.chosenItem}
                            </Text>
                          </Left>
                          <Right>
                            <AntDesign
                              name={'downcircleo'}
                              color={'#000'}
                              style={{fontSize: 16}}
                              onPress={() => this.RBSheet.open()}
                            />
                          </Right>
                        </ListItem>
                      ) : (
                        <View></View>
                      )}
                      {this.state.chosenItem === 'Credit Bag' && (
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#5B9DEE10',
                            justifyContent: 'space-between',
                            padding: 10,
                            // marginHorizontal: 10,
                            borderRadius: 30,
                            paddingHorizontal: 15,
                            marginTop: 20,
                            paddingVertical: 15,
                          }}
                          onPress={() => this.RBSheet.open()}>
                          <View
                            style={{
                              paddingHorizontal: 5,
                              flexDirection: 'row',
                              alignItems: 'center',
                              opacity:
                                this.state.uptakes.type === 'Promotional'
                                  ? 0.3
                                  : 1,
                            }}>
                            <Image
                              style={{}}
                              source={require('../../assets/images/coinss.png')}
                              style={{
                                marginLeft: 10,
                                marginRight: 8,
                                height: 30,
                                width: 30,
                              }}></Image>
                            <View>
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontFamily: 'ProximaNovaSemiBold',
                                  marginTop: 3,
                                }}>
                                Credit bag
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: 'ProximaNovaReg',
                                }}>
                                ₦{this.state.creditBagData.data}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      {this.state.chosenItem === 'Paystack' && (
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#5B9DEE10',
                            // justifyContent: "space-between",
                            padding: 10,
                            // marginHorizontal: 10,
                            borderRadius: 30,
                            paddingHorizontal: 20,
                            marginTop: 20,
                            paddingVertical: 15,
                            opacity:
                              this.state.uptakes.type === 'Promotional'
                                ? 0.3
                                : 1,
                          }}
                          onPress={() => this.RBSheet.open()}>
                          <Image
                            source={require('../../assets/images/card.png')}
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'contain',
                              marginLeft: 15,
                            }}
                          />

                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'ProximaNovaSemiBold',
                              marginLeft: 10,
                            }}>
                            Pay with Card/Bank/USSD
                          </Text>
                        </TouchableOpacity>
                      )}
                      {this.state.chosenItem === 'Saved Card' && (
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#5B9DEE10',
                            justifyContent: 'space-between',
                            padding: 10,
                            // marginHorizontal: 10,
                            borderRadius: 30,
                            paddingHorizontal: 15,
                            marginTop: 20,
                            paddingVertical: 15,
                          }}
                          onPress={() => this.RBSheet.open()}>
                          {/* <View
                    style={{
                      paddingHorizontal: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={{}}
                      source={cardi}
                      style={{ marginLeft: 10, marginRight: 20 }}
                    ></Image>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "ProximaNovaSemiBold",
                        marginTop: 3,
                      }}
                    >
                      * * * *{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "ProximaNovaSemiBold",
                      }}
                    >
                      {this.state.cards.last4}
                    </Text>
                  </View> */}

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              opacity:
                                this.state.uptakes.type === 'Promotional'
                                  ? 0.3
                                  : 1,
                            }}>
                            <View
                              style={{
                                paddingHorizontal: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Image
                                style={{}}
                                source={cardi}
                                style={{
                                  marginLeft: 10,
                                  marginRight: 20,
                                }}></Image>
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontFamily: 'ProximaNovaSemiBold',
                                  marginTop: 3,
                                }}>
                                * * * *{' '}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: 'ProximaNovaSemiBold',
                                }}>
                                {this.state.cards.last4}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={[
                              styles.radioButtonHolder,
                              {height: 20, width: 20, borderColor: '#fff'},
                            ]}>
                            {/* {value === item ? ( */}
                            <View
                              style={[
                                styles.radioIcon,
                                {
                                  height: 10,
                                  width: 10,
                                  backgroundColor:
                                    this.state.uptakes.type === 'Promotional'
                                      ? '#fff'
                                      : '#2ba2d3',
                                },
                              ]}
                            />
                            {/* ) : null} */}
                          </View>
                        </TouchableOpacity>
                      )}

                      {(this.state.cards.last4 === null ||
                        this.state.cards.last4 === '') && (
                        <ListItem
                          style={[styles.selectStyle2, {marginBottom: 20}]}
                          onPress={() =>
                            this.props.navigation.navigate('Payment')
                          }>
                          <Left style={{paddingVertical: 5}}>
                            <Icon
                              name="ios-add-circle-outline"
                              style={styles.selectIconStyle}
                            />
                            <Text style={{fontFamily: 'ProximaNovaReg'}}>
                              Add a debit card
                            </Text>
                          </Left>
                          <Right>
                            <AntDesign
                              name={'rightcircleo'}
                              color={'#000'}
                              style={{fontSize: 16}}
                            />
                          </Right>
                        </ListItem>
                      )}
                    </List>
                  </View>
                </View>
                {/* <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#5B9DEE10",
                    padding: 10,
                    // marginHorizontal: 10,
                    borderRadius: 30,
                    paddingHorizontal: 30,
                    paddingVertical: 13,
                    marginTop: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{
                        uri: this.state.currentDiscountData.data.profilePicture,
                      }}
                      style={{
                        height: 40,
                        width: 40,
                        marginVertical: 10,
                        borderRadius: 40,
                      }}
                    />
                    <View style={{ paddingHorizontal: 15 }}>
                      <Text
                        style={{
                          color: "#323F50",
                          fontSize: 16,
                          fontFamily: "ProximaNovaSemiBold",
                        }}
                      >
                        {this.state.currentDiscountData.data.value}% Discount
                      </Text>
                      <Text
                        style={{
                          color: "#323F50",
                          fontSize: 16,
                          fontFamily: "ProximaNovaReg",
                        }}
                      >
                        <C>
                          {this.state.currentDiscountData.data.ownerFullname}'s
                        </C>{" "}
                        referral code
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#5B9DEE10',
                    padding: 10,
                    justifyContent: 'space-between',
                    borderRadius: 30,
                    paddingHorizontal: 10,
                    marginTop: 10,
                    paddingVertical: 5,
                    opacity:
                      this.state.uptakes.type === 'Promotional' ||
                      this.state.discountData.data !== null
                        ? 0.4
                        : 1,
                  }}>
                  <TextInput
                    style={{
                      color: '#323F50',
                      fontSize: 16,
                      marginLeft: 10,
                      fontFamily: 'ProximaNovaReg',
                      width: '100%',
                    }}
                    onChangeText={(text) => this.getPromoCode(text)}
                    placeholder={'Add a promo code'}
                    editable={
                      this.state.uptakes.type === 'Promotional' ||
                      this.state.discountData.data !== null
                        ? false
                        : true
                    }
                  />
                  {this.state.codeIndicator && (
                    <ActivityIndicator
                      size="small"
                      color="red"
                      style={{paddingHorizontal: 5, marginLeft: -30}}
                    />
                  )}
                </TouchableOpacity>
                {this.state.showPromo && this.state.promoData !== null && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#5B9DEE10',
                      padding: 10,
                      // marginHorizontal: 10,
                      borderRadius: 30,
                      paddingHorizontal: 30,
                      paddingVertical: 13,
                      marginTop: 10,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{paddingHorizontal: 15}}>
                        <Text
                          style={{
                            color: '#323F50',
                            fontSize: 16,
                            fontFamily: 'ProximaNovaSemiBold',
                          }}>
                          {this.state.promoData.value}% Discount
                        </Text>
                        <Text
                          style={{
                            color: '#323F50',
                            fontSize: 16,
                            fontFamily: 'ProximaNovaReg',
                          }}>
                          Promo code
                        </Text>
                        {/* <Text
                          style={{
                            color: "#323F50",
                            fontSize: 16,
                            fontFamily: "ProximaNovaSemiBold",
                          }}
                        >
                          Expires 22/09/2020
                        </Text> */}
                      </View>
                    </View>
                    {/* <View
                      style={[
                        styles.radioButtonHolder,
                        { height: 20, width: 20, borderColor: "#fff" },
                      ]}
                    >
                      <View
                        style={[
                          styles.radioIcon,
                          {
                            height: 10,
                            width: 10,
                            backgroundColor:
                              this.state.uptakes.type === "Promotional"
                                ? "#fff"
                                : "#2ba2d3",
                          },
                        ]}
                      />
                    </View> */}
                  </TouchableOpacity>
                )}
                {this.state.showRefer && this.state.promoData !== null && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#5B9DEE10',
                      padding: 10,
                      // marginHorizontal: 10,
                      borderRadius: 30,
                      paddingHorizontal: 30,
                      paddingVertical: 13,
                      marginTop: 10,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {this.state.promoData.profileUrl && (
                        <Image
                          source={{
                            uri: this.state.promoData.profileUrl,
                          }}
                          style={{
                            height: 40,
                            width: 40,
                            marginVertical: 10,
                            borderRadius: 40,
                          }}
                        />
                      )}
                      {this.state.promoData.profileUrl == null && (
                        <Image
                          source={require('../../assets/images/robo.png')}
                          style={{
                            height: 30,
                            width: 30,
                            marginVertical: 10,
                            borderRadius: 30,
                          }}
                        />
                      )}
                      <View style={{paddingHorizontal: 15}}>
                        <Text
                          style={{
                            color: '#323F50',
                            fontSize: 16,
                            fontFamily: 'ProximaNovaSemiBold',
                          }}>
                          {this.state.promoData.value}% Discount
                        </Text>
                        <Text
                          style={{
                            color: '#323F50',
                            fontSize: 16,
                            fontFamily: 'ProximaNovaReg',
                          }}>
                          <C>{this.state.promoData.sourceName}'s</C> referral
                          code
                        </Text>
                        {/* <Text
                          style={{
                            color: "#323F50",
                            fontSize: 16,
                            fontFamily: "ProximaNovaSemiBold",
                          }}
                        >
                          Expires 22/09/2020
                        </Text> */}
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                {this.state.discountData.data && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#5B9DEE10',
                      padding: 10,
                      // marginHorizontal: 10,
                      borderRadius: 30,
                      paddingHorizontal: 30,
                      paddingVertical: 13,
                      marginTop: 10,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={{
                          uri: this.state.discountData.data.profilePicture,
                        }}
                        style={{
                          height: 40,
                          width: 40,
                          marginVertical: 10,
                          borderRadius: 40,
                        }}
                      />
                      <View style={{paddingHorizontal: 15}}>
                        <Text
                          style={{
                            color: '#323F50',
                            fontSize: 16,
                            fontFamily: 'ProximaNovaSemiBold',
                          }}>
                          {this.state.discountData.data.value}% Discount
                        </Text>
                        <Text
                          style={{
                            color: '#323F50',
                            fontSize: 16,
                            fontFamily: 'ProximaNovaReg',
                          }}>
                          <C>{this.state.discountData.data.ownerFullname}'s</C>{' '}
                          referral code
                        </Text>
                        {/* <Text
                          style={{
                            color: "#323F50",
                            fontSize: 16,
                            fontFamily: "ProximaNovaSemiBold",
                          }}
                        >
                          Expires 22/09/2020
                        </Text> */}
                      </View>
                    </View>
                    {/* <View
                      style={[
                        styles.radioButtonHolder,
                        { height: 20, width: 20, borderColor: "#fff" },
                      ]}
                    >
                      <View
                        style={[
                          styles.radioIcon,
                          {
                            height: 10,
                            width: 10,
                            backgroundColor:
                              this.state.uptakes.type === "Promotional"
                                ? "#fff"
                                : "#2ba2d3",
                          },
                        ]}
                      />
                    </View> */}
                  </TouchableOpacity>
                )}
                {this.state.uptakes.type === 'Promotional' ? (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.payUptake();
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
                      {this.state.showIndicator && (
                        <ActivityIndicator
                          size="small"
                          color="#ffffff"
                          style={{paddingHorizontal: 5, marginTop: -3}}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.initializePaystack();
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
                        ₦{this.state.buttonAmount}
                        {/* {this.state.discountData.data !== null
                          ? this.state.uptakes.ticketAmount * this.state.value -
                            (this.state.discountData.data.value / 100) *
                              this.state.uptakes.ticketAmount *
                              this.state.value
                          : this.state.promoData.value !== null
                          ? this.state.uptakes.ticketAmount *
                            this.state.value *
                            (this.state.promoData.value / 100)
                          : this.state.uptakes.ticketAmount * this.state.value} */}
                      </Text>
                      {this.state.payIndicator && (
                        <ActivityIndicator
                          size="small"
                          color="#ffffff"
                          style={{paddingHorizontal: 5, marginTop: -3}}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
                <View></View>
              </Content>
            </View>
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

            {/* {this.state.paystackMode && (
              <View style={{ flex: 1 }}>
                <PaystackWebView
                  buttonText="Pay Now"
                  paystackKey="pk_test_84373cbbe24b24215e0fd67c1d9411c649734712"
                  paystackSecretKey="sk_test_fc780c4bc0264bd7dd194dc92afc1fb3afa37c94"
                  amount={170000}
                  billingEmail={"lanre@gmail.com"}
                  billingMobile={"09092929292"}
                  billingName={"Lanre"}
                  ActivityIndicatorColor={"red"}
                  SafeAreaViewContainer={{ marginTop: 5 }}
                  SafeAreaViewContainerModal={{ marginTop: 5 }}
                  onCancel={(e) => {
                    console.log(e);
                  }}
                  onSuccess={(e) => {
                    console.log(e);
                  }}
                  autoStart={false}
                  refNumber={uuidv4()}
                />
              </View>
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
              visible={this.state.showSuccess}
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
                      source={require('../../assets/images/done.png')}
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
                        Congratulations
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
                            this.setState({showSuccess: false});
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
              transparent={false}
              visible={this.state.showPay}
              onRequestClose={() => {}}>
              <View style={{marginTop: 300, backgroundColor: 'white'}}>
                <View>
                  <Text
                    style={{
                      color: 'black',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontFamily: 'ProximaNovaSemiBold',
                    }}>
                    Please Add a default card to complete this payment
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      this.hidePay();
                    }}
                    style={{
                      backgroundColor: '#FF6161',
                      borderRadius: 30,
                      paddingVertical: 15,
                      width: '90%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 15,
                      // opacity: 0.4,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontFamily: 'ProximaNovaBold',
                      }}>
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
            </Modal>
            <RBSheet
              ref={(ref) => {
                this.RBSheet = ref;
              }}
              height={570}
              openDuration={250}
              closeOnDragDown={true}
              customStyles={{
                container: {
                  // justifyContent: "center",
                  // alignItems: "center",
                  paddingTop: 20,
                  paddingRight: 20,
                  paddingLeft: 20,
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                },
              }}>
              <ScrollView>
                <Text
                  style={{
                    fontFamily: 'ProximaNovaSemiBold',
                    fontSize: 18,
                    color: '#000',
                    textAlign: 'center',
                    marginTop: 5,
                  }}>
                  Payment
                </Text>
                <Text
                  style={{
                    fontFamily: 'ProximaNovaSemiBold',
                    fontSize: 16,
                    color: '#000',
                    textAlign: 'left',
                    marginTop: 10,
                  }}>
                  Payment Options
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#5B9DEE10',
                    justifyContent: 'space-between',
                    padding: 10,
                    // marginHorizontal: 10,
                    borderRadius: 30,
                    paddingHorizontal: 15,
                    marginTop: 20,
                    paddingVertical: 15,
                  }}
                  onPress={() => this.choseonOption('Credit Bag')}>
                  <View
                    style={{
                      paddingHorizontal: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      opacity:
                        this.state.uptakes.type === 'Promotional' ? 0.3 : 1,
                    }}>
                    <Image
                      style={{}}
                      source={require('../../assets/images/coinss.png')}
                      style={{
                        marginLeft: 10,
                        marginRight: 8,
                        height: 30,
                        width: 30,
                      }}></Image>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'ProximaNovaSemiBold',
                          marginTop: 3,
                        }}>
                        Credit bag
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'ProximaNovaReg',
                        }}>
                        ₦{this.state.creditBagData.data}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#5B9DEE10',
                    // justifyContent: "space-between",
                    padding: 10,
                    // marginHorizontal: 10,
                    borderRadius: 30,
                    paddingHorizontal: 20,
                    marginTop: 20,
                    paddingVertical: 15,
                    opacity:
                      this.state.uptakes.type === 'Promotional' ? 0.3 : 1,
                  }}
                  onPress={() => this.choseonOption('Paystack')}>
                  <Image
                    source={require('../../assets/images/card.png')}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      marginLeft: 15,
                    }}
                  />

                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'ProximaNovaSemiBold',
                      marginLeft: 10,
                    }}>
                    Pay with Card/Bank/USSD
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#5B9DEE10',
                    justifyContent: 'space-between',
                    padding: 10,
                    // marginHorizontal: 10,
                    borderRadius: 30,
                    paddingHorizontal: 15,
                    marginTop: 20,
                    paddingVertical: 15,
                  }}
                  onPress={() => this.choseonOption('Saved Card')}>
                  {/* <View
                    style={{
                      paddingHorizontal: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={{}}
                      source={cardi}
                      style={{ marginLeft: 10, marginRight: 20 }}
                    ></Image>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "ProximaNovaSemiBold",
                        marginTop: 3,
                      }}
                    >
                      * * * *{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "ProximaNovaSemiBold",
                      }}
                    >
                      {this.state.cards.last4}
                    </Text>
                  </View> */}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity:
                        this.state.uptakes.type === 'Promotional' ? 0.3 : 1,
                    }}>
                    <View
                      style={{
                        paddingHorizontal: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        style={{}}
                        source={cardi}
                        style={{marginLeft: 10, marginRight: 20}}></Image>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'ProximaNovaSemiBold',
                          marginTop: 3,
                        }}>
                        * * * *{' '}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: 'ProximaNovaSemiBold',
                        }}>
                        {this.state.cards.last4}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.radioButtonHolder,
                      {height: 20, width: 20, borderColor: '#fff'},
                    ]}>
                    {/* {value === item ? ( */}
                    <View
                      style={[
                        styles.radioIcon,
                        {
                          height: 10,
                          width: 10,
                          backgroundColor:
                            this.state.uptakes.type === 'Promotional'
                              ? '#fff'
                              : '#2ba2d3',
                        },
                      ]}
                    />
                    {/* ) : null} */}
                  </View>
                </TouchableOpacity>
                {this.state.cards.last4 === null && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#5B9DEE10',
                      justifyContent: 'space-between',
                      padding: 10,
                      // marginHorizontal: 10,
                      borderRadius: 30,
                      paddingHorizontal: 15,
                      marginTop: 20,
                      paddingVertical: 20,
                      opacity:
                        this.state.uptakes.type === 'Promotional' ? 0.3 : 1,
                    }}
                    onPress={() =>
                      this.state.uptakes.type === 'Promotional'
                        ? null
                        : this.props.navigation.navigate('Payment')
                    }>
                    <View
                      style={{
                        paddingHorizontal: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <AntDesign
                        name={'pluscircleo'}
                        color={'#91BDF3'}
                        style={{fontSize: 16, marginRight: 15}}
                      />
                      <Text
                        style={{
                          color: '#323F50',
                          fontSize: 16,
                          marginLeft: 10,
                          fontFamily: 'ProximaNovaReg',
                        }}>
                        Add a debit card
                      </Text>
                    </View>
                    <AntDesign
                      name={'rightcircleo'}
                      color={'#000'}
                      style={{fontSize: 16}}
                    />
                  </TouchableOpacity>
                )}
                <Text
                  style={{
                    fontFamily: 'ProximaNovaSemiBold',
                    fontSize: 16,
                    color: '#000',
                    textAlign: 'left',
                    marginTop: 25,
                  }}>
                  Promotions
                </Text>
                {this.state.discountData.data && (
                  <TouchableOpacity
                    onPress={() => this.choseonOption('Discount on referral')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#5B9DEE10',
                      padding: 10,
                      // marginHorizontal: 10,
                      borderRadius: 30,
                      paddingHorizontal: 30,
                      paddingVertical: 13,
                      marginTop: 20,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={{
                          uri: this.state.discountData.data.profilePicture,
                        }}
                        style={{
                          height: 40,
                          width: 40,
                          marginVertical: 10,
                          borderRadius: 40,
                        }}
                      />
                      <View style={{paddingHorizontal: 15}}>
                        <Text
                          style={{
                            color: '#323F50',
                            fontSize: 16,
                            fontFamily: 'ProximaNovaSemiBold',
                          }}>
                          {this.state.discountData.data.value}% Discount
                        </Text>
                        <Text
                          style={{
                            color: '#323F50',
                            fontSize: 16,
                            fontFamily: 'ProximaNovaReg',
                          }}>
                          <C>{this.state.discountData.data.ownerFullname}'s</C>{' '}
                          referral code
                        </Text>
                        {/* <Text
                          style={{
                            color: "#323F50",
                            fontSize: 16,
                            fontFamily: "ProximaNovaSemiBold",
                          }}
                        >
                          Expires 22/09/2020
                        </Text> */}
                      </View>
                    </View>
                    {/* <View
                      style={[
                        styles.radioButtonHolder,
                        { height: 20, width: 20, borderColor: "#fff" },
                      ]}
                    >
                      <View
                        style={[
                          styles.radioIcon,
                          {
                            height: 10,
                            width: 10,
                            backgroundColor:
                              this.state.uptakes.type === "Promotional"
                                ? "#fff"
                                : "#2ba2d3",
                          },
                        ]}
                      />
                    </View> */}
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#5B9DEE10',
                    padding: 10,
                    // marginHorizontal: 10,
                    borderRadius: 30,
                    paddingHorizontal: 30,
                    paddingVertical: 13,
                    marginTop: 20,
                    justifyContent: 'space-between',
                    opacity: this.state.uptakes.type === 'Paid' ? 0.3 : 1,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../assets/images/ticket_red.png')}
                      style={{height: 15, width: 30, marginVertical: 10}}
                    />
                    <View style={{paddingHorizontal: 15}}>
                      <Text
                        style={{
                          color: '#323F50',
                          fontSize: 16,
                          fontFamily: 'ProximaNovaSemiBold',
                        }}>
                        Promo Entries
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            color: '#323F50',
                            fontSize: 16,
                            fontFamily: 'ProximaNovaReg',
                          }}>
                          {/* Expires {Moment(promo.validUntil).format("hh:mm:ss a")} */}
                          {this.state.promotionalData.data} Entries
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.radioButtonHolder,
                      {height: 20, width: 20, borderColor: '#fff'},
                    ]}>
                    {/* {value === item ? ( */}
                    <View
                      style={[
                        styles.radioIcon,
                        {
                          height: 10,
                          width: 10,
                          backgroundColor:
                            this.state.uptakes.type === 'Promotional'
                              ? '#2ba2d3'
                              : '#fff',
                        },
                      ]}
                    />
                    {/* ) : null} */}
                  </View>
                </TouchableOpacity>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.RBSheet.close()}
                    style={{
                      backgroundColor: '#FF6161',
                      borderRadius: 30,
                      paddingVertical: 15,
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 15,
                      marginBottom: 10,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontFamily: 'ProximaNovaReg',
                      }}>
                      Use this
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </RBSheet>
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

export default Udetails;
