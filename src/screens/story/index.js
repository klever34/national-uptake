import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  BackHandler,
  ImageBackground,
  Text,
  Image,
  Dimensions,
} from 'react-native';

import {Button} from 'native-base';

import styles from './style';
import axios from 'axios';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

const yes = require('../../assets/images/claim.png');
const no = require('../../assets/images/no.png');
const inputImage = require('../../assets/images/inputDrop.png');
const vid = require('../../assets/images/vid2.png');
const cong = require('../../assets/images/congee.png');
const pep = require('../../assets/images/pep.png');
const tick = require('../../assets/images/Ticket.png');

import {NavigationEvents} from 'react-navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NetInfo from '@react-native-community/netinfo';
import {ScrollView} from 'react-native-gesture-handler';
const deviceWidth = Dimensions.get('window').width;
import CountDown from 'react-native-countdown-component';

class Story extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimage: '',
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
      Timage:
        'https://oftencoft-pictures.s3.us-east-2.amazonaws.com/fikayo.jpeg',
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
      available: [],
      showView: false,
      networkStatus: null,
    };
  }

  async componentDidMount() {
    const vm = this;
    NetInfo.addEventListener((state) => {
      console.log(state.isConnected);
      vm.setState({networkStatus: state.isConnected});
      vm.getToken();
      vm.Uptake();
      vm.availableUptake();
    });
    await this.getToken();
    await this.availableUptake();
    await this.Uptake();
    setTimeout(() => {
      this.setState({showView: true});
    }, 2000);
  }

  getToken = async () => {
    try {
      // this.setState({ Spinner: true });
      const dimage = this.props.route.params.dimage;
      const drawId = this.props.route.params.id;
      const userProfile = await AsyncStorage.getItem('userData');

      this.setState({dimage});
      this.setState({drawId});

      if (userProfile === null) {
        const userData = {
          firstname: 'Guest',
          lastname: 'Guest',
        };
        this.setState({userData});
      } else {
        const userData = JSON.parse(userProfile);
        this.setState({userData});
      }
    } catch (error) {
      // console.log(error);
      this.props.navigation.navigate('Available');
    }
  };

  async Uptake() {
    // this.setState({ Spinner: true });
    const token = await AsyncStorage.getItem('user_token');
    try {
      const response = await axios({
        method: 'GET',
        url: `${this.state.baseURL}/api/winnerstories/${this.state.drawId}`,
        params: {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let uptakes = response.data.data;
      console.log(uptakes);
      this.setState({uptakes});
    } catch (error) {
      // this.setState({ Spinner: false });
      // this.setState({ message: error.response.data.message });
      // this.showAlert();
    }
  }

  async availableUptake() {
    // this.setState({ Spinner: true });
    const token = await AsyncStorage.getItem('user_token');
    try {
      const response = await axios({
        method: 'GET',
        url: `${this.state.baseURL}/api/draws/populardraws`,
        params: {},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let available = response.data.data;

      this.setState({available});
    } catch (error) {
      // console.log(error);
    }
    // axios({
    //   method: "GET",
    //   url: `${this.state.baseURL}/api/draws/populardraws`,
    //   params: {},
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    //   .then(
    //     function (response) {
    //       this.setState({ Spinner: false });

    //       let available = response.data.data;

    //       this.setState({ available });
    //     }.bind(this)
    //   )
    //   .catch(
    //     function (error) {
    //       // this.setState({ Spinner: false });
    //       // this.setState({ message: error.response.data.message });
    //       this.showErr();
    //     }.bind(this)
    //   );
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

  handleClick = () => {
    Linking.canOpenURL(this.state.uptakes.videoUrl).then((supported) => {
      if (supported) {
        Linking.openURL(this.state.uptakes.videoUrl);
      } else {
        console.log(
          "Don't know how to open URI: " + this.state.uptakes.videoUrl,
        );
      }
    });
  };

  render() {
    if (this.state.networkStatus) {
      if (this.state.showView) {
        return (
          <ScrollView style={{flex: 1}}>
            <View style={{flex: 1}}>
              <ImageBackground
                source={{
                  uri: this.state.uptakes.imageUrl
                    ? this.state.uptakes.imageUrl
                    : this.state.Timage,
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
                </View>
              </ImageBackground>
              <View
                style={{
                  backgroundColor: 'white',
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                  marginTop: -50,
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                    marginHorizontal: 5,
                  }}>
                  <Text
                    style={{fontFamily: 'ProximaNovaSemiBold', fontSize: 18}}>
                    {this.state.uptakes.title}
                  </Text>
                  <View>
                    <Text style={{fontFamily: 'ProximaNovaReg', fontSize: 10}}>
                      Draw date
                    </Text>
                    <Text style={{fontFamily: 'ProximaNovaReg', fontSize: 12}}>
                      July 20, 2020
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    borderRadius: 20,
                    alignItems: 'center',
                    backgroundColor: '#5B9DEE10',
                    margin: 20,
                  }}>
                  <Image
                    source={{uri: `${this.state.uptakes.wonItemImageUrl}`}}
                    style={{height: 80, width: 80, borderRadius: 80}}
                  />
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaSemiBold',
                      fontSize: 18,
                      marginLeft: 15,
                    }}>
                    {this.state.uptakes.wonItem}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'ProximaNovaReg',
                    fontSize: 14,
                    marginHorizontal: 15,
                  }}>
                  {this.state.uptakes.story}
                </Text>
                <View style={{alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/images/vid2.png')}
                    style={{height: 300, width: '100%', resizeMode: 'contain'}}
                  />
                </View>

                <View
                  style={{
                    marginTop: 10,
                    alignSelf: 'center',
                    marginBottom: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.handleClick()
                    }>
                    <Image source={cong} style={{height: 100, width: 100}} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginTop: 5,
                    alignSelf: 'center',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: '#273444',
                      fontSize: 16,
                      marginLeft: 10,
                      marginRight: 0,
                      marginTop: 20,
                      fontFamily: 'ProximaNovaAltBold',
                      textAlign: 'center',
                    }}>
                    Congrats {this.state.uptakes.title}!
                  </Text>
                  <Text
                    style={{
                      color: '#273444',
                      fontSize: 14,
                      marginLeft: 10,
                      marginRight: 0,
                      marginTop: 20,
                      textAlign: 'center',
                      fontFamily: 'ProximaNovaReg',
                    }}>
                    Feeling good? Chooses below to enter a giveaway of your
                    choice.
                  </Text>

                  <Text
                    style={{
                      color: '#273444',
                      fontSize: 14,
                      marginLeft: 10,
                      marginRight: 0,
                      marginTop: 20,
                      textAlign: 'center',
                      fontFamily: 'ProximaNovaReg',
                    }}>
                    Be like {this.state.uptakes.title}, take a chance!
                  </Text>
                </View>
                <View></View>

                <Text
                  style={[
                    styles.textInput,
                    {fontFamily: 'ProximaNovaAltBold'},
                  ]}>
                  Popular uptakes 🔥
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{flex: 1, marginLeft: 15}}>
                  {this.state.available.map((visits, i) => {
                    return (
                      <TouchableOpacity
                        // delayPressIn={this.state.scrollBegin ? 150: 0}
                        activeOpacity={0.8}
                        ref="touchableOpacity"
                        onPress={() =>
                          this.state.userData.firstname === 'Guest'
                            ? this.props.navigation.navigate('Welcome')
                            : this.props.navigation.navigate('Udetails', {
                                image: visits.imageurl,
                                id: visits.drawId,
                              })
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
                            width: deviceWidth * 0.8,
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
                            // onPress={() => {
                            //   this.state.userData.firstname === "Guest"
                            //     ? this.props.navigation.navigate(
                            //         "Welcome"
                            //       )
                            //     : this.props.navigation.navigate(
                            //         "Udetails",
                            //         {
                            //           image: visits.imageurl,
                            //           id: visits.drawId,
                            //         }
                            //       );
                            // }}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 15,
                            }}>
                            {visits.randomUserImgs !== null && (
                              <View style={{flexDirection: 'row'}}>
                                {visits.randomUserImgs.map((item, i) => (
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
                                ))}
                              </View>
                            )}
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
                                ).diff(Moment().startOf('day'), 'seconds')}
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
            }}>
            There is no internet connection. Please check your internet
            connection and try again.
          </Text>
          <TouchableOpacity
            style={styles.refreshBtn}
            // onPress={() => this.refresh()}
          >
            <Text style={{color: '#fff', fontFamily: 'ProximaNovaReg'}}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

export default Story;
