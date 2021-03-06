import React, {Component} from 'react';
import {
  View,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
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
import CountDown from 'react-native-countdown-component';

class Guest extends Component {
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
      seenMultiple: null,
      imgUrl: null,
      drawId: null,
      seenMultiple: null,

    };
  }

  _onRefresh = async () => {
    this.setState({refreshing: true});
    this.fetchApi();
    this.setState({refreshing: false});
  };

  async popStackModal(img, draw) {
    console.log(img, draw);
    this.setState({imgUrl: img});
    this.setState({drawId: draw});
    // await AsyncStorage.setItem('@img_url', 'true');
    // await AsyncStorage.setItem('@draw_id', 'true');

    if (this.state.seenMultiple == 'false' || this.state.seenMultiple == null) {
      await AsyncStorage.setItem('@seen_stack', 'true');
      this.setState({multipleTakes: true});
      return;
    }
    this.props.navigation.push('GuestUser', {
      image: img,
      id: draw,
    });
  }

  goToNext() {
    this.setState({multipleTakes: false});
    this.props.navigation.push('GuestUser', {
      image: this.state.imgUrl,
      id: this.state.drawId,
    });
  }

  async componentDidMount() {
    const stat = await AsyncStorage.getItem('@seen_stack');
    this.setState({seenMultiple: stat});
    const vm = this;
    let time = new Date().getHours();
    this.setState({timeNow: time});
    NetInfo.addEventListener(async (state) => {
      vm.setState({networkStatus: state.isConnected});
      if (vm.state.networkStatus) {
        vm.setState({netOpacity: 1});
      }
      vm.fetchApi();
    });
    this.fetchApi();
  }

  fetchApi() {
    const vm = this;
    Promise.all([this._availableUptake()])
      .then((results) => {
        var avUptakes = results[0].data.data;
        vm.setAvailableUptakes(avUptakes);

        vm.setState({showView: true});
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }

  _availableUptake = async () => {
    this.setState({Spinner: true});
    return axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/draws/livedraws`,
      params: {},
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

  render() {
    if (this.state.networkStatus) {
      if (this.state.showView) {
        return (
          <ScrollView
            style={{flex: 1, backgroundColor: '#fff', paddingTop: 15}}
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
                      Guest
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
                      activeOpacity={0.8}
                      onPress={() => this.props.navigation.navigate('Login')}
                      style={[
                        styles.card,
                        {
                          padding: 15,
                          borderRadius: 40,
                          elevation: 4,
                          borderBottomLeftRadius: 40,
                          borderBottomRightRadius: 40,
                          marginRight: 10,
                        },
                      ]}>
                      <View
                        style={{
                          backgroundColor: '#FF6161',
                          borderRadius: 15,
                          height: 15,
                          width: 15,
                          position: 'absolute',
                          top: -3,
                          right: 3,
                        }}></View>
                      <View>
                        <Image source={robot} style={{height: 25, width: 25}} />
                      </View>
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
                                    this.popStackModal(
                                      visits.imageurl,
                                      visits.drawId,
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
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.popStackModal(
                                            visits.imageurl,
                                            visits.drawId,
                                          )
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
                                      </TouchableOpacity>
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
                                        borderRadius: 20,
                                        paddingHorizontal: 5,
                                        alignItems: 'center',
                                        justifyContent: 'center',
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
                                    this.props.navigation.navigate('Udetails', {
                                      image: visits.imageurl,
                                      id: visits.drawId,
                                    })
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
                                    this.props.navigation.navigate('Udetails', {
                                      image: visits.imageurl,
                                      id: visits.drawId,
                                    })
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

export default Guest;
