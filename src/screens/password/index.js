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
  Input,
  Button,
  Spinner,
} from 'native-base';
import {View, Image, Modal, TouchableOpacity, BackHandler} from 'react-native';

import styles from './style';

import axios from 'axios';
import {baseUrl} from '../../constants/index';
import {AuthContext} from '../../../context';
import {NavigationEvents} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

const yes = require('../../assets/images/yes.png');
const no = require('../../assets/images/no.png');
import AntDesign from 'react-native-vector-icons/AntDesign';

class Password extends Component {
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
      view: true,
      showYes: false,
      showNo: false,
      showBlur: false,
    };
  }

  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', () =>
    //   this.props.navigation.goBack(),
    // );
    this.getToken();
  }

  getToken() {
    try {
      const email = this.props.route.params.email;
      this.setState({email});
    } catch (error) {
      this.props.navigation.navigate('Login');
    }
  }

  // UNSAFE_componentWillMount() {

  // }

  async loginRequest() {
    this.setState({Spinner: true});

    axios({
      method: 'POST',
      url: `${this.state.baseURL}/api/auth/login`,
      data: {
        email: this.state.email,
        password: this.state.password,
        rememberMe: true,
      },
    })
      .then(
        async function (response) {
          console.log(response.data);
          this.setState({Spinner: false});

          if (response.data.status === 'success') {
            try {
              await AsyncStorage.setItem(
                'userData',
                JSON.stringify(response.data.userSignInResult),
              );

              await AsyncStorage.setItem(
                'user_token',
                response.data.userSignInResult.token,
              );
              await AsyncStorage.setItem('@user_token', response.data.userSignInResult.token);
              await AsyncStorage.setItem(
                'referral_code',
                response.data.userSignInResult.referralCode,
              );
              this.props.signIn();
              // this.props.navigation.navigate('Available');
            } catch (error) {
              this.setState({message: error});
              this.showNo();
            }
          } else {
            this.setState({
              message: 'Please check your credentials and Try again',
            });
            this.showNo();
          }
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({Spinner: false});

          if (error.response.data.status === 'failed') {
            this.setState({
              message: `${error.response.data.responseMessage}`,
            });
            this.showNo();
          } else {
            this.setState({message: `${this.state.default_message}`});
            this.showNo();
          }
        }.bind(this),
      );
  }

  async resetRequest() {
    this.setState({Spinner: true});

    axios({
      method: 'POST',
      url: `${this.state.baseURL}/api/auth/sendResetToken`,
      data: {
        email: this.state.email,
      },
    })
      .then(
        function (response) {
          this.setState({Spinner: false});

          if (response.data.status === 'success') {
            try {
              this.props.navigation.navigate('Reset', {
                email: this.state.email,
              });
            } catch (error) {
              this.setState({message: error});
              this.showNo();
            }
          } else {
            this.setState({
              message: 'Please check your credentials and Try again',
            });
            this.showNo();
          }
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({Spinner: false});

          if (error.response.data.status === 'fail') {
            this.setState({
              message: `${error.response.data.responseMessage}, Please try again`,
            });
            this.showNo();
          }
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

  toggleView() {
    this.setState({
      view: !this.state.view,
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

  hideNo() {
    this.setState({
      showNo: false,
    });
    this.setState({
      showBlur: !this.state.showBlur,
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

  render() {
    // const {signIn} = this.props;
    return (
      <Container style={styles.container}>
        <Header
          noShadow
          style={{backgroundColor: '#FFF'}}
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
          <View>
            <Text
              style={[
                {
                  fontFamily: 'ProximaNovaAltBold',
                  alignItems: 'flex-start',
                  fontSize: 20,
                  paddingHorizontal: 20,
                },
              ]}>
              Welcome back!
            </Text>
            <Text
              style={[styles.textInput2, {fontFamily: 'ProximaNova-Regular'}]}>
              Please enter your password to login
            </Text>
            <View>
              <Item regular rounded style={styles.inputStyle}>
                <Input
                  secureTextEntry={this.state.view}
                  value={this.state.password}
                  style={{
                    borderColor: 'white',
                    color: '#273444',
                    marginLeft: 10,
                    fontFamily: 'ProximaNova-Regular',
                  }}
                  onChangeText={(text) => {
                    this.setState({password: text});
                  }}
                  placeholder="password"
                  autoCapitalize={'none'}
                />
                <AntDesign
                  name={'eyeo'}
                  color={'#c4c4c4'}
                  style={{fontSize: 20, marginRight: 20}}
                  onPress={() => this.toggleView()}
                />
              </Item>

              {this.state.password === '' ? (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#c4c4c4',
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
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() => this.loginRequest()}
                    style={{
                      backgroundColor: '#FF6161',
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
                        color: 'white',
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontFamily: 'ProximaNovaBold',
                      }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text
                style={{
                  color: 'black',
                  alignSelf: 'center',
                  marginTop: 20,
                  fontFamily: 'ProximaNova-Regular',
                }}
                onPress={() => {
                  this.resetRequest();
                }}>
                Forgot password?{' '}
              </Text>
              <Text
                style={{
                  color: 'black',
                  alignSelf: 'center',
                  marginTop: 30,
                  fontFamily: 'ProximaNova-Regular',
                }}>
                Not you?
                <Text
                  style={{
                    color: '#5B9DEE',
                    marginBottom: 10,
                    fontFamily: 'ProximaNova-Regular',
                  }}
                  onPress={() => this.props.navigation.navigate('Login')}>
                  {' '}
                  Switch user{' '}
                </Text>
              </Text>
            </View>
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
              <Spinner color="#FF6161" />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showYes}
          onRequestClose={() => {}}>
          <View style={{marginTop: 200, alignSelf: 'center'}}>
            <Image
              source={yes}
              resizeMode="contain"
              style={{
                position: 'relative',
                width: 72,
                height: 72,
                alignSelf: 'center',
              }}></Image>
            <View style={{marginTop: 30, alignSelf: 'center'}}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Success
              </Text>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                }}>
                You have successfully added a payment card
              </Text>
              <Button
                block
                rounded
                style={styles.bottonStyle}
                onPress={() => {
                  this.hideYes();
                  this.props.navigation.navigate('Pay');
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
          visible={this.state.showNo}
          onRequestClose={() => {}}>
          <View
            style={{
              marginTop: 200,
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 30,
              borderWidth: 10,
              borderColor: 'white',
            }}>
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: 'white',
                width: 375,
              }}>
              <Image
                source={no}
                resizeMode="contain"
                style={{
                  position: 'relative',
                  width: 72,
                  height: 72,
                  alignSelf: 'center',
                  marginTop: 40,
                }}></Image>
              <View style={{marginTop: 30, alignSelf: 'center'}}>
                <Text
                  style={{
                    color: '#273444',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: 20,
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
                    fontSize: 14,
                  }}>
                  {this.state.message} Please check your details again and try
                  again
                </Text>
                <Button
                  block
                  rounded
                  style={styles.bottonStylet}
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
          </View>
        </Modal>
      </Container>
    );
  }
}

export default function(props) {
  const {signIn} = React.useContext(AuthContext);

  return <Password {...props} signIn={signIn} />;
}