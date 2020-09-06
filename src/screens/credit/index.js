import React, {Component} from 'react';
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
} from 'native-base';
import {
  ImageBackground,
  View,
  Image,
  Modal,
  BackHandler,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import styles from './style';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

const robot = require('../../assets/images/top.png');

const empty = require('../../assets/images/not.png');

const coin = require('../../assets/images/coinss.png');

const try1 = require('../../assets/images/try1.png');

import Moment from 'moment';

import {NavigationEvents} from 'react-navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';

class Enteries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      baseURL: 'https://dragonflyapi.nationaluptake.com/',
      message: '',
      default_message: 'Please check your internet connection',
      showAlert: false,
      message_title: '',
      Spinner: false,
      code: '123456',
      userData: {},
      credit: 0,
      available: [],
      now: '',
      amount: 0,
      showView: false,
      bagHistory: [],
    };
  }

  componentDidMount() {
    const now = Moment().format('a');
    this.setState({now});

    this.getToken();
    this._creditBag();
  }

  dateToFromNowDaily(myDate) {
    // get from-now for this date
    var fromNow = Moment(myDate).fromNow();
    // ensure the date is displayed with today and yesterday
    return Moment(myDate).calendar(null, {
      // when the date is closer, specify custom values
      lastWeek: 'YYYY-MM-DD HH:mm:ss',
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      // when the date is further away, use from-now functionality
      sameElse: function () {
        return '[' + fromNow + ']';
      },
    });
  }

  getToken = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userProfile);
      this.setState({userData});
      await this._creditBagHistory();
    } catch (error) {}
  };

  async availableUptake() {
    axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/draws/livedraws`,
      params: {},
    })
      .then(
        function (response) {
          let available = response.data.data;

          this.setState({available});
          this.setState({showView: true});
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({message: this.state.default_message});
          this.showAlert();
        }.bind(this),
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

  _creditBag = async () => {
    const token = await AsyncStorage.getItem('user_token');
    const res = await axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/account/creditbag/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    this.setState({amount: res.data.data});
  };

  _creditBagHistory = async () => {
    console.log('called me');
    try {
      const token = await AsyncStorage.getItem('user_token');
      const res = await axios({
        method: 'GET',
        url: `${this.state.baseURL}/api/transactions/history/creditbag/${this.state.userData.userid}`,
        params: {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.setState({bagHistory: res.data.data});
      this.setState({showView: true});
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    if (this.state.showView) {
      return (
        <Container style={styles.container}>
          <Header
            noShadow
            style={{backgroundColor: '#fff', marginTop: 10}}
            androidStatusBarColor="#FFFFFF"
            iosBarStyle="dark-content">
            <Left>
              <AntDesign
                name={'leftcircleo'}
                color={'#273444'}
                style={{fontSize: 24}}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body></Body>
          </Header>
          <Content>
            <View
              style={{
                flexDirection: 'row',
                marginRight: 10,
                marginLeft: 10,
                marginTop: 10,
              }}>
              <View
                style={{
                  marginLeft: 10,
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: '#273444',
                    // marginLeft: 10,
                    fontSize: 20,
                    marginTop: 0,
                    fontFamily: 'ProximaNovaReg',
                  }}>
                  Credit Bag
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 5,
                    backgroundColor: '#F2F7FB',
                    padding: 10,
                        borderRadius: 24,
                    padding: 15,
                    width: '32%',
                    marginLeft: 25,
                    height: 35
                    // marginTop: 10,
                  }}>
                  <Image
                    source={coin}
                    style={{marginRight: 5, height: 20, width: 20}}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'ProximaNovaSemiBold',
                      color: '#000',
                    }}>
                    ₦
                    {
                      this.state.amount
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                        .split('.')[0]
                    }
                  </Text>
                </View>
              </View>
            </View>

            {this.state.bagHistory.length < 1 ? (
              <View>
                <Image source={empty} style={styles.imageLogo} />
                <Text
                  style={[
                    styles.centerText,
                    {fontFamily: 'ProximaNovaSemiBold'},
                  ]}>
                  {' '}
                  Nothing to see here
                  {'\n'}
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'normal',
                      fontFamily: 'ProximaNovaReg',
                    }}>
                    Credit Bag transactions will appear here
                  </Text>
                </Text>
              </View>
            ) : (
              <View>
                {this.state.bagHistory.map((item, i) => {
                  return (
                    <ScrollView key={i} style={{flex: 1}}>
                      <TouchableOpacity
                        // onPress={() => this.props.navigation.push('Invoice', {
                        //   ref: item.reference
                        // })}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flex: 1,
                          borderBottomColor: '#c4c4c4',
                          borderBottomWidth: 0.5,
                          paddingVertical: 20,
                          paddingHorizontal: 20,
                        }}>
                        <View>
                          <Text
                            style={{
                              color: 'black',
                              fontFamily: 'ProximaNovaSemiBold',
                              alignItems: 'flex-start',
                              paddingVertical: 5,
                            }}>
                            Transaction ID: {item.transactionId}
                          </Text>
                          <Text
                            style={{
                              // color: 'black',
                              fontSize: 12,
                              fontFamily: 'ProximaNovaReg',
                              paddingVertical: 5,
                            }}>
                            Initiation Date: {item.whenInitiated}
                          </Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                          <Text
                            style={{
                              color: 'red',
                              fontSize: 12,
                              fontFamily: 'ProximaNovaReg',
                            }}>
                            ₦{item.amount}
                          </Text>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 12,
                              fontFamily: 'ProximaNovaReg',
                            }}>
                            {this.dateToFromNowDaily(item.paymentDate)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  );
                })}
              </View>
            )}
          </Content>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showAlert}
            onRequestClose={() => {}}>
            <View style={{marginTop: 300, backgroundColor: 'white'}}>
              <View>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontFamily: 'ProximaNovaReg',
                  }}>
                  {this.state.message}
                </Text>
                <Button
                  block
                  rounded
                  style={styles.bottonStyle}
                  onPress={() => {
                    this.hideAlert();
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      alignSelf: 'center',
                      fontFamily: 'ProximaNovaReg',
                    }}>
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
            onRequestClose={() => {}}>
            <View style={{marginTop: 300}}>
              <View>
                <Spinner color="white" />
              </View>
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
  }
}

export default Enteries;
