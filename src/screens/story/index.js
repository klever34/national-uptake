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
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';

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

class Story extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimage: '',
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

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    );
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
          <Container>
            {/* <NavigationEvents onDidFocus={() => this.getToken()} /> */}

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
                // source={inputImage}
                // resizeMode="stretch"
                style={[
                  styles.image2,
                  {
                    borderTopRightRadius: 30,
                    borderTopLeftRadius: 30,
                    backgroundColor: '#fff',
                  },
                ]}>
                <View
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    flexDirection: 'row',
                  }}>
                  <H1
                    style={[styles.textInput, {fontFamily: 'ProximaNovaReg'}]}>
                    {this.state.uptakes.title}
                  </H1>
                  <Right>
                    <Text
                      style={{
                        color: '#273444',
                        fontSize: 10,
                        fontWeight: '100',
                        marginRight: 10,
                        fontFamily: 'ProximaNovaReg',
                      }}>
                      Draw date {'\n'}
                      <Text
                        style={{
                          color: '#273444',
                          fontSize: 12,
                          fontWeight: '100',
                          fontFamily: 'ProximaNovaReg',
                        }}>
                        July 20, 2020
                      </Text>
                    </Text>
                  </Right>
                </View>

                <Content
                  padder
                  style={{
                    borderRadius: 10,
                    borderColor: 'white',
                    borderWidth: 5,
                    shadowColor: 'white',
                  }}>
                  <List>
                    <ListItem style={styles.selectStyle2}>
                      <Left>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                          <Thumbnail
                            large
                            source={{
                              uri: `${this.state.uptakes.wonItemImageUrl}`,
                            }}
                            style={styles.imageLogo}
                          />

                          <View
                            style={{
                              marginLeft: 20,
                              flex: 1,
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 12,
                                fontFamily: 'ProximaNovaAltBold',
                              }}>
                              {this.state.uptakes.wonItem}
                            </Text>
                          </View>
                        </View>
                      </Left>
                    </ListItem>
                  </List>

                  <Text
                    style={{
                      color: '#273444',
                      fontSize: 16,
                      marginLeft: 10,
                      marginRight: 0,
                      marginTop: 20,
                      fontFamily: 'ProximaNovaReg',
                    }}>
                    {this.state.uptakes.story}
                  </Text>

                  <View
                    style={{
                      marginTop: 15,
                      alignSelf: 'center',
                      marginBottom: 10,
                    }}>
                    <TouchableOpacity onPress={() => this.handleClick()}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={vid}
                          style={{
                            resizeMode: 'contain',
                            height: '40%',
                            width: '90%',
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginTop: 15,
                      alignSelf: 'center',
                      marginBottom: 10,
                    }}>
                    <View>
                      <Image source={cong} style={{height: 100, width: 100}} />
                    </View>
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
                        fontSize: 16,
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
                        fontSize: 16,
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

                  <H1
                    style={[
                      styles.textInput,
                      {fontFamily: 'ProximaNovaAltBold'},
                    ]}>
                    Popular uptakes 🔥
                  </H1>

                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {this.state.available.map((visits, i) => {
                      return (
                        <View
                          key={visits.drawId}
                          style={{
                            marginLeft: 0,
                            backgroundColor: 'white',
                            borderRadius: 10,
                            borderWidth: 10,
                            borderColor: 'white',
                            marginRight: 10,
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.state.userData.firstname === 'Guest'
                                ? this.props.navigation.navigate('Welcome')
                                : this.props.navigation.navigate('Udetails', {
                                    image: visits.imageurl,
                                    id: visits.drawId,
                                  });
                            }}>
                            <ImageBackground
                              source={{uri: visits.imageurl}}
                              style={styles.imageMain}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignSelf: 'flex-end',
                                  marginTop: 20,
                                  marginLeft: 20,
                                }}>
                                <Button small rounded style={styles.buttonimg2}>
                                  <Text style={styles.textMain3}>
                                    {Moment(visits.drawDate).format('hh:mm:ss')}
                                  </Text>
                                </Button>

                                <Right>
                                  {/* {visits.drawMode === 'Multiple' ?
                                                        <Button small rounded style={styles.buttonimg2} onPress={() => {this.showNo();}}>
                                                        <Icon type="MaterialIcons" name='layers' style={{color: 'white', fontSize: 14, }}></Icon>
                                                            </Button>
                                                            :
                                                            <View></View>
                                                            } */}
                                </Right>
                              </View>
                            </ImageBackground>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                              }}>
                              <Text
                                style={[
                                  styles.textMain,
                                  {fontFamily: 'ProximaNovaAltBold'},
                                ]}>
                                {visits.name}
                              </Text>

                              <Right>
                                <Text
                                  style={[
                                    styles.textMain2,
                                    {fontFamily: 'ProximaNovaReg'},
                                  ]}>
                                  {'\u20A6'}
                                  {visits.tamount}/entry
                                </Text>
                              </Right>
                            </View>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                              }}>
                              <Image source={pep} />

                              <Right>
                                <View
                                  style={{
                                    alignSelf: 'flex-end',
                                    flexDirection: 'row',
                                    marginBottom: 10,
                                    marginRight: 10,
                                    marginTop: 10,
                                  }}>
                                  <Button
                                    small
                                    block
                                    rounded
                                    style={styles.bottonEnter}
                                    onPress={() => {
                                      this.state.userData.firstname === 'Guest'
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
                                    }}>
                                    <Image
                                      source={tick}
                                      resizeMode="contain"
                                      style={{
                                        width: 12,
                                        marginRight: -10,
                                        marginLeft: 20,
                                      }}></Image>
                                    <Text
                                      style={[
                                        styles.textMain3,
                                        {fontFamily: 'ProximaNovaSemiBold'},
                                      ]}>
                                      Enter
                                    </Text>
                                  </Button>
                                </View>
                              </Right>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </ScrollView>
                </Content>
              </View>
            </ImageBackground>

            {/* <Modal
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
            </Modal> */}

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
                          fontSize: 14,
                          fontFamily: 'ProximaNovaReg',
                          marginVertical: 20,
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
                            this.hideAlert();
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
                            OK
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
                    reps will reach out to you on the phone number on your
                    profile within the next 2-24 hours.Please verify that this
                    number is correct and still active. Update it if it isnt.
                  </Text>
                  <Button
                    block
                    rounded
                    style={styles.bottonStyle}
                    onPress={() => {
                      this.hideYes();
                    }}>
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
