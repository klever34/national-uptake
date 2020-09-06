import React, {Component} from 'react';
import {
  View,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  PermissionsAndroid
} from 'react-native';

import {Button, Thumbnail} from 'native-base';

import {baseUrl} from '../../constants/index';

import styles from './style';
import axios from 'axios';
const deviceWidth = Dimensions.get('window').width;
import AntDesign from 'react-native-vector-icons/AntDesign';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';

const robot = require('../../assets/images/robo.png');
const empty = require('../../assets/images/not.png');
const coin = require('../../assets/images/coinss.png');
const lay = require('../../assets/images/lay.png');
const pep = require('../../assets/images/pep.png');
const no = require('../../assets/images/no.png');
const tick = require('../../assets/images/Ticket.png');
const layers = require('../../assets/images/layers.png');
const won = require('../../assets/images/won.png');
import NetInfo from '@react-native-community/netinfo';
import Moment from 'moment';
// import PushNotification from "react-native-push-notification";
import {NavigationEvents, withNavigationFocus} from 'react-navigation';
import CountDown from 'react-native-countdown-component';

class Available extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      baseURL: baseUrl,
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
      showNo: false,
      showErr: false,
      hr: 0,
      screen: 'yes',
      showBlur: false,
      tabIndex: 0,
      myTakes: [],
      filter: 'All',
      userId: null,
      stories: [],
      scrollBegin: false,
      setFullWidth: false,
      multipleTakes: false,
      options: ['All uptakes', 'Ongoing uptakes', 'Concluded uptakes'],
      optionsTwo: ['Last month', '3 months ago', 'All time'],
      showView: false,
      refreshing: false,
      networkStatus: null,
      timeNow: '',
      netOpacity: 0,
      creditBagAmt: 0,
      chosenIndex: 0,
      img: null,
      drawID: null,
    };
  }

  _onRefresh = async () => {
    this.setState({refreshing: true});
    this.fetchApi();
    this.setState({refreshing: false});
  };

  getToken = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userData');
      if (userProfile === null) {
        const userData = {
          firstname: 'Guest',
          lastname: 'Guest',
        };
        this.setState({userData});
      } else {
        const userData = JSON.parse(userProfile);

        this.setState({userData});
        this.setState({userId: userData.userid});
      }
    } catch (error) {}
  };

  async selectedOption(answer) {}

  backAction = () => {};

  _handleOptionSelectedOne = (item) => {
    if (item === 'All uptakes') {
      this.setState({chosenIndex: 0});
      this._filterUptakes('all');
    } else if (item === 'Ongoing uptakes') {
      this.setState({chosenIndex: 1});
      this._filterUptakes('live');
    } else if (item === 'Concluded uptakes') {
      this.setState({chosenIndex: 2});
      this._filterUptakes('drawn');
    }
  };

  _handleOptionSelectedTwo = (item) => {
    if (item === 'Last month') {
      this.setState({chosenIndex: 0});
      this._filterStories('lastmonth');
    } else if (item === '3 months ago') {
      this.setState({chosenIndex: 1});
      this._filterStories('threemonth');
    } else if (item === 'All time') {
      this.setState({chosenIndex: 2});
      this._filterStories('all');
    }
  };

  _filterUptakes = async (item) => {
    const token = await AsyncStorage.getItem('user_token');
    const result = await axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/draws/userdraws/${this.state.userData.userid}?pageNumber=1&pageSize=20`,
      params: {
        filterby: item,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    var myUptakes = result.data.data;
    this.setMyUptakes(myUptakes);
    this.RBSheet.close();
  };

  _filterStories = async (item) => {
    const token = await AsyncStorage.getItem('user_token');
    const result = await axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/winnerstories`,
      params: {
        filterby: item,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    var myUptakes = result.data.data;
    this.setWinnerStories(myUptakes);
    this.RBSheet2.close();
  };

  async componentDidMount() {
    this.requestCameraPermission()
    try {
      const vm = this;
      let time = new Date().getHours();
      this.getToken();
      this.setState({timeNow: time});
      NetInfo.addEventListener(async (state) => {
        vm.setState({networkStatus: state.isConnected});
        if (vm.state.networkStatus) {
          vm.setState({netOpacity: 1});
        }
        if (vm.state.userData.firstname === 'Guest') {
          await vm.loadUptakes();
          return;
        }
        vm.fetchApi();
      });

      if (this.state.userData.firstname === 'Guest') {
        await this.loadUptakes();
        return;
      }
      this.fetchApi();
      await this.regToken();
    } catch (error) {
      console.log(error);
    }
  }

  async regToken() {
    const token = await AsyncStorage.getItem('user_token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const firebase_tok = await AsyncStorage.getItem('@firebase_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    try {
      const response = await axios.post(
        `${baseUrl}/api/notifications/savetoken`,
        {
          userId: `${this.state.userData.userid}`,
          token: firebase_tok,
        },
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'National Uptake',
          message:
            'app requires access to users contacts for ease of use for users when they would like to easily share referral codes from within the app. They should be able to click copy or share, when share is clicked, then the users contacts should open up.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async loadUptakes() {
    const vm = this;
    Promise.all([this._availableUptake()])
      .then((results) => {
        var avUptakes = results[0].data.data;
        console.log('avUptakes');
        console.log(avUptakes);
        vm.setAvailableUptakes(avUptakes);
        vm.setState({showView: true});
        vm.state.userData.pictureUrl = null;
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }

  async setPushNotification() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification here

        // required on iOS only
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // Android only
      senderID: '1090501687137',
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  async registerDeviceToken() {
    try {
      const response = await axios.post(
        `${this.state.baseURL}/api/notifications/savetoken`,
        {
          userId: this.state.userId,
          token,
        },
      );
    } catch (error) {}
  }

  fetchApi() {
    const vm = this;
    Promise.all([
      this._availableUptake(),
      this._myUptake(),
      this._winnerStories(),
      this._creditBag(),
    ])
      .then((results) => {
        var avUptakes = results[0].data.data;
        vm.setAvailableUptakes(avUptakes);

        var myUptakes = results[1].data.data;
        vm.setMyUptakes(myUptakes);

        var winnerStories = results[2].data.data;
        vm.setWinnerStories(winnerStories);

        var credit = results[3].data;
        vm.setState({creditBagAmt: credit.data});

        vm.setState({showView: true});
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }

  _creditBag = async () => {
    console.log('3');
    const token = await AsyncStorage.getItem('user_token');
    return axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/account/creditbag/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  _availableUptake = async () => {
    this.setState({Spinner: true});
    console.log('4');

    const token = await AsyncStorage.getItem('user_token');
    console.log('1');
    return axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/draws/livedraws`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  setAvailableUptakes = (uptakes) => {
    let available = uptakes;
    var stat = false;
    available.map((item) => {
      if (item.value.length > 1) {
        stat = true;
      }
    });
    this.setState({setFullWidth: stat});
    this.setState({available});
  };

  setMyUptakes = (uptakes) => {
    let available = uptakes;

    this.setState({myTakes: available});
  };

  setWinnerStories = (uptakes) => {
    let available = uptakes;

    this.setState({stories: available});
  };

  _myUptake = async () => {
    console.log('2');

    const token = await AsyncStorage.getItem('user_token');
    return axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/draws/userdraws/${this.state.userData.userid}?pageNumber=1&pageSize=20`,
      params: {
        filterby: this.state.filter,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  _winnerStories = async () => {
    this.setState({Spinner: true});
    const token = await AsyncStorage.getItem('user_token');
    return axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/winnerstories`,
      params: {
        filterby: this.state.filter,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  async creditBag() {
    console.log('4');

    try {
      const response = await axios({
        method: 'GET',
        url: `${this.state.baseURL}/api/auth/verifyAccount`,
        params: {
          email: this.state.email,
        },
      });

      if (response.data.accountExist === true) {
        this.props.navigation.navigate('Password', {
          email: this.state.email,
        });
      } else {
        this.props.navigation.navigate('Register', {
          email: this.state.email,
        });
      }
    } catch (error) {
      // this.setState({ message: this.state.default_message });
      // this.showAlert();
    }
  }

  async setUptakeStat(visit) {
    let upId = await AsyncStorage.getItem(`uptake-${visit.drawId}`);
    this.setState({img: visit.imageurl});
    this.setState({drawID: visit.drawId});
    if (upId) {
      this.props.navigation.navigate('Udetails', {
        image: visit.imageurl,
        id: visit.drawId,
      });
    } else {
      this.setState({multipleTakes: true});
    }
  }

  async goToNext() {
    await AsyncStorage.setItem(
      `uptake-${this.state.drawID}`,
      `${this.state.drawID}`,
    );
    this.setState({multipleTakes: false});
    this.props.navigation.navigate('Udetails', {
      image: this.state.img,
      id: this.state.drawID,
    });
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

  showNo() {
    this.setState({
      showNo: true,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  }

  async searchUptakes() {
    const response = await axios.get(`${baseUrl}`);
  }

  hideNo() {
    this.setState({
      showNo: false,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  }

  toggleErr() {
    this.setState({
      showErr: !this.state.showErr,
    });
    this.setState({
      showBlur: !this.state.showBlur,
    });
  }

  scrollStart = () => this.setState({scrollBegin: true});
  scrollEnd = () => this.setState({scrollBegin: false});

  drawDetails() {
    // this.refs.touchableOpacity.setOpacityTo(0.2, 150);
    // TimerMixin.setTimeout(() => {
    //   onPress();
    //   this.refs.touchableOpacity.setOpacityTo(1, 250);
    // }, 150);
  }

  render() {
    const openSheetOne = () => {
      this.RBSheet.open();
      this.setState({chosenIndex: 0});
    };

    const openSheetTwo = () => {
      this.RBSheet2.open();
      this.setState({chosenIndex: 0});
    };

    if (this.state.networkStatus) {
      if (this.state.showView) {
        if (this.state.userData.firstname === 'Guest') {
          return (
            <ScrollView
              style={{flex: 1, backgroundColor: '#fff'}}
              onScrollBeginDrag={this.scrollStart}
              onScrollEndDrag={this.scrollEnd}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                  tintColor="#FF6161"
                  enabled={true}
                  title="pull down to update..."
                  colors={['#FF6161']}
                  progressBackgroundColor="#fff"
                />
              }>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.container,
                    {backgroundColor: '#FFFFFF', flex: 1},
                  ]}>
                  {/* <NavigationEvents onDidFocus={() => this.getToken()} /> */}
                  {/* <StatusBar  translucent backgroundColor="transparent" barStyle="dark-content"/> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 13,
                      marginTop: 15,
                    }}>
                    <View>
                      <Text
                        style={{
                          color: '#273444',
                          fontSize: 20,
                          fontFamily: 'ProximaNovaAltBold',
                        }}>
                        {this.state.userData.firstname
                          ? this.state.userData.firstname.slice(0, 15)
                          : this.state.userData.firstname}
                      </Text>
                      {this.state.timeNow >= 0 && this.state.timeNow < 7 && (
                        <Text
                          style={{
                            color: '#273444',
                            fontSize: 14,
                            fontFamily: 'ProximaNova-Regular',
                          }}>
                          Good morning nightcrawler 😴
                        </Text>
                      )}
                      {this.state.timeNow >= 7 && this.state.timeNow < 12 && (
                        <Text
                          style={{
                            color: '#273444',
                            fontSize: 14,
                            fontFamily: 'ProximaNova-Regular',
                          }}>
                          Good morning 🌤
                        </Text>
                      )}
                      {this.state.timeNow >= 12 && this.state.timeNow < 18 && (
                        <Text
                          style={{
                            color: '#273444',
                            fontSize: 14,
                            fontFamily: 'ProximaNova-Regular',
                          }}>
                          Good afternoon ☀️
                        </Text>
                      )}
                      {this.state.timeNow >= 18 && this.state.timeNow <= 23 && (
                        <Text
                          style={{
                            color: '#273444',
                            fontSize: 14,
                            fontFamily: 'ProximaNova-Regular',
                          }}>
                          Good evening 🌑
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {/* <TouchableOpacity
                          onPress={() => this.props.navigation.navigate("Credit")}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginHorizontal: 0,
                            backgroundColor: "#F2F7FB",
                            // marginRight: -7,
                            padding: 10,
                            borderRadius: 24,
                          }}
                          activeOpacity={0.8}
                        >
                          <Image
                            source={coin}
                            style={{ marginRight: 5, height: 20, width: 20 }}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: "ProximaNovaAltBold",
                              color: "#000",
                            }}
                          >
                            ₦0.00
                          </Text>
                        </TouchableOpacity> */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          this.state.userData.firstname === 'Guest'
                            ? this.props.navigation.navigate('Welcome')
                            : this.props.navigation.navigate('Profile')
                        }
                        style={[
                          this.state.userData.pictureUrl === null
                            ? styles.card
                            : styles.card2,
                          {
                            padding: 15,
                            borderRadius: 40,
                            elevation:
                              this.state.userData.pictureUrl === null ? 4 : 0,
                            borderBottomLeftRadius: 40,
                            borderBottomRightRadius: 40,
                            marginRight: -13,
                          },
                        ]}>
                        {this.state.userData.pictureUrl === null && (
                          <View
                            style={{
                              backgroundColor: '#FF6161',
                              borderRadius: 15,
                              height: 15,
                              width: 15,
                              position: 'absolute',
                              top: 3,
                              right: 3,
                            }}></View>
                        )}
                        {this.state.userData.pictureUrl === null ? (
                          <View>
                            <Image
                              source={robot}
                              style={{height: 25, width: 25}}
                            />
                          </View>
                        ) : (
                          <View>
                            <Image
                              source={{uri: this.state.userData.pictureUrl}}
                            />
                            <Thumbnail
                              large
                              source={{
                                uri: `${this.state.userData.pictureUrl}`,
                              }}
                              style={{
                                borderWidth: 2,
                                borderColor: '#EF3C3C',
                                height: 60,
                                width: 60,
                                marginLeft:
                                  this.state.userData.pictureUrl === null
                                    ? 0
                                    : -5,
                              }}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{flex: 1}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => null}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginHorizontal: 5,
                          padding: 7,
                          borderBottomColor:
                            this.state.tabIndex === 0 ? '#ff6161' : '#FFC2C2',
                          borderBottomWidth: 4,
                          flex: 1,
                          // opacity: this.state.tabIndex === 0 ? 1 : 0.5,
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            lineHeight: 25,
                            fontFamily:
                              this.state.tabIndex === 0
                                ? 'ProximaNovaAltBold'
                                : 'ProximaNovaReg',
                            color:
                              this.state.tabIndex === 0 ? '#000000' : '#8e8e8f',
                            opacity: this.state.tabIndex === 0 ? 1 : 0.5,
                          }}>
                          Available Uptakes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => null}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginHorizontal: 5,
                          padding: 7,
                          borderBottomColor:
                            this.state.tabIndex === 1 ? '#1877BA' : '#A5D3F3',
                          borderBottomWidth: 4,
                          flex: 1,
                          // opacity: this.state.tabIndex === 1 ? 1 : 0.5,
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            lineHeight: 25,
                            fontFamily:
                              this.state.tabIndex === 1
                                ? 'ProximaNovaAltBold'
                                : 'ProximaNovaReg',
                            color:
                              this.state.tabIndex === 1 ? '#000000' : '#8e8e8f',
                            opacity: this.state.tabIndex === 1 ? 1 : 0.5,
                          }}>
                          My Uptakes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => null}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginHorizontal: 5,
                          padding: 7,
                          borderBottomColor:
                            this.state.tabIndex === 2 ? '#ffc65c' : '#FFEAC2',
                          borderBottomWidth: 4,
                          flex: 1,
                          // opacity: this.state.tabIndex === 2 ? 1 : 0.5,
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            lineHeight: 25,
                            fontFamily:
                              this.state.tabIndex === 2
                                ? 'ProximaNovaAltBold'
                                : 'ProximaNovaReg',
                            color:
                              this.state.tabIndex === 2 ? '#000000' : '#8e8e8f',
                            opacity: this.state.tabIndex === 2 ? 1 : 0.5,
                          }}>
                          Winner Stories
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                  {this.state.tabIndex === 0 &&
                    this.state.available.map((visit, i) => {
                      return (
                        <View key={i} style={{marginLeft: 10, flex: 1}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                marginTop: 20,
                                marginLeft: 10,
                                fontSize: 18,
                                color: '#000',
                                fontFamily: 'ProximaNovaReg',
                                marginRight: 8,
                              }}>
                              {visit.key}
                            </Text>
                            <Image
                              source={{uri: visit.value[0].categoryIcon}}
                              style={{height: 20, width: 20, marginTop: 15}}
                            />
                          </View>

                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              marginTop: 5,
                              flex: 1,
                            }}>
                            <ScrollView
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              style={{flex: 1}}>
                              {visit.value.map((visits, i) => {
                                return (
                                  <TouchableOpacity
                                    // delayPressIn={this.state.scrollBegin ? 150: 0}
                                    activeOpacity={0.8}
                                    ref="touchableOpacity"
                                    onPress={() =>
                                      this.props.navigation.navigate(
                                        'GuestUser',
                                        {
                                          image: visits.imageurl,
                                          id: visits.drawId,
                                        },
                                      )
                                    }
                                    // onPress={() =>
                                    //   this.setState({ multipleTakes: true })
                                    // }
                                    key={visits.drawId}
                                    style={[
                                      styles.card,
                                      {
                                        elevation: 3,
                                        marginVertical: 20,
                                        width: this.state.setFullWidth
                                          ? deviceWidth * 0.85
                                          : deviceWidth * 0.95,
                                        padding: 0,
                                        height: 300,
                                        marginRight: 20,
                                        flex: 1,
                                      },
                                    ]}>
                                    <Image
                                      source={{uri: visits.imageurl}}
                                      style={{
                                        height: '70%',
                                        width: '100%',
                                      }}
                                    />
                                    <View
                                      style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 10,
                                      }}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                        }}>
                                        <Text
                                          style={{
                                            fontFamily: 'ProximaNovaAltBold',
                                            color: '#000',
                                          }}>
                                          {visits.name}
                                        </Text>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}>
                                          <Text
                                            style={{
                                              fontFamily: 'ProximaNovaBold',
                                              color: '#000',
                                            }}>
                                            ₦{visits.tamount}
                                          </Text>
                                          <Text
                                            style={{
                                              fontFamily: 'ProximaNovaReg',
                                              color: '#000',
                                            }}>
                                            /entry
                                          </Text>
                                        </View>
                                      </View>
                                      <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => {
                                          this.state.userData.firstname ===
                                          'Guest'
                                            ? this.props.navigation.navigate(
                                                'Welcome',
                                              )
                                            : this.props.navigation.navigate(
                                                'Udetails',
                                                {
                                                  image: visits.imageurl,
                                                  id: visits.drawId,
                                                },
                                              );
                                        }}
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          marginTop: 15,
                                        }}>
                                        <View style={{flexDirection: 'row'}}>
                                          {visits.randomUserImgs.map(
                                            (item, i) => (
                                              <View
                                                key={i}
                                                style={{
                                                  marginLeft:
                                                    i > 0 ? -7 * i : 0,
                                                }}>
                                                <Image
                                                  source={{
                                                    uri: item.profileImgUrl,
                                                  }}
                                                  style={{
                                                    height: 20,
                                                    width: 20,
                                                    borderRadius: 20,
                                                  }}
                                                />
                                              </View>
                                            ),
                                          )}
                                        </View>
                                        <View
                                          style={{
                                            backgroundColor: '#FF6161',
                                            borderRadius: 30,
                                            width: '30%',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            paddingHorizontal: 10,
                                            paddingVertical: 5,
                                            justifyContent: 'space-evenly',
                                          }}>
                                          <Image source={tick} />
                                          <Text
                                            style={{
                                              color: '#fff',
                                              fontFamily: 'ProximaNovaReg',
                                            }}>
                                            Enter
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                      style={{
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        position: 'absolute',
                                        top: 10,
                                        left: 5,
                                      }}>
                                      <View
                                        style={{
                                          padding: 5,
                                          backgroundColor: '#00000030',
                                          // marginLeft: 10,
                                          borderRadius: 20,
                                          paddingHorizontal: 5,
                                          // width: "50%",
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          // opacity: 0.4
                                        }}>
                                        <Button
                                          transparent
                                          rounded
                                          style={{
                                            backgroundColor: 'transparent',
                                            height: 30,
                                          }}>
                                          <CountDown
                                            until={Moment(
                                              visits.drawDate,
                                              'HH:mm:ss: A',
                                            ).diff(
                                              Moment().startOf('day'),
                                              'seconds',
                                            )}
                                            digitStyle={{
                                              backgroundColor: 'transparent',
                                              borderWidth: 0,
                                            }}
                                            digitTxtStyle={{color: '#fff'}}
                                            timeLabelStyle={{
                                              color: '#fff',
                                              fontFamily: 'ProximaNovaSemiBold',
                                              marginTop: -10,
                                            }}
                                            separatorStyle={{color: '#fff'}}
                                            timeToShow={['H', 'M', 'S']}
                                            timeLabels={{
                                              h: 'Hrs',
                                              m: 'Mins',
                                              s: 'Secs',
                                            }}
                                            showSeparator
                                            size={13}
                                          />
                                        </Button>
                                      </View>
                                      {visits.drawMode === 'Multiple' && (
                                        // <TouchableWithoutFeedback>
                                        // <TouchableOpacity
                                        //   style={{ zIndex: 1 }}
                                        //   activeOpacity={0.9}
                                        //   onPress={() =>
                                        //     this.setState({ multipleTakes: true })
                                        //   }
                                        // >
                                        //   <Image
                                        //     source={require("../../../assets/images/stacks.png")}
                                        //     style={{
                                        //       height: 30,
                                        //       width: 30,
                                        //       left: 200,
                                        //     }}
                                        //   />
                                        // </TouchableOpacity>
                                        <Button
                                          transparent
                                          rounded
                                          style={{
                                            backgroundColor: 'transparent',
                                            // height: 40,
                                            // width: 40,
                                            left: 160,
                                            zIndex: 1,
                                          }}
                                          onPress={() =>
                                            this.setState({multipleTakes: true})
                                          }>
                                          <TouchableOpacity
                                            style={{zIndex: 1}}
                                            activeOpacity={0.9}
                                            onPress={() =>
                                              this.setState({
                                                multipleTakes: true,
                                              })
                                            }>
                                            <Image
                                              source={require('../../assets/images/stacks.png')}
                                              style={{
                                                height: 30,
                                                width: 30,
                                              }}
                                            />
                                          </TouchableOpacity>
                                        </Button>
                                        // </TouchableWithoutFeedback>
                                      )}
                                    </TouchableOpacity>
                                  </TouchableOpacity>
                                );
                              })}
                            </ScrollView>
                          </View>
                        </View>
                      );
                    })}
                  {this.state.tabIndex === 1 && (
                    <TouchableOpacity
                      onPress={() => this.RBSheet.open()}
                      style={{
                        padding: 5,
                        backgroundColor: '#5B9DEE10',
                        borderRadius: 30,
                        flexDirection: 'row',
                        width: '35%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 20,
                        marginTop: 30,
                        paddingRight: 10,
                        paddingLeft: 10,
                        marginBottom: 15,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'ProximaNovaReg',
                          fontSize: 16,
                          color: '#000',
                        }}>
                        All uptakes
                      </Text>
                      <AntDesign
                        name={'downcircleo'}
                        color={'#273444'}
                        style={{
                          fontSize: 16,
                          paddingLeft: 5,
                          paddingRight: 5,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  {this.state.tabIndex === 1 &&
                    this.state.myTakes.map((visits, i) => {
                      return (
                        <View
                          key={i}
                          style={[
                            styles.card,
                            {
                              elevation: 3,
                              marginVertical: 20,
                              width: '90%',
                              padding: 0,
                              height: 300,
                              marginHorizontal: 20,
                            },
                          ]}>
                          <Image
                            source={{uri: visits.imageurl}}
                            style={{
                              height: '70%',
                              width: '100%',
                              // resizeMode: "contain",
                            }}
                            blurRadius={visits.drawStatus === 'Drawn' ? 2 : 0}
                          />
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              position: 'absolute',
                              top: 40,
                              // left: 70
                            }}>
                            {visits.drawStatus === 'Live' ? (
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                {visits.drawMode === 'Multiple' ? (
                                  <View
                                    style={{
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flex: 1,
                                      left: '9%',
                                      top: '-8%',
                                      backgroundColor: 'rgba(0,0,0,0.3)',
                                      borderRadius: 20,
                                    }}>
                                    <View
                                      style={{
                                        backgroundColor: 'transparent',
                                        borderRadius: 30,
                                        flex: 1,
                                        alignItems: 'center',
                                        padding: 40,
                                        paddingRight: 70,
                                        paddingLeft: 70,
                                        // paddingTop: 7,
                                        justifyContent: 'space-evenly',
                                      }}>
                                      <Text
                                        style={{
                                          color: '#fff',
                                          fontFamily: 'ProximaNovaAltBold',
                                          fontSize: 30,
                                        }}>
                                        {Moment(visits.drawDate).format(
                                          'hh : mm : ss',
                                        )}
                                      </Text>

                                      {visits.drawMode === 'Multiple' && (
                                        <TouchableOpacity
                                          onPress={() =>
                                            this.props.navigation.navigate(
                                              'Udetails',
                                              {
                                                image: visits.imageurl,
                                                id: visits.drawId,
                                              },
                                            )
                                          }
                                          style={{
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            paddingHorizontal: 10,
                                            paddingVertical: 5,
                                            justifyContent: 'space-evenly',
                                            marginTop: 15,
                                          }}>
                                          <Image
                                            source={require('../../assets/images/layerr.png')}
                                            style={{
                                              height: 20,
                                              width: 20,
                                              marginRight: 15,
                                            }}
                                          />
                                          <Text
                                            style={{
                                              color: '#fff',
                                              fontFamily: 'ProximaNovaReg',
                                              fontSize: 16,
                                            }}>
                                            Multiple Uptakes
                                          </Text>
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  </View>
                                ) : (
                                  <View>
                                    <View
                                      style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flex: 1,
                                        left: 40,
                                        top: 40,
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        borderRadius: 20,
                                      }}>
                                      <View
                                        style={{
                                          backgroundColor: 'transparent',
                                          borderRadius: 40,
                                          flex: 1,
                                          alignItems: 'center',
                                          padding: 20,
                                          paddingRight: 70,
                                          paddingLeft: 70,
                                          // paddingTop: 7,
                                          justifyContent: 'space-evenly',
                                        }}>
                                        <Text
                                          style={{
                                            color: '#fff',
                                            fontFamily: 'ProximaNovaAltBold',
                                            fontSize: 30,
                                          }}>
                                          {Moment(visits.drawDate).format(
                                            'hh : mm : ss',
                                          )}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flex: 1,
                                }}>
                                {visits.userWonStatus === 'Won' ? (
                                  <View
                                    style={{
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flex: 1,
                                    }}>
                                    <Image
                                      source={require('../../assets/images/cupp.png')}
                                      style={{
                                        height: 80,
                                        resizeMode: 'contain',
                                        marginBottom: 10,
                                      }}
                                    />
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: '#FFFFFF',
                                        fontSize: 17,
                                        fontFamily: 'ProximaNovaAltBold',
                                        marginTop: 20,
                                      }}>
                                      Congratulations! You won this uptake 🎉{' '}
                                      {'\n'}
                                    </Text>
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: '#FFFFFF',
                                        fontSize: 14,
                                        fontFamily: 'ProximaNovaReg',
                                        marginTop: -10,
                                      }}>
                                      {Moment(visits.drawDate).format(
                                        'MMM DD, YYYY',
                                      )}
                                    </Text>
                                  </View>
                                ) : (
                                  <View
                                    style={{
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flex: 1,
                                    }}>
                                    <Thumbnail
                                      large
                                      source={{
                                        uri: visits.userImageUrl
                                          ? visits.userImageUrl
                                          : `https://ui-avatars.com/api/?format=png&name=${visits.username}`,
                                      }}
                                      style={[
                                        styles.imageLogoxx,
                                        {marginBottom: 10},
                                      ]}
                                    />
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: '#FFFFFF',
                                        fontSize: 17,
                                        fontFamily: 'ProximaNovaAltBold',
                                        marginTop: 10,
                                      }}>
                                      {visits.username} won this uptake
                                    </Text>
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: '#FFFFFF',
                                        fontSize: 14,
                                        fontFamily: 'ProximaNovaReg',
                                        marginTop: 10,
                                      }}>
                                      {Moment(visits.drawDate).format(
                                        'MMM DD, YYYY',
                                      )}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                          <View
                            style={{
                              paddingHorizontal: 10,
                              paddingTop:
                                visits.drawStatus === 'Drawn' ? 25 : 10,
                              paddingBottom: 5,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'ProximaNovaAltBold',
                                  color: '#000',
                                  fontSize: 16,
                                }}>
                                {visits.name}
                              </Text>
                              {visits.drawStatus === 'Live' && (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: 'ProximaNovaBold',
                                      color: '#000',
                                    }}>
                                    ₦{visits.tamount}
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: 'ProximaNovaReg',
                                      color: '#000',
                                    }}>
                                    /entry
                                  </Text>
                                </View>
                              )}
                              {visits.userWonStatus === 'Won' &&
                                visits.claimStatus === 'Unclaimed' && (
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.props.navigation.navigate(
                                        'Udetails2',
                                        {
                                          image: visits.imageurl,
                                          id: visits.drawId,
                                        },
                                      )
                                    }
                                    style={{
                                      backgroundColor: '#FF6161',
                                      borderRadius: 30,
                                      width: '30%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      paddingHorizontal: 10,
                                      paddingVertical: 5,
                                      justifyContent: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        color: '#fff',
                                        fontFamily: 'ProximaNovaReg',
                                      }}>
                                      Claim Uptake
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              {visits.userWonStatus === 'Won' &&
                                visits.claimStatus === 'Claimed' && (
                                  <TouchableOpacity
                                    onPress={() =>
                                      // this.props.navigation.navigate(
                                      //   'Udetails2',
                                      //   {
                                      //     image: visits.imageurl,
                                      //     id: visits.drawId,
                                      //   },
                                      // )
                                      null
                                    }
                                    style={{
                                      borderColor: '#FF6161',
                                      borderWidth: 2,
                                      borderRadius: 30,
                                      width: '34%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      paddingHorizontal: 10,
                                      paddingVertical: 5,
                                      justifyContent: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        color: '#000',
                                        fontFamily: 'ProximaNovaReg',
                                      }}>
                                      Uptake claimed
                                    </Text>
                                  </TouchableOpacity>
                                )}
                            </View>
                            <View
                              style={
                                {
                                  // flexDirection: "row",
                                  // alignItems: "center",
                                  // justifyContent: "space-between",
                                  // flexDirection: "row",
                                  // alignItems: "center",
                                }
                              }>
                              {visits.drawStatus === 'Live' &&
                              visits.drawStatus !== 'Drawn' &&
                              visits.userWonStatus === 'NotWin' ? (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                  }}>
                                  <TouchableOpacity
                                    onPress={
                                      () => console.log('clicked me')
                                      // this.props.navigation.navigate(
                                      //   'Udetails2',
                                      //   {
                                      //     image: visits.imageurl,
                                      //     id: visits.drawId,
                                      //   },
                                      // )
                                    }
                                    style={{
                                      backgroundColor: '#FF6161',
                                      borderRadius: 30,
                                      width: '50%',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      flexDirection: 'row',
                                      paddingHorizontal: 10,
                                      paddingVertical: 5,
                                      justifyContent: 'space-evenly',
                                    }}>
                                    <Image source={tick} />
                                    <Text
                                      style={{
                                        color: '#fff',
                                        fontFamily: 'ProximaNovaReg',
                                      }}>
                                      Get more enteries
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <Text></Text>
                              )}
                            </View>
                          </View>
                        </View>
                      );
                    })}

                  {this.state.tabIndex === 1 &&
                    this.state.myTakes.length === 0 && (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 30,
                        }}>
                        <Image
                          source={require('../../assets/images/alien.png')}
                          style={[
                            styles.imageLogo,
                            {height: 100, width: 100, resizeMode: 'contain'},
                          ]}
                        />
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
                            Winners are being made, will your story be told
                          </Text>
                        </Text>
                      </View>
                    )}

                  {this.state.tabIndex === 2 && (
                    <TouchableOpacity
                      onPress={() => this.RBSheet2.open()}
                      style={{
                        padding: 5,
                        backgroundColor: '#5B9DEE10',
                        borderRadius: 30,
                        flexDirection: 'row',
                        width: '35%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 20,
                        marginTop: 30,
                        paddingRight: 10,
                        paddingLeft: 10,
                        marginBottom: 15,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'ProximaNovaReg',
                          fontSize: 16,
                          color: '#000',
                        }}>
                        Last month
                      </Text>
                      <AntDesign
                        name={'downcircleo'}
                        color={'#273444'}
                        style={{
                          fontSize: 16,
                          paddingLeft: 5,
                          paddingRight: 5,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  {this.state.tabIndex === 2 &&
                    this.state.stories.map((visits, i) => {
                      return (
                        <View
                          key={i}
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('Story', {
                                id: visits.id,
                                dimage: visits.imageUrl,
                              })
                            }
                            style={[
                              styles.card,
                              {
                                elevation: 3,
                                marginVertical: 20,
                                width: deviceWidth * 0.85,
                                padding: 0,
                                height: 400,
                              },
                            ]}>
                            <Image
                              source={{uri: visits.imageUrl}}
                              style={{
                                height: '80%',
                                width: '100%',
                                resizeMode: 'cover',
                                flex: 1,
                              }}
                            />
                            <View
                              style={{
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'ProximaNovaAltBold',
                                    color: '#000',
                                  }}>
                                  {visits.title}
                                </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.props.navigation.navigate('Story', {
                                      id: visits.id,
                                      dimage: visits.imageUrl,
                                    })
                                  }
                                  style={{
                                    backgroundColor: '#FF6161',
                                    borderRadius: 30,
                                    width: '30%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontFamily: 'ProximaNovaReg',
                                    }}>
                                    See Story
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </View>
              </TouchableWithoutFeedback>
              <RBSheet
                ref={(ref) => {
                  this.RBSheet = ref;
                }}
                height={300}
                openDuration={250}
                customStyles={{
                  container: {
                    // justifyContent: "center",
                    // alignItems: "center",
                  },
                }}>
                <Text
                  style={{
                    fontFamily: 'ProximaNovaSemiBold',
                    fontSize: 16,
                    color: '#000',
                    textAlign: 'center',
                    marginTop: 30,
                  }}>
                  Filter options
                </Text>
                <View style={{padding: 10}}>
                  <View style={[]}>
                    {this.state.options.map((item, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() =>
                            this._handleOptionSelected(item, questionItem)
                          }
                          activeOpacity={0.8}
                          style={[
                            styles.radioButton,
                            {
                              backgroundColor: '#F2F7FB',
                              padding: 10,
                              marginHorizontal: 15,
                              marginVertical: 7,
                              borderRadius: 30,
                              paddingVertical: 20,
                            },
                          ]}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={[styles.label, {color: '#000'}]}>
                              {item}
                            </Text>
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
                                    backgroundColor: '#2ba2d3',
                                  },
                                ]}
                              />
                              {/* ) : null} */}
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </RBSheet>
              <RBSheet
                ref={(ref) => {
                  this.RBSheet2 = ref;
                }}
                height={300}
                openDuration={250}
                customStyles={{
                  container: {
                    // justifyContent: "center",
                    // alignItems: "center",
                  },
                }}>
                <Text
                  style={{
                    fontFamily: 'ProximaNovaSemiBold',
                    fontSize: 16,
                    color: '#000',
                    textAlign: 'center',
                    marginTop: 30,
                  }}>
                  Filter options
                </Text>
                <View style={{padding: 10}}>
                  <View style={[]}>
                    {this.state.optionsTwo.map((item, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() =>
                            this._handleOptionSelected(item, questionItem)
                          }
                          activeOpacity={0.8}
                          style={[
                            styles.radioButton,
                            {
                              backgroundColor: '#F2F7FB',
                              padding: 10,
                              marginHorizontal: 15,
                              marginVertical: 7,
                              borderRadius: 30,
                              paddingVertical: 20,
                            },
                          ]}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={[styles.label, {color: '#000'}]}>
                              {item}
                            </Text>
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
                                    backgroundColor: '#2ba2d3',
                                  },
                                ]}
                              />
                              {/* ) : null} */}
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </RBSheet>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.multipleTakes}
                onRequestClose={() => {}}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}>
                  <View
                    style={{
                      marginTop: 70,
                      // marginLeft: 20,
                      // marginRight: 20,
                      // borderWidth: 10,
                      // borderColor: "white",
                    }}>
                    <View
                      style={{
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        width: 375,
                        borderRadius: 30,
                      }}>
                      <Image
                        source={require('../../assets/images/stack.png')}
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
                          Multiple uptakes
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
                          This uptake contains multiple products available to be
                          won
                        </Text>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 50,
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.goToNext();
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
            </ScrollView>
          );
        }
        return (
          <ScrollView
            style={{flex: 1, backgroundColor: '#fff'}}
            onScrollBeginDrag={this.scrollStart}
            onScrollEndDrag={this.scrollEnd}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
                tintColor="#FF6161"
                enabled={true}
                title="pull down to update..."
                colors={['#FF6161']}
                progressBackgroundColor="#fff"
              />
            }>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.container,
                  {backgroundColor: '#FFFFFF', flex: 1},
                ]}>
                {/* <NavigationEvents onDidFocus={() => this.getToken()} /> */}
                {/* <StatusBar  translucent backgroundColor="transparent" barStyle="dark-content"/> */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}>
                  <View>
                    <Text
                      style={{
                        color: '#273444',
                        fontSize: 20,
                        fontFamily: 'ProximaNovaAltBold',
                      }}>
                      {this.state.userData.firstname
                        ? this.state.userData.firstname.slice(0, 15)
                        : this.state.userData.firstname}
                    </Text>
                    {this.state.timeNow >= 0 && this.state.timeNow < 7 && (
                      <Text
                        style={{
                          color: '#273444',
                          fontSize: 14,
                          fontFamily: 'ProximaNova-Regular',
                        }}>
                        Good morning nightcrawler 😴
                      </Text>
                    )}
                    {this.state.timeNow >= 7 && this.state.timeNow < 12 && (
                      <Text
                        style={{
                          color: '#273444',
                          fontSize: 14,
                          fontFamily: 'ProximaNova-Regular',
                        }}>
                        Good morning 🌤
                      </Text>
                    )}
                    {this.state.timeNow >= 12 && this.state.timeNow < 18 && (
                      <Text
                        style={{
                          color: '#273444',
                          fontSize: 14,
                          fontFamily: 'ProximaNova-Regular',
                        }}>
                        Good afternoon ☀️
                      </Text>
                    )}
                    {this.state.timeNow >= 18 && this.state.timeNow <= 23 && (
                      <Text
                        style={{
                          color: '#273444',
                          fontSize: 14,
                          fontFamily: 'ProximaNova-Regular',
                        }}>
                        Good evening 🌑
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('Credit')}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 0,
                        backgroundColor: '#F2F7FB',
                        // marginRight: -7,
                        padding: 10,
                        borderRadius: 24,
                      }}
                      activeOpacity={0.8}>
                      <Image
                        source={coin}
                        style={{marginRight: 5, height: 20, width: 20}}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'ProximaNovaAltBold',
                          color: '#000',
                        }}>
                        ₦
                        {
                          this.state.creditBagAmt
                            .toFixed(2)
                            .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                            .split('.')[0]
                        }
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        this.state.userData.firstname === 'Guest'
                          ? this.props.navigation.navigate('Welcome')
                          : this.props.navigation.navigate('Profile')
                      }
                      style={[
                        this.state.userData.pictureUrl === null
                          ? styles.card
                          : styles.card2,
                        {
                          padding: 15,
                          borderRadius: 40,
                          elevation:
                            this.state.userData.pictureUrl === null ? 4 : 0,
                          borderBottomLeftRadius: 40,
                          borderBottomRightRadius: 40,
                          marginRight: -13,
                        },
                      ]}>
                      {this.state.userData.pictureUrl === null && (
                        <View
                          style={{
                            backgroundColor: '#FF6161',
                            borderRadius: 15,
                            height: 15,
                            width: 15,
                            position: 'absolute',
                            top: -1,
                            right: -3,
                          }}></View>
                      )}
                      {this.state.userData.pictureUrl === null ? (
                        <View>
                          <Image source={robot} />
                        </View>
                      ) : (
                        <View>
                          <Image
                            source={{uri: this.state.userData.pictureUrl}}
                          />
                          <Thumbnail
                            large
                            source={{
                              uri: `${this.state.userData.pictureUrl}`,
                            }}
                            style={{
                              borderWidth: 2,
                              borderColor: '#EF3C3C',
                              height: 60,
                              width: 60,
                              marginLeft:
                                this.state.userData.pictureUrl === null
                                  ? 0
                                  : -5,
                            }}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => this.setState({tabIndex: 0})}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 5,
                        padding: 7,
                        borderBottomColor:
                          this.state.tabIndex === 0 ? '#ff6161' : '#FFC2C2',
                        borderBottomWidth: 4,
                        flex: 1,
                        // opacity: this.state.tabIndex === 0 ? 1 : 0.5,
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          lineHeight: 25,
                          fontFamily:
                            this.state.tabIndex === 0
                              ? 'ProximaNovaAltBold'
                              : 'ProximaNovaReg',
                          color:
                            this.state.tabIndex === 0 ? '#000000' : '#8e8e8f',
                          opacity: this.state.tabIndex === 0 ? 1 : 0.5,
                        }}>
                        Available Uptakes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => this.setState({tabIndex: 1})}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 5,
                        padding: 7,
                        borderBottomColor:
                          this.state.tabIndex === 1 ? '#1877BA' : '#A5D3F3',
                        borderBottomWidth: 4,
                        flex: 1,
                        // opacity: this.state.tabIndex === 1 ? 1 : 0.5,
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          lineHeight: 25,
                          fontFamily:
                            this.state.tabIndex === 1
                              ? 'ProximaNovaAltBold'
                              : 'ProximaNovaReg',
                          color:
                            this.state.tabIndex === 1 ? '#000000' : '#8e8e8f',
                          opacity: this.state.tabIndex === 1 ? 1 : 0.5,
                        }}>
                        My Uptakes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => this.setState({tabIndex: 2})}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 5,
                        padding: 7,
                        borderBottomColor:
                          this.state.tabIndex === 2 ? '#ffc65c' : '#FFEAC2',
                        borderBottomWidth: 4,
                        flex: 1,
                        // opacity: this.state.tabIndex === 2 ? 1 : 0.5,
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          lineHeight: 25,
                          fontFamily:
                            this.state.tabIndex === 2
                              ? 'ProximaNovaAltBold'
                              : 'ProximaNovaReg',
                          color:
                            this.state.tabIndex === 2 ? '#000000' : '#8e8e8f',
                          opacity: this.state.tabIndex === 2 ? 1 : 0.5,
                        }}>
                        Winner Stories
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
                {this.state.tabIndex === 0 &&
                  this.state.available.map((visit, i) => {
                    return (
                      <View key={i} style={{marginLeft: 10, flex: 1}}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text
                            style={{
                              marginTop: 20,
                              marginLeft: 10,
                              fontSize: 18,
                              color: '#000',
                              fontFamily: 'ProximaNovaReg',
                              marginRight: 8,
                            }}>
                            {visit.key}
                          </Text>
                          <Image
                            source={{uri: visit.value[0].categoryIcon}}
                            style={{height: 20, width: 20, marginTop: 15}}
                          />
                        </View>

                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            marginTop: 5,
                            flex: 1,
                          }}>
                          <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{flex: 1}}>
                            {visit.value.map((visits, i) => {
                              return (
                                <TouchableOpacity
                                  // delayPressIn={this.state.scrollBegin ? 150: 0}
                                  activeOpacity={0.8}
                                  ref="touchableOpacity"
                                  onPress={() =>
                                    visits.drawMode === 'Multipe'
                                      ? this.setUptakeStat(visits)
                                      : this.props.navigation.navigate(
                                          'Udetails',
                                          {
                                            image: visits.imageurl,
                                            id: visits.drawId,
                                          },
                                        )
                                  }
                                  // onPress={() =>
                                  //   this.setState({ multipleTakes: true })
                                  // }
                                  key={visits.drawId}
                                  style={[
                                    styles.card,
                                    {
                                      elevation: 3,
                                      marginVertical: 20,
                                      width: this.state.setFullWidth
                                        ? deviceWidth * 0.85
                                        : deviceWidth * 0.95,
                                      padding: 0,
                                      height: 300,
                                      marginRight: 20,
                                      flex: 1,
                                    },
                                  ]}>
                                  <Image
                                    source={{uri: visits.imageurl}}
                                    style={{
                                      height: '70%',
                                      width: '100%',
                                    }}
                                  />
                                  <View
                                    style={{
                                      paddingHorizontal: 10,
                                      paddingVertical: 10,
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                      }}>
                                      <Text
                                        style={{
                                          fontFamily: 'ProximaNovaAltBold',
                                          color: '#000',
                                        }}>
                                        {visits.name}
                                      </Text>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Text
                                          style={{
                                            fontFamily: 'ProximaNovaBold',
                                            color: '#000',
                                            textDecorationLine:
                                              visits.drawType === 'Promotional'
                                                ? 'line-through'
                                                : 'none',
                                          }}>
                                          ₦{visits.tamount}
                                        </Text>
                                        <Text
                                          style={{
                                            fontFamily: 'ProximaNovaReg',
                                            color: '#000',
                                          }}>
                                          /entry
                                        </Text>
                                      </View>
                                    </View>
                                    <TouchableOpacity
                                      activeOpacity={0.9}
                                      onPress={() => {
                                        visits.drawMode === 'Multipe'
                                          ? this.setUptakeStat(visits)
                                          : this.props.navigation.navigate(
                                              'Udetails',
                                              {
                                                image: visits.imageurl,
                                                id: visits.drawId,
                                              },
                                            );
                                      }}
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 15,
                                      }}>
                                      <View style={{flexDirection: 'row'}}>
                                        {visits.randomUserImgs.map(
                                          (item, i) => (
                                            <View
                                              key={i}
                                              style={{
                                                marginLeft: i > 0 ? -7 * i : 0,
                                              }}>
                                              <Image
                                                source={{
                                                  uri: item.profileImgUrl,
                                                }}
                                                style={{
                                                  height: 20,
                                                  width: 20,
                                                  borderRadius: 20,
                                                }}
                                              />
                                            </View>
                                          ),
                                        )}
                                      </View>
                                      <View
                                        style={{
                                          backgroundColor: '#FF6161',
                                          borderRadius: 30,
                                          width: '30%',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          paddingHorizontal: 10,
                                          paddingVertical: 5,
                                          justifyContent: 'space-evenly',
                                        }}>
                                        <Image source={tick} />
                                        <Text
                                          style={{
                                            color: '#fff',
                                            fontFamily: 'ProximaNovaReg',
                                          }}>
                                          Enter
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  <TouchableOpacity
                                    style={{
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      flexDirection: 'row',
                                      position: 'absolute',
                                      top: 10,
                                      left: 5,
                                    }}>
                                    <View
                                      style={{
                                        padding: 5,
                                        backgroundColor: '#00000030',
                                        // marginLeft: 10,
                                        borderRadius: 20,
                                        paddingHorizontal: 5,
                                        // width: "50%",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // opacity: 0.4
                                      }}>
                                      <Button
                                        transparent
                                        rounded
                                        style={{
                                          backgroundColor: 'transparent',
                                          height: 30,
                                          alignItems: 'center',
                                        }}>
                                        <Text
                                          style={{
                                            color: '#FFFFFF',
                                            fontSize: 14,
                                            fontFamily: 'ProximaNovaBold',
                                            // marginLeft:
                                            paddingHorizontal: 12,
                                            marginTop: -7,
                                          }}>
                                          <CountDown
                                            until={Moment(
                                              visits.drawDate,
                                              'HH:mm:ss: A',
                                            ).diff(
                                              Moment().startOf('day'),
                                              'seconds',
                                            )}
                                            digitStyle={{
                                              backgroundColor: 'transparent',
                                              borderWidth: 0,
                                            }}
                                            digitTxtStyle={{color: '#fff'}}
                                            timeLabelStyle={{
                                              color: '#fff',
                                              fontFamily: 'ProximaNovaSemiBold',
                                              marginTop: -10,
                                            }}
                                            separatorStyle={{color: '#fff'}}
                                            timeToShow={['H', 'M', 'S']}
                                            timeLabels={{
                                              h: 'Hrs',
                                              m: 'Mins',
                                              s: 'Secs',
                                            }}
                                            showSeparator
                                            size={13}
                                          />
                                        </Text>
                                      </Button>
                                    </View>
                                    {visits.drawMode === 'Multiple' && (
                                      // <TouchableWithoutFeedback>
                                      // <TouchableOpacity
                                      //   style={{ zIndex: 1 }}
                                      //   activeOpacity={0.9}
                                      //   onPress={() =>
                                      //     this.setState({ multipleTakes: true })
                                      //   }
                                      // >
                                      //   <Image
                                      //     source={require("../../../assets/images/stacks.png")}
                                      //     style={{
                                      //       height: 30,
                                      //       width: 30,
                                      //       left: 200,
                                      //     }}
                                      //   />
                                      // </TouchableOpacity>
                                      <Button
                                        transparent
                                        rounded
                                        style={{
                                          backgroundColor: 'transparent',
                                          // height: 40,
                                          // width: 40,
                                          left: 160,
                                          zIndex: 1,
                                        }}
                                        onPress={() =>
                                          visits.drawMode === 'Multipe'
                                            ? this.setUptakeStat(visits)
                                            : this.props.navigation.navigate(
                                                'Udetails',
                                                {
                                                  image: visit.imageurl,
                                                  id: visit.drawId,
                                                },
                                              )
                                        }>
                                        <TouchableOpacity
                                          style={{zIndex: 1}}
                                          activeOpacity={0.9}
                                          onPress={() =>
                                            this.setState({
                                              multipleTakes: true,
                                            })
                                          }>
                                          <Image
                                            source={require('../../assets/images/stacks.png')}
                                            style={{
                                              height: 30,
                                              width: 30,
                                            }}
                                          />
                                        </TouchableOpacity>
                                      </Button>
                                      // </TouchableWithoutFeedback>
                                    )}
                                  </TouchableOpacity>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        </View>
                      </View>
                    );
                  })}
                {this.state.tabIndex === 1 && (
                  <TouchableOpacity
                    onPress={() => openSheetOne()}
                    style={{
                      padding: 5,
                      backgroundColor: '#5B9DEE10',
                      borderRadius: 30,
                      flexDirection: 'row',
                      width: '35%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 20,
                      marginTop: 30,
                      paddingRight: 10,
                      paddingLeft: 10,
                      marginBottom: 15,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'ProximaNovaReg',
                        fontSize: 16,
                        color: '#000',
                      }}>
                      All uptakes
                    </Text>
                    <AntDesign
                      name={'downcircleo'}
                      color={'#273444'}
                      style={{
                        fontSize: 16,
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}
                    />
                  </TouchableOpacity>
                )}
                {this.state.tabIndex === 1 &&
                  this.state.myTakes.map((visits, i) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('Udetails2', {
                            image: visits.imageurl,
                            id: visits.drawId,
                          })
                        }
                        key={i}
                        style={[
                          styles.card,
                          {
                            elevation: 3,
                            marginVertical: 20,
                            width: '90%',
                            padding: 0,
                            height: 300,
                            marginHorizontal: 20,
                          },
                        ]}>
                        <Image
                          source={{uri: visits.imageurl}}
                          style={{
                            height: '70%',
                            width: '100%',
                          }}
                          blurRadius={visits.drawStatus === 'Drawn' ? 2 : 0}
                          onPress={() =>
                            this.props.navigation.navigate('Udetails2', {
                              image: visits.imageurl,
                              id: visits.drawId,
                            })
                          }
                        />
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            top: 40,
                            // left: 70
                          }}>
                          {visits.drawStatus === 'Live' ? (
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                              }}>
                              {visits.drawMode === 'Multiple' ? (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                    // left: '9%',
                                    top: '-12%',
                                    // backgroundColor: 'rgba(0,0,0,0.3)',
                                    // borderRadius: 20,
                                  }}>
                                  <View
                                    style={{
                                      backgroundColor: 'rgba(0,0,0,0.3)',
                                      borderRadius: 20,
                                      borderRadius: 30,
                                      flex: 1,
                                      alignItems: 'center',
                                      padding: 20,
                                      // paddingRight: 70,
                                      // paddingLeft: 70,
                                      // paddingTop: 7,
                                      justifyContent: 'space-evenly',
                                    }}>
                                    <Text
                                      style={{
                                        color: '#fff',
                                        fontFamily: 'ProximaNovaAltBold',
                                        fontSize: 30,
                                      }}>
                                      <CountDown
                                        until={Moment(
                                          visits.drawDate,
                                          'HH:mm:ss: A',
                                        ).diff(
                                          Moment().startOf('day'),
                                          'seconds',
                                        )}
                                        digitStyle={{
                                          backgroundColor: 'transparent',
                                          borderWidth: 0,
                                        }}
                                        digitTxtStyle={{color: '#fff'}}
                                        timeLabelStyle={{
                                          color: '#fff',
                                          fontFamily: 'ProximaNovaSemiBold',
                                          marginTop: -10,
                                        }}
                                        separatorStyle={{color: '#fff'}}
                                        timeToShow={['H', 'M', 'S']}
                                        timeLabels={{
                                          h: 'Hrs',
                                          m: 'Mins',
                                          s: 'Secs',
                                        }}
                                        showSeparator
                                        size={30}
                                      />
                                    </Text>

                                    {visits.drawMode === 'Multiple' && (
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.props.navigation.navigate(
                                            'Udetails2',
                                            {
                                              image: visits.imageurl,
                                              id: visits.drawId,
                                            },
                                          )
                                        }
                                        style={{
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          paddingHorizontal: 10,
                                          paddingVertical: 5,
                                          justifyContent: 'space-evenly',
                                          marginTop: 15,
                                        }}>
                                        <Image
                                          source={require('../../assets/images/layerr.png')}
                                          style={{
                                            height: 20,
                                            width: 20,
                                            marginRight: 15,
                                          }}
                                        />
                                        <Text
                                          style={{
                                            color: '#fff',
                                            fontFamily: 'ProximaNovaReg',
                                            fontSize: 16,
                                          }}>
                                          Multiple Uptakes
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                </View>
                              ) : (
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                  }}>
                                  <View
                                    style={{
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flex: 1,
                                      // left: 40,
                                      top: 15,
                                    }}>
                                    <View
                                      style={{
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        borderRadius: 20,
                                        // borderRadius: 30,
                                        flex: 1,
                                        alignItems: 'center',
                                        padding: 10,
                                        paddingRight: 20,
                                        paddingLeft: 20,
                                        paddingTop: -10,
                                        justifyContent: 'center',
                                      }}>
                                      <CountDown
                                        until={Moment(
                                          visits.drawDate,
                                          'HH:mm:ss: A',
                                        ).diff(
                                          Moment().startOf('day'),
                                          'seconds',
                                        )}
                                        digitStyle={{
                                          backgroundColor: 'transparent',
                                          borderWidth: 0,
                                        }}
                                        digitTxtStyle={{color: '#fff'}}
                                        timeLabelStyle={{
                                          color: '#fff',
                                          fontFamily: 'ProximaNovaSemiBold',
                                          marginTop: -10,
                                        }}
                                        separatorStyle={{color: '#fff'}}
                                        timeToShow={['H', 'M', 'S']}
                                        timeLabels={{
                                          h: 'Hrs',
                                          m: 'Mins',
                                          s: 'Secs',
                                        }}
                                        showSeparator
                                        size={30}
                                      />
                                    </View>
                                  </View>
                                </View>
                              )}
                            </View>
                          ) : (
                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1,
                              }}>
                              {visits.userWonStatus === 'Won' ? (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                  }}>
                                  <Image
                                    source={require('../../assets/images/cupp.png')}
                                    style={{
                                      height: 80,
                                      resizeMode: 'contain',
                                      marginBottom: 10,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      textAlignVertical: 'center',
                                      color: '#FFFFFF',
                                      fontSize: 17,
                                      fontFamily: 'ProximaNovaAltBold',
                                      marginTop: 20,
                                    }}>
                                    Congratulations! You won this uptake 🎉{' '}
                                    {'\n'}
                                  </Text>
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      textAlignVertical: 'center',
                                      color: '#FFFFFF',
                                      fontSize: 14,
                                      fontFamily: 'ProximaNovaReg',
                                      marginTop: -10,
                                    }}>
                                    {Moment(visits.drawDate).format(
                                      'MMM DD, YYYY',
                                    )}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                  }}>
                                  <Thumbnail
                                    large
                                    source={{
                                      uri: visits.userImageUrl
                                        ? visits.userImageUrl
                                        : `https://ui-avatars.com/api/?format=png&name=${visits.username}`,
                                    }}
                                    style={[
                                      styles.imageLogoxx,
                                      {marginBottom: 10},
                                    ]}
                                  />
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      textAlignVertical: 'center',
                                      color: '#FFFFFF',
                                      fontSize: 17,
                                      fontFamily: 'ProximaNovaAltBold',
                                      marginTop: 10,
                                    }}>
                                    {visits.username} won this uptake
                                  </Text>
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      textAlignVertical: 'center',
                                      color: '#FFFFFF',
                                      fontSize: 14,
                                      fontFamily: 'ProximaNovaReg',
                                      marginTop: 10,
                                    }}>
                                    {Moment(visits.drawDate).format(
                                      'MMM DD, YYYY',
                                    )}
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingTop: visits.drawStatus === 'Drawn' ? 25 : 10,
                            paddingBottom: 5,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'ProximaNovaAltBold',
                                color: '#000',
                                fontSize: 16,
                              }}>
                              {visits.name}
                            </Text>
                            {visits.drawStatus === 'Live' && (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'ProximaNovaBold',
                                    color: '#000',
                                  }}>
                                  ₦{visits.tamount.split('.')[0]}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: 'ProximaNovaReg',
                                    color: '#000',
                                  }}>
                                  /entry
                                </Text>
                              </View>
                            )}
                            {visits.userWonStatus === 'Won' &&
                              visits.claimStatus === 'Unclaimed' && (
                                <TouchableOpacity
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      'Udetails2',
                                      {
                                        image: visits.imageurl,
                                        id: visits.drawId,
                                      },
                                    )
                                  }
                                  style={{
                                    backgroundColor: '#FF6161',
                                    borderRadius: 30,
                                    width: '30%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontFamily: 'ProximaNovaReg',
                                    }}>
                                    Claim Uptake
                                  </Text>
                                </TouchableOpacity>
                              )}
                            {visits.userWonStatus === 'Won' &&
                              visits.claimStatus === 'Claimed' && (
                                <TouchableOpacity
                                  onPress={() =>
                                    // this.props.navigation.navigate('Udetails2', {
                                    //   image: visits.imageurl,
                                    //   id: visits.drawId,
                                    // })
                                    null
                                  }
                                  style={{
                                    borderColor: '#FF6161',
                                    borderWidth: 2,
                                    borderRadius: 30,
                                    width: '34%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#000',
                                      fontFamily: 'ProximaNovaReg',
                                    }}>
                                    Uptake claimed
                                  </Text>
                                </TouchableOpacity>
                              )}
                          </View>
                          <View
                            style={
                              {
                                // flexDirection: "row",
                                // alignItems: "center",
                                // justifyContent: "space-between",
                                // flexDirection: "row",
                                // alignItems: "center",
                              }
                            }>
                            {visits.drawStatus === 'Live' &&
                            visits.drawStatus !== 'Drawn' &&
                            visits.userWonStatus === 'NotWin' ? (
                              <View
                                style={{
                                  alignItems: 'flex-end',
                                  flexDirection: 'row',
                                  justifyContent: 'flex-end',
                                  marginTop: 15,
                                }}>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      'Udetails2',
                                      {
                                        image: visits.imageurl,
                                        id: visits.drawId,
                                      },
                                    )
                                  }
                                  style={{
                                    backgroundColor: '#FF6161',
                                    borderRadius: 30,
                                    width: '50%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    justifyContent: 'space-evenly',
                                  }}>
                                  <Image source={tick} />
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontFamily: 'ProximaNovaReg',
                                    }}>
                                    Get more enteries
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <Text></Text>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                {this.state.tabIndex === 1 && this.state.myTakes.length === 0 && (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 30,
                    }}>
                    <Image
                      source={require('../../assets/images/alien.png')}
                      style={[
                        styles.imageLogo,
                        {height: 100, width: 100, resizeMode: 'contain'},
                      ]}
                    />
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
                        Winners are being made, will your story be told
                      </Text>
                    </Text>
                  </View>
                )}

                {this.state.tabIndex === 2 && (
                  <TouchableOpacity
                    onPress={() => openSheetTwo()}
                    style={{
                      padding: 5,
                      backgroundColor: '#5B9DEE10',
                      borderRadius: 30,
                      flexDirection: 'row',
                      width: '35%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 20,
                      marginTop: 30,
                      paddingRight: 10,
                      paddingLeft: 10,
                      marginBottom: 15,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'ProximaNovaReg',
                        fontSize: 16,
                        color: '#000',
                      }}>
                      Last month
                    </Text>
                    <AntDesign
                      name={'downcircleo'}
                      color={'#273444'}
                      style={{
                        fontSize: 16,
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}
                    />
                  </TouchableOpacity>
                )}
                {this.state.tabIndex === 2 &&
                  this.state.stories.map((visits, i) => {
                    return (
                      <View
                        key={i}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                        }}>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('Story', {
                              id: visits.id,
                              dimage: visits.imageUrl,
                            })
                          }
                          style={[
                            styles.card,
                            {
                              elevation: 3,
                              marginVertical: 20,
                              width: deviceWidth * 0.85,
                              padding: 0,
                              height: 400,
                            },
                          ]}>
                          <Image
                            source={{uri: visits.imageUrl}}
                            style={{
                              height: '80%',
                              width: '100%',
                              resizeMode: 'cover',
                              flex: 1,
                            }}
                          />
                          <View
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 10,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'ProximaNovaAltBold',
                                  color: '#000',
                                }}>
                                {visits.title}
                              </Text>
                              <TouchableOpacity
                                onPress={() =>
                                  this.props.navigation.navigate('Story', {
                                    id: visits.id,
                                    dimage: visits.imageUrl,
                                  })
                                }
                                style={{
                                  backgroundColor: '#FF6161',
                                  borderRadius: 30,
                                  width: '30%',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                  justifyContent: 'center',
                                }}>
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontFamily: 'ProximaNovaReg',
                                  }}>
                                  See Story
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
              </View>
            </TouchableWithoutFeedback>
            <RBSheet
              ref={(ref) => {
                this.RBSheet = ref;
              }}
              height={300}
              openDuration={250}
              customStyles={{
                container: {
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                  // justifyContent: "center",
                  // alignItems: "center",
                },
              }}>
              <Text
                style={{
                  fontFamily: 'ProximaNovaSemiBold',
                  fontSize: 16,
                  color: '#000',
                  textAlign: 'center',
                  marginTop: 30,
                }}>
                Filter options
              </Text>
              <View style={{padding: 10}}>
                <View style={[]}>
                  {this.state.options.map((item, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => this._handleOptionSelectedOne(item)}
                        activeOpacity={0.8}
                        style={[
                          styles.radioButton,
                          {
                            backgroundColor: '#F2F7FB',
                            padding: 10,
                            marginHorizontal: 15,
                            marginVertical: 7,
                            borderRadius: 30,
                            paddingVertical: 20,
                          },
                        ]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={[styles.label, {color: '#000'}]}>
                            {item}
                          </Text>
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
                                    this.state.chosenIndex === i
                                      ? '#2ba2d3'
                                      : '#fff',
                                },
                              ]}
                            />
                            {/* ) : null} */}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </RBSheet>
            <RBSheet
              ref={(ref) => {
                this.RBSheet2 = ref;
              }}
              height={300}
              openDuration={250}
              customStyles={{
                container: {
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                },
              }}>
              <Text
                style={{
                  fontFamily: 'ProximaNovaSemiBold',
                  fontSize: 16,
                  color: '#000',
                  textAlign: 'center',
                  marginTop: 30,
                }}>
                Filter options
              </Text>
              <View style={{padding: 10}}>
                <View style={[]}>
                  {this.state.optionsTwo.map((item, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => this._handleOptionSelectedTwo(item)}
                        activeOpacity={0.8}
                        style={[
                          styles.radioButton,
                          {
                            backgroundColor: '#F2F7FB',
                            padding: 10,
                            marginHorizontal: 15,
                            marginVertical: 7,
                            borderRadius: 30,
                            paddingVertical: 20,
                          },
                        ]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={[styles.label, {color: '#000'}]}>
                            {item}
                          </Text>
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
                                    this.state.chosenIndex === i
                                      ? '#2ba2d3'
                                      : '#fff',
                                },
                              ]}
                            />
                            {/* ) : null} */}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </RBSheet>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.multipleTakes}
              onRequestClose={() => {}}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <View
                  style={{
                    marginTop: 70,
                    // marginLeft: 20,
                    // marginRight: 20,
                    // borderWidth: 10,
                    // borderColor: "white",
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      backgroundColor: 'white',
                      width: 375,
                      borderRadius: 30,
                    }}>
                    <Image
                      source={require('../../assets/images/stack.png')}
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
                        Multiple uptakes
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
                        This uptake contains multiple products available to be
                        won
                      </Text>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 50,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.goToNext();
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
          </ScrollView>
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

export default Available;
