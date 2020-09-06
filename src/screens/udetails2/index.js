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
  Dimensions
} from 'react-native';

import styles from './style';

import axios from 'axios';

import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
const yes = require('../../assets/images/claim.png');
const no = require('../../assets/images/no.png');
const inputImage = require('../../assets/images/inputDrop.png');
import CountDown from 'react-native-countdown-component';
const deviceHeight = Dimensions.get('window').height;

import {NavigationEvents} from 'react-navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PaystackWebView from 'react-native-paystack-webview';

class Udetails2 extends Component {
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
      userTickets: [],
      userWonStatus: '',
      drawStatus: '',
      ent: false,
      winners: [],
      showNo: false,
      showYes: false,
      claimStatus: '',
      congrats: false,
      drawTaken: false,
      showView: false,
      imagez: false,
      indicator: false,
      userHasWon: false,
      dynamicHeight: 0.5,
      swapIcon: true,
    };
  }

  async componentDidMount() {
    await this.getToken();
    await this.Uptake();
    // await this.getCardRequest();
  }

  getToken = async () => {
    try {
      this.setState({Spinner: true});
      const image = this.props.route.params.image;
      const drawId = this.props.route.params.id;
      const userProfile = await AsyncStorage.getItem('userData');
      const userWonStatus = this.props.route.params.userWonStatus;
      const drawStatus = this.props.route.params.drawStatus;
      const claimStatus = this.props.route.params.claimStatus;

      this.setState({image});
      this.setState({drawId});
      // this.setState({userWonStatus});
      // this.setState({drawStatus});
      // this.setState({claimStatus});

      if (userProfile === null) {
        this.props.navigation.navigate('Login');
      } else {
        this.setState({logged: 'yes'});
        const userData = JSON.parse(userProfile);
        this.setState({userData});
      }
    } catch (error) {
      this.props.navigation.navigate('Available');
    }
  };

  async Uptake() {
    const token = await AsyncStorage.getItem('user_token');
    const vm = this;
    this.setState({Spinner: true});
    axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/draws/getdraw/${this.state.drawId}/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(
        function (response) {
          // console.log(response.data);
          this.setState({Spinner: false});

          let uptakes = response.data.draw;
          this.setState({uptakes: uptakes});
          let items = response.data.draw.items;
          let userTickets = response.data.draw.userTickets;
          let userW = userTickets.filter((item, i) => {
            if(item.winstatus === 'Won'){
                return item
            }
          });
          if(userW.length > 0) {
            this.setState({userHasWon: true})
          }
          console.log(userW);
          let winners = response.data.draw.winners;

          this.setState({items});
          this.setState({userTickets});
          this.setState({winners});

          vm.setState({showView: true});
          // console.log(this.state.uptakes);ß
        }.bind(this),
      )
      .catch(
        function (error) {
          console.log(error);
          this.setState({Spinner: false});
          this.setState({message: this.state.default_message});
          this.showAlert();
        }.bind(this),
      );
  }

  async payUptake() {
    const token = await AsyncStorage.getItem('user_token');
    this.setState({Spinner: true});
    axios({
      method: 'POST',
      url: `${this.state.baseURL}/api/payment/initialize`,
      data: {
        userId: this.state.userData.userid,
        drawId: this.state.drawId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(
        function (response) {
          this.setState({Spinner: false});

          this.props.navigation.navigate('Suc', {drawid: this.state.drawId});
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({Spinner: false});
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

  async claimUptake() {
    this.setState({indicator: true});
    const token = await AsyncStorage.getItem('user_token');
    // this.setState({Spinner: true});
    axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/tickets/claimstatus/${this.state.userData.userid}/${this.state.drawId}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(
        function (response) {
          console.log(response.data)
          this.setState({indicator: false});
          this.setState({drawTaken: true});
        }.bind(this),
      )
      .catch(
        function (error) {
          console.log(error.response)
          this.setState({indicator: false});

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

  async paidUptake() {
    const token = await AsyncStorage.getItem('user_token');
    this.setState({Spinner: true});
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(
        function (response) {
          this.setState({Spinner: false});

          this.props.navigation.navigate('Suc', {drawid: this.state.drawId});
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({Spinner: false});
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

  async getCardRequest() {
    const token = await AsyncStorage.getItem('user_token');
    this.setState({Spinner: true});

    axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/payment/getdefaultcard/${this.state.userData.userid}`,
      params: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(
        function (response) {
          console.log(response.data.data);
          this.setState({Spinner: false});

          if (response.data.status === 'success') {
            this.setState({cards: response.data.data});
          } else {
            this.setState({message: this.state.default_message});
            this.showAlert();
          }
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({Spinner: false});
          this.setState({message: this.state.default_message});
          this.showAlert();
        }.bind(this),
      );
  }

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  addValue = () => {
    this.setState({
      value: this.state.value + 1,
    });
  };

  ducValue = () => {
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

  toggleEnt = () => {
    this.setState({
      ent: !this.state.ent,
    });
  };

  showNo() {
    this.setState({
      showNo: true,
    });
  }

  hideNo() {
    this.setState({
      showNo: false,
    });
  }

  showYes() {
    this.setState({
      showYes: true,
    });
  }

  hideYes() {
    this.setState({
      showYes: false,
    });
  }

  toggleImagez = (urlx) => {
    this.setState({
      imagezLink: urlx,
    });

    this.setState({
      imagez: !this.state.imagez,
    });

    // this.setState({
    //   showBlur: !this.state.showBlur,
    // });
  };

  render() {
    const B = (props) => (
      <Text style={{fontFamily: 'ProximaNovaBold'}}>{props.children}</Text>
    );

    const changeHeight = () => {
      let testSwap = !this.state.swapIcon;
      this.setState({swapIcon: testSwap});
      if (this.state.dynamicHeight === 0.5) {
        this.setState({dynamicHeight: 0.60});
      } else {
        this.setState({dynamicHeight: 0.5});
      }
    };

    const testData = this.state.uptakes.draw;

    if (this.state.showView) {
      return (
        <Container>
          {/* <NavigationEvents onDidFocus={() => this.getToken()} /> */}

          <ImageBackground
            source={{
              uri: this.state.image ? this.state.image : this.state.Timage,
            }}
            style={styles.imageContainer}>
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
                  source={require("../../assets/images/chatt.png")}
                  style={{ height: 23, width: 23 }}
                />
              </TouchableOpacity> */}
              </Right>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: -303, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 30, padding: 20}}>
                  {this.state.uptakes.status !== 'Drawn' && (
                      <CountDown
                        until={Moment(
                          `${this.state.uptakes.drawDate}`,
                          'HH:mm:ss: A',
                        ).diff(Moment().startOf('day'), 'seconds')}
                        digitStyle={{
                          backgroundColor: 'transparent',
                          borderWidth: 0,
                          marginTop: -13,
                        }}
                        digitTxtStyle={{color: '#fff'}}
                        timeLabelStyle={{
                          color: '#fff',
                          fontFamily: 'ProximaNovaSemiBold',
                          marginTop: -7,
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
                  )}
                  {/* <Text>{this.state.uptakes.drawDate}</Text> */}
              </View>
            </View>

            <View
              // source={inputImage}
              // resizeMode="stretch"
              style={[
                styles.image2,
                {
                  backgroundColor: 'white',
                  padding: 10,
                  height: deviceHeight * this.state.dynamicHeight
                },
              ]}
              // style={}
            >
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
              <Text
                style={[
                  {
                    fontFamily: 'ProximaNovaSemiBold',
                    alignItems: 'flex-start',
                    fontSize: 20,
                    paddingHorizontal: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    marginLeft: 7,
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

              <Content padder style={{}}>
                <Text
                  style={[
                    {
                      fontFamily: 'ProximaNovaSemiBold',
                      alignItems: 'flex-start',
                      fontSize: 20,
                      paddingHorizontal: 10,
                      // marginTop: 5,
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
                    paddingVertical: 10,
                  }}>
                  {this.state.uptakes.description}
                </Text>
                {this.state.items.length > 0 ? (
                  <View>
                    <Text
                      style={[
                        {
                          fontFamily: 'ProximaNovaSemiBold',
                          alignItems: 'flex-start',
                          fontSize: 20,
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                        },
                      ]}>
                      Uptakes
                    </Text>

                    {this.state.items.length > 0 && (
                      <List>
                        {this.state.items.map((item, i) => {
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
                    )}
                  </View>
                ) : (
                  <View>
                    <Text
                      style={[
                        {
                          fontFamily: 'ProximaNovaSemiBold',
                          alignItems: 'flex-start',
                          fontSize: 20,
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                        },
                      ]}>
                      Uptakes Winners
                    </Text>
                    <List>
                      {this.state.winners.map((item, i) => {
                        return (
                          <View key={i}>
                            {this.state.userData.userid === item.userid}
                            <ListItem style={styles.selectStyle2}>
                              <Left>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                  <View
                                    style={{
                                      marginLeft: 20,
                                      flex: 1,
                                      flexDirection: 'row',
                                    }}>
                                    <Thumbnail
                                      large
                                      source={{uri: `${item.profileImgUrl}`}}
                                      style={styles.imageLogo2}
                                    />
                                    <Text
                                      style={{
                                        color: 'black',
                                        fontSize: 12,
                                        fontFamily: 'ProximaNovaReg',
                                      }}>
                                      {item.name} {'\n'}
                                      <Text
                                        style={{fontFamily: 'ProximaNovaReg'}}>
                                        {item.itemName}
                                      </Text>
                                    </Text>
                                  </View>
                                  <Thumbnail
                                    large
                                    source={{uri: `${item.itemImgUrl}`}}
                                    style={styles.imageLogo}
                                  />
                                </View>
                              </Left>
                            </ListItem>
                          </View>
                        );
                      })}
                    </List>
                  </View>
                )}
                {this.state.uptakes.ticketCount > 0 ? (
                  <View>
                    <Text
                      style={[
                        {
                          fontFamily: 'ProximaNovaSemiBold',
                          alignItems: 'flex-start',
                          fontSize: 20,
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                          marginTop: 15
                        },
                      ]}>
                      Your enteries
                    </Text>
                    <List>
                      <ListItem
                        onPress={() => {
                          this.toggleEnt();
                        }}
                        style={styles.selectStyle}>
                        <Left>
                          <Text
                            style={{
                              color: 'black',
                              marginLeft: 20,
                              fontFamily: 'ProximaNovaReg',
                            }}>
                            {this.state.uptakes.ticketCount} enteries.
                          </Text>
                        </Left>
                        <Right>
                          {this.state.ent === true ? (
                            <AntDesign
                              name="upcircleo"
                              style={{color: 'black', fontSize: 14}}
                            />
                          ) : (
                            <AntDesign
                              name="downcircleo"
                              style={{color: 'black', fontSize: 14}}
                            />
                          )}
                        </Right>
                      </ListItem>

                      {this.state.ent === true ? (
                        <View>
                          {this.state.userTickets.map((item, i) => {
                            return (
                              <ListItem key={i} style={styles.selectStyle}>
                                <Left>
                                  {/* <Text>Winning Entry</Text> */}
                                  <Text
                                    style={{
                                      color:
                                        item.winstatus === 'Won'
                                          ? '#139a17'
                                          : 'black',
                                      marginLeft: 20,
                                      fontSize: 14,
                                      fontFamily: 'ProximaNovaSemiBold',
                                    }}>
                                    {item.winstatus === 'Won'
                                      ? 'Winning Entry\n'
                                      : ''}
                                    Ticket No: {item.ticketId} {'\n'}
                                    <Text
                                      style={{
                                        color:
                                          item.winstatus === 'Won'
                                            ? '#139a17'
                                            : 'black',
                                        marginLeft: 20,
                                        fontSize: 12,
                                        fontFamily: 'ProximaNovaReg',
                                      }}>
                                      Reference ID: {item.reference}
                                    </Text>
                                  </Text>
                                </Left>
                                <Right>
                                  <Text
                                    style={{
                                      color:
                                        item.winstatus === 'Won'
                                          ? '#139a17'
                                          : 'black',
                                      fontSize: 12,
                                      fontFamily: 'ProximaNovaReg',
                                    }}>
                                    ₦{this.state.uptakes.ticketAmount}
                                  </Text>
                                  <Text
                                    style={{
                                      color:
                                        item.winstatus === 'Won'
                                          ? '#139a17'
                                          : 'black',
                                      fontSize: 12,
                                      fontFamily: 'ProximaNovaReg',
                                    }}>
                                    {this.state.uptakes.dateCreated}
                                    {Moment(item.dateCreated).format(
                                      'YYYY-MM-DD',
                                    )}
                                  </Text>
                                </Right>
                              </ListItem>
                            );
                          })}
                        </View>
                      ) : (
                        <View></View>
                      )}
                    </List>
                  </View>
                ) : (
                  <View></View>
                )}

                  {this.state.userHasWon && <View style={{marginTop: 10}}>
                    <Text
                      style={[
                        {
                          fontFamily: 'ProximaNovaSemiBold',
                          alignItems: 'flex-start',
                          fontSize: 20,
                          paddingHorizontal: 10,
                          marginTop: 10,
                        },
                      ]}>
                      Uptake claim instructions
                    </Text>
                    {/* <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 10}}> */}
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 14,
                        marginLeft: 10,
                        // marginRight: 10,
                        marginTop: 10,
                        fontFamily: 'ProximaNovaReg',
                      }}>
                      You are a winner! Please click the "Claim" button to claim
                      your win! You have <B>180 days</B> from the draw date to
                      claim.
                    </Text>
                  </View>}

                <View>
                  <View>
                    {this.state.uptakes.status === 'Live' ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() =>
                            this.props.navigation.navigate('Udetails', {
                              image: this.state.uptakes.imageUrl,
                              id: this.state.uptakes.drawId,
                            })
                          }
                          style={{
                            backgroundColor: '#FF6161',
                            borderRadius: 30,
                            paddingVertical: 15,
                            width: '95%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 30,
                            elevation: 5
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              alignSelf: 'center',
                              fontFamily: 'ProximaNovaReg',
                            }}>
                            Get more enteries
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : this.state.userWonStatus === 'NotWin' ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() =>
                            this.props.navigation.navigate('Available')
                          }
                          style={{
                            backgroundColor: '#FF6161',
                            borderRadius: 30,
                            paddingVertical: 15,
                            width: '95%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 30,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              alignSelf: 'center',
                              fontFamily: 'ProximaNovaReg',
                            }}>
                            Try Another Uptake
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : this.state.claimStatus === 'Unclaimed' ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => this.claimUptake()}
                          style={{
                            backgroundColor: '#FF6161',
                            borderRadius: 30,
                            paddingVertical: 15,
                            width: '95%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 30,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              alignSelf: 'center',
                              fontFamily: 'ProximaNovaReg',
                            }}>
                            Claim
                          </Text>
                          {this.state.indicator && (
                            <ActivityIndicator
                              size="small"
                              color={'#fff'}
                              // style={{paddingHorizontal: 5, marginTop: -3}}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => this.claimUptake()}
                          style={{
                            backgroundColor: '#FF6161',
                            borderRadius: 30,
                            paddingVertical: 15,
                            width: '95%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 30,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              alignSelf: 'center',
                              fontFamily: 'ProximaNovaReg',
                            }}>
                            Claim
                          </Text>
                          {this.state.indicator && (
                            <ActivityIndicator
                              size="small"
                              color={'#fff'}
                              // style={{paddingHorizontal: 5, marginTop: -3}}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {this.state.userHasWon && 
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => this.claimUptake()}
                        style={{
                          backgroundColor: 'rgba(244,64,53,0.1)',
                          borderRadius: 20,
                          paddingVertical: 10,
                          width: '95%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 30,
                          padding: 10,
                          marginBottom: 20,
                        }}>
                        <Text
                          style={{
                            color: '#f44035',
                            textAlign: 'justify',
                            fontFamily: 'ProximaNovaReg',
                            fontSize: 10,
                            lineHeight: 20,
                          }}>
                          Product uptake winners will not be able to claim
                          unless identity has been confirmed
                        </Text>
                      </TouchableOpacity>
                    </View>
                  }
                </View>
                <View></View>
              </Content>
            </View>
          </ImageBackground>

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
                  }}>
                  Please Add a default card to complete this payment
                </Text>
                <Button
                  block
                  rounded
                  style={styles.bottonStyle}
                  onPress={() => {
                    this.hidePay();
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      alignSelf: 'center',
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
                <Spinner color="red" />
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showYes}
            onRequestClose={() => {}}>
            <View style={{marginTop: 100, alignSelf: 'center'}}>
              <Image
                source={yes}
                resizeMode="contain"
                style={styles.imageLogo3}></Image>
              <View style={{marginTop: 10, alignSelf: 'center'}}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  National Uptake
                </Text>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontWeight: 'bold',
                    marginTop: 10,
                  }}>
                  What you believe is what you get
                </Text>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    marginTop: 10,
                    marginRight: 10,
                    marginLeft: 10,
                    fontSize: 12,
                  }}>
                  Great stuff! You have claimed your win 🙌 One of our lovely
                  reps will reach out to you on the phone number on your profile
                  within the next 2-24 hours.Please verify that this number is
                  correct and still active. Update it if it isnt.
                </Text>
                <Button
                  block
                  rounded
                  style={styles.bottonStyle}
                  onPress={() => {}}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    Okay, got it.
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.congrats}
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
                    source={require('../../assets/images/you_won.png')}
                    resizeMode="contain"
                    style={{
                      position: 'relative',
                      width: 250,
                      height: 250,
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
                      Congratulations! 🎉
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#273444',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          marginTop: 20,
                          marginLeft: 10,
                          fontSize: 15,
                          fontFamily: 'ProximaNovaReg',
                          // marginBottom: 10,
                        }}>
                        You have won this uptake. You have
                      </Text>
                      <Text
                        style={{
                          color: '#273444',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          marginTop: 20,
                          paddingLeft: 3,
                          fontSize: 15,
                          fontFamily: 'ProximaNovaBold',
                          // marginBottom: 10,
                        }}>
                        60 days
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: '#273444',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        marginTop: 5,
                        marginLeft: 2,
                        fontSize: 15,
                        fontFamily: 'ProximaNovaReg',
                        marginBottom: 10,
                      }}>
                      to claim your winning.
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 50,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({congrats: false});
                      }}
                      style={{
                        backgroundColor: '#FF6161',
                        borderRadius: 30,
                        paddingVertical: 15,
                        width: '90%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 25,
                        // opacity: 0.4,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          alignSelf: 'center',
                          fontFamily: 'ProximaNovaReg',
                        }}>
                        See details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.drawTaken}
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
                    source={require('../../assets/images/logooo.png')}
                    resizeMode="contain"
                    style={{
                      position: 'relative',
                      width: 250,
                      height: 250,
                      alignSelf: 'center',
                      marginTop: 40,
                    }}></Image>
                  <View style={{marginTop: 30, alignSelf: 'center'}}>
                    <Text
                      style={{
                        color: '#273444',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: 30,
                        fontFamily: 'ProximaNovaReg',
                      }}>
                      National Uptake
                    </Text>
                    <Text
                      style={{
                        color: '#273444',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: 14,
                        fontFamily: 'ProximaNovaSemiBold',
                        marginVertical: 10,
                      }}>
                      What you believe is what you get
                    </Text>
                    <Text
                      style={{
                        color: '#273444',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        marginTop: 15,
                        paddingHorizontal: 15,
                        fontSize: 15,
                        fontFamily: 'ProximaNovaReg',
                        marginBottom: 10,
                      }}>
                      Great stuff! You have claimed your win 🙌 One of our
                      lovely reps will reach out to you on the phone number on
                      your profile within the next 2-24 hours.Please verify that
                      this number is correct and still active. Update it if it
                      isnt.
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 50,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({drawTaken: false});
                        // this.props.navigation.navigate('Won');
                      }}
                      style={{
                        backgroundColor: '#FF6161',
                        borderRadius: 30,
                        paddingVertical: 15,
                        width: '90%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 25,
                        // opacity: 0.4,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          alignSelf: 'center',
                          fontFamily: 'ProximaNovaReg',
                        }}>
                        Okay, got it.
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
                // marginTop: 100,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                // marginBottom: 40,
                paddingVertical: 40,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  // marginTop: 100,
                  alignSelf: 'center',
                  marginBottom: 40,
                  // backgroundColor: 'rgba(0,0,0,0.5)',
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
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showNo}
            onRequestClose={() => {}}>
            <View style={{marginTop: 200, alignSelf: 'center'}}>
              <Image
                source={no}
                resizeMode="contain"
                style={styles.imageLogo3}></Image>
              <View style={{marginTop: 30, alignSelf: 'center'}}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  Something went wrong
                </Text>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    marginTop: 10,
                  }}>
                  There was an error when adding your card, Please check your
                  details again and try again
                </Text>
                <Button
                  block
                  rounded
                  style={styles.bottonStyle}
                  onPress={() => {
                    this.hideNo();
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    OK
                  </Text>
                </Button>
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

export default Udetails2;
