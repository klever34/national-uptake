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
import {View, Image, ActivityIndicator, TouchableOpacity} from 'react-native';

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
      errorMessage: null,
      indicator: false,
      pwdIndicator: false
    };
  }

  componentDidMount() {
    this.getToken();
  }

  async getToken() {
    try {
      var email =  await AsyncStorage.getItem('@reg_email')
      this.setState({email});
    } catch (error) {
      this.props.navigation.navigate('Login');
    }
  }

  // UNSAFE_componentWillMount() {

  // }

  async loginRequest() {
    this.setState({indicator: true});

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
              await AsyncStorage.setItem(
                'user_id',
                response.data.userSignInResult.userid,
              );
              await AsyncStorage.setItem(
                '@user_token',
                response.data.userSignInResult.token,
              );
              await AsyncStorage.setItem(
                'referral_code',
                response.data.userSignInResult.referralCode,
              );
              await AsyncStorage.setItem(
                'user_status',
                `${response.data.userSignInResult.isEmailVerified}`,
              );
              this.props.signIn();
              this.setState({indicator: false});
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
          console.log(error.response.data.responseMessage);
          this.setState({indicator: false});
          this.setState({errorMessage: error.response.data.responseMessage});
        }.bind(this),
      );
  }

  async resetRequest() {
    this.setState({pwdIndicator: true});

    axios({
      method: 'POST',
      url: `${this.state.baseURL}/api/auth/sendResetToken`,
      data: {
        email: this.state.email,
      },
    })
      .then(
        function (response) {
          this.setState({pwdIndicator: false});

          if (response.data.status === 'success') {
            try {
              this.props.navigation.push('Reset', {
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
          this.setState({pwdIndicator: false});
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
              {this.state.errorMessage && (
                <Text
                  style={[
                    styles.textInput2,
                    {
                      fontFamily: 'ProximaNova-Regular',
                      color: 'red',
                      paddingVertical: 10,
                    },
                  ]}>
                  {this.state.errorMessage}
                </Text>
              )}

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
                    {this.state.indicator && (
                      <ActivityIndicator
                        size="small"
                        color="#ffffff"
                        style={{paddingHorizontal: 5, marginTop: -3}}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}

              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
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
                {this.state.pwdIndicator && (
                  <ActivityIndicator
                    size="small"
                    color="red"
                    style={{paddingHorizontal: 5}}
                  />
                )}
              </View>

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
                  onPress={() => this.props.navigation.push('Login')}>
                  {' '}
                  Switch user{' '}
                </Text>
              </Text>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

export default function (props) {
  const {signIn} = React.useContext(AuthContext);

  return <Password {...props} signIn={signIn} />;
}
