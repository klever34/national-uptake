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
  ActionSheet,
} from 'native-base';
import {
  ImageBackground,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Linking,
  BackHandler,
} from 'react-native';
import {AuthContext} from '../../../context';

import styles from './style';

import axios from 'axios';

const robot = require('../../assets/images/top.png');

const launchLogo = require('../../assets/images/prof.png');

const inputImage = require('../../assets/images/inputDrop.png');

import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

import 'intl';

import 'intl/locale-data/jsonp/en';
var BUTTONS = [
  {text: 'Take a photo', icon: 'md-done-all', iconColor: '#2c8ef4'},
  {text: 'Choose from galary', icon: 'aperture', iconColor: '#ea943b'},
  {text: 'Remove image', icon: 'analytics', iconColor: '#f42ced'},
];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NavigationEvents, withNavigationFocus} from 'react-navigation';
const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      email: '',
      baseURL: 'https://dragonflyapi.nationaluptake.com/',
      message: '',
      default_message: 'Please check your internet connection',
      showAlert: false,
      message_title: '',
      Spinner: false,
      tokenz: '',
      created_at: '',
      setFeedback: false,
      feebackMsg: '',
      pic: 'https://ui-avatars.com/api/?format=png&name=pic',
      userData: {},
      clicked: {text: 'Choose from galary'},
      filepath: {
        data: '',
        uri: '',
      },
      fileData: '',
      fileUri: '',
      imag: {},
      userStat: null,
    };
  }

  async componentDidMount() {
    this.getToken();
    console.log(this.props);
    let userVerified = await AsyncStorage.getItem('user_status');
    this.setState({userStat: userVerified});
  }

  getToken = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userData');
      if (userProfile === null) {
        this.props.navigation.navigate('Login');
      } else {
        const userData = JSON.parse(userProfile);
        this.setState({userData});
      }
    } catch (error) {}
  };

  async getDetails() {
    axios({
      method: 'GET',
      url: `${this.state.baseURL}/user`,
      headers: {
        Authorization: this.state.tokenz,
      },
    })
      .then(
        function (response) {
          this.setState({Spinner: false});

          if (response.data.error === false) {
            this.setState({username: response.data.user.username});
            this.setState({email: response.data.user.email});

            this.setState({created_at: response.data.user.created_at});

            this.setState({
              pic: `https://ui-avatars.com/api/?format=png&name=${response.data.user.username}`,
            });
          } else {
            this.setState({message: response.data.message});
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
    this.setState({setFeedback: false});

    axios({
      method: 'POST',
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

  async changeFilter() {
    let value;
    if (this.state.clicked.text === 'Take a photo') {
      this.launchCamera();
    } else if (this.state.clicked.text === 'Choose from galary') {
      this.chooseImage();
    } else {
      value = 'Won';
    }

    this.setState({
      filter: value,
    });
  }

  async verifyEmail() {
    const response = await axios.put(
      `${this.state.baseURL}/api/account/sendtoken/${this.state.userData.userid}`,
      {
        email: this.state.userData.email,
      },
    );
    if(response.data.status == 'success'){
      this.props.navigation.push('Token')
    }
  }

  launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
        console.log('calling1');
        this.onTakePhoto();
      }
    });
  };

  chooseImage = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};

        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
        this.onTakePhoto();
      }
    });
  };

  launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
        this.onTakePhoto();
      }
    });
  };

  async onTakePhoto() {
    this.setState({Spinner: true});

    axios({
      method: 'PUT',
      url: `${this.state.baseURL}/api/account/update/picture/${this.state.userData.userid}`,
      data: {
        file: this.state.fileData,
      },
    })
      .then(
        function (response) {
          console.log(response);
          this.setState({Spinner: false});

          this.state.userData.pictureUrl = this.state.fileUri;

          AsyncStorage.setItem('userData', JSON.stringify(this.state.userData));

          this.props.navigation.navigate('Profile');
        }.bind(this),
      )
      .catch(
        function (error) {
          console.log(error.response);
          this.setState({Spinner: false});
          this.setState({message: this.state.default_message});
          this.showAlert();
        }.bind(this),
      );
  }

  render() {
    const launchInsta = () => {
      Linking.openURL('instagram://user?username=apple');
    };
    return (
      <Container style={styles.container}>
        {/* <NavigationEvents onDidFocus={() => this.getToken()} /> */}
        <Header
          noShadow
          style={{backgroundColor: '#fff', marginTop: 10}}
          androidStatusBarColor="#FFFFFF"
          iosBarStyle="dark-content">
          <Left>
            <AntDesign
              name={'closecircleo'}
              color={'#000'}
              style={{fontSize: 24, paddingRight: 5}}
              onPress={() => this.props.navigation.goBack()}
            />
          </Left>
          <Body></Body>
          <Right>
            <TouchableOpacity
              onPress={() => this.props.navigation.push('Notify')}>
              <View
                style={{
                  backgroundColor: '#FF6161',
                  borderRadius: 15,
                  height: 12,
                  width: 12,
                  position: 'absolute',
                  top: -7,
                  right: 2,
                  zIndex: 1,
                }}></View>
              <Image
                source={require('../../assets/images/noty.png')}
                style={{height: 25, width: 25, marginLeft: -5}}
              />
            </TouchableOpacity>

            {/* <MaterialIcons
              name={"notifications-none"}
              color={"#000"}
              style={{ fontSize: 30, paddingRight: 5 }}
              onPress={() => this.props.navigation.navigate("Notify")}
            /> */}
          </Right>
        </Header>

        <Content>
          <View style={{marginTop: 15, alignSelf: 'center', marginBottom: 10}}>
            <TouchableOpacity onPress={this.chooseImage}>
              {this.state.userData.pictureUrl === null ? (
                <View>
                  <Image source={robot} />
                </View>
              ) : (
                <View>
                  <Image source={{uri: this.state.userData.pictureUrl}} />
                  <Thumbnail
                    large
                    source={{uri: `${this.state.userData.pictureUrl}`}}
                    style={{borderWidth: 2, borderColor: '#EF3C3C'}}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: 5,
              fontSize: 20,
              color: '#273444',
              fontFamily: 'ProximaNovaReg',
            }}>
            {this.state.userData.firstname} {this.state.userData.lastname}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: 20,
              fontSize: 13,
              color: '#273444',
              fontFamily: 'ProximaNovaReg',
            }}>
            {this.state.userData.email}
          </Text>

          <List>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Namings')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                backgroundColor: '#5B9DEE10',
                borderRadius: 30,
                paddingVertical: 15,
                marginVertical: 10,
              }}>
              <Left style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/user.png')}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{fontFamily: 'ProximaNovaReg', marginTop: 4}}>
                  Profile settings
                </Text>
              </Left>
              <Right style={{marginRight: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {this.state.userStat == 'false' && (
                    <TouchableOpacity onPress={() => this.verifyEmail()}>
                      <Image
                        source={require('../../assets/images/verify_email.png')}
                        style={{
                          height: 40,
                          width: 80,
                          resizeMode: 'contain',
                          marginHorizontal: 15,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  <AntDesign
                    name={'rightcircleo'}
                    color={'#000'}
                    style={{fontSize: 20}}
                  />
                </View>
              </Right>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Pay')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                backgroundColor: '#5B9DEE10',
                borderRadius: 30,
                paddingVertical: 20,
                marginVertical: 10,
              }}>
              <Left style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/card.png')}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{fontFamily: 'ProximaNovaReg', marginTop: 4}}>
                  Payment options
                </Text>
              </Left>
              <Right style={{marginRight: 20}}>
                <AntDesign
                  name={'rightcircleo'}
                  color={'#000'}
                  style={{fontSize: 20, marginRight: 10}}
                />
              </Right>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('History')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                backgroundColor: '#5B9DEE10',
                borderRadius: 30,
                paddingVertical: 20,
                marginVertical: 10,
              }}>
              <Left style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/doc.png')}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{fontFamily: 'ProximaNovaReg', marginTop: 4}}>
                  Entry history
                </Text>
              </Left>
              <Right style={{marginRight: 20}}>
                <AntDesign
                  name={'rightcircleo'}
                  color={'#000'}
                  style={{fontSize: 20, marginRight: 10}}
                />
              </Right>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Refer')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                backgroundColor: '#5B9DEE10',
                borderRadius: 30,
                paddingVertical: 20,
                marginVertical: 10,
              }}>
              <Left style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/meg.png')}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{fontFamily: 'ProximaNovaReg', marginTop: 4}}>
                  Referral code
                </Text>
              </Left>
              <Right style={{marginRight: 20}}>
                <AntDesign
                  name={'rightcircleo'}
                  color={'#000'}
                  style={{fontSize: 20, marginRight: 10}}
                />
              </Right>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Hoq')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                backgroundColor: '#5B9DEE10',
                borderRadius: 30,
                paddingVertical: 20,
                marginVertical: 10,
              }}>
              <Left style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/book.png')}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{fontFamily: 'ProximaNovaReg', marginTop: 4}}>
                  How it works
                </Text>
              </Left>
              <Right style={{marginRight: 20}}>
                <AntDesign
                  name={'rightcircleo'}
                  color={'#000'}
                  style={{fontSize: 20, marginRight: 10}}
                />
              </Right>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://nationaluptake.com/faq-naup')
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                backgroundColor: '#5B9DEE10',
                borderRadius: 30,
                paddingVertical: 20,
                marginVertical: 10,
              }}>
              <Left style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/faq.png')}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{fontFamily: 'ProximaNovaReg', marginTop: 4}}>
                  FAQs
                </Text>
              </Left>
              <Right style={{marginRight: 20}}>
                <AntDesign
                  name={'rightcircleo'}
                  color={'#000'}
                  style={{fontSize: 20, marginRight: 10}}
                />
              </Right>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Support')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                backgroundColor: '#5B9DEE10',
                borderRadius: 30,
                paddingVertical: 20,
                marginVertical: 10,
              }}>
              <Left style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/headphone.png')}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                    marginHorizontal: 15,
                  }}
                />
                <Text style={{fontFamily: 'ProximaNovaReg', marginTop: 4}}>
                  Supports
                </Text>
              </Left>
              <Right style={{marginRight: 20}}>
                <AntDesign
                  name={'rightcircleo'}
                  color={'#000'}
                  style={{fontSize: 20, marginRight: 10}}
                />
              </Right>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://nationaluptake.com/naup-about-us')
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                backgroundColor: '#5B9DEE10',
                borderRadius: 30,
                paddingVertical: 20,
                marginVertical: 10,
                flex: 1,
              }}>
              <Left style={{flexDirection: 'row', width: '80%', flex: 1}}>
                <Image
                  source={require('../../assets/images/about.png')}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                    marginHorizontal: 15,
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'ProximaNovaReg',
                    marginTop: 4,
                    width: '100%',
                    flex: 1,
                  }}>
                  About National Uptake
                </Text>
              </Left>
            </TouchableOpacity>
          </List>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <TouchableOpacity
              onPress={() => this.props.signOut()}
              style={{
                borderColor: '#FF6161',
                borderWidth: 2,
                borderRadius: 30,
                paddingVertical: 15,
                width: '90%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 15,
              }}>
              <Text
                style={{
                  color: '#FF6161',
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontFamily: 'ProximaNovaReg',
                  paddingHorizontal: 10,
                }}>
                Logout
              </Text>
              <Image
                source={require('../../assets/images/logout.png')}
                style={{height: 20, width: 20}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
              marginBottom: 40,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={
                () =>
                  Linking.openURL(
                    'https://wwww.facebook.com/National-Uptake-109708640851592/?view_public_for=109708640851592',
                  )
                // this.props.navigation.navigate("Web", {
                //   webUrl:
                //     "https://web.facebook.com/National-Uptake-109708640851592/?view_public_for=109708640851592",
                // })
              }
              style={{
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: '#5B9DEE10',
                padding: 10,
                marginHorizontal: 17,
              }}>
              <Image
                source={require('../../assets/images/fb.png')}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  marginHorizontal: 15,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'https://www.instagram.com/p/CEm0oj7F_2f/?igshid=rflpsnez29zi',
                )
              }
              style={{
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: '#5B9DEE10',
                padding: 10,
                marginHorizontal: 17,
              }}>
              <Image
                source={require('../../assets/images/insta.png')}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  marginHorizontal: 15,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={
                () => Linking.openURL('twitter://timeline')

                // this.props.navigation.navigate("Web", {
                //   webUrl: "www.twitter.com/nationaluptake",
                // })
              }
              style={{
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: '#5B9DEE10',
                padding: 10,
                marginHorizontal: 17,
              }}>
              <Image
                source={require('../../assets/images/twitter.png')}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  marginHorizontal: 15,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={
                () =>
                  Linking.openURL(
                    'https://www.youtube.com/channel/UCSJbSJBa0DSS2D9-B-v87CQ/featured?view_as=subscriber',
                  )

                // this.props.navigation.navigate("Web", {
                //   webUrl:
                //     "https://www.youtube.com/channel/UCSJbSJBa0DSS2D9-B-v87CQ/featured?view_as=subscriber",
                // })
              }
              style={{
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: '#5B9DEE10',
                padding: 10,
                marginHorizontal: 17,
              }}>
              <Image
                source={require('../../assets/images/youtube.png')}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  marginHorizontal: 15,
                }}
              />
            </TouchableOpacity>
          </View>
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
          transparent={true}
          visible={this.state.setFeedback}
          onRequestClose={() => {}}>
          <View style={{marginTop: 200}}>
            <View style={{backgroundColor: '#FF5A5A'}}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: 20,
                  marginTop: 10,
                }}>
                Please Enter a Feedback
              </Text>

              <Textarea
                rowSpan={5}
                bordered
                placeholder="Enter Feedback"
                style={{color: 'white'}}
                onChangeText={(feebackMsg) => this.setState({feebackMsg})}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 10,
                  marginBottom: 20,
                }}>
                <Button
                  light
                  style={styles.bottonStyle2}
                  onPress={() => this.sendFeedback()}>
                  <Text
                    style={{
                      color: '#FF5A5A',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    Send
                  </Text>
                </Button>

                <Button
                  style={styles.bottonStyle3}
                  onPress={() => this.hideFeedback()}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    Cancel
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

export default function (props) {
  const {signOut} = React.useContext(AuthContext);

  return <Profile {...props} signOut={signOut} />;
}
