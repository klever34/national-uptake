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
} from 'native-base';
import {
  ImageBackground,
  View,
  Image,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import styles from './style';

import axios from 'axios';

import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      baseURL: 'https://dragonflyapi.nationaluptake.com/',
      message: '',
      default_message: 'Invalid Token, Please confirm from your mail again',
      showAlert: false,
      message_title: '',
      Spinner: false,
      code: '123456',
      pwdIndicator: false,
      errorMessage: null,
      resendIndicator: false,
    };
  }

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    try {
      const email = await AsyncStorage.getItem('@reg_email');
      this.setState({email});
    } catch (error) {}
  };

  async verifyRequest() {
    this.setState({pwdIndicator: true});
    console.log(this.state.email)
    console.log(this.state.password)

    axios({
      method: 'POST',
      url: `${this.state.baseURL}/api/auth/verifyToken`,
      data: {
        email: this.state.email,
        token: this.state.password,
      },
    })
      .then(
        async function (response) {
          this.setState({pwdIndicator: false});
          await AsyncStorage.setItem('@reg_token', this.state.password)
          if (response.data.status === 'success') {
            try {
              this.props.navigation.push('Change', {
                email: this.state.email,
                token: this.state.password,
              });
            } catch (error) {
              this.setState({message: error});
              this.showAlert();
            }
          } else {
            this.setState({
              message: 'Please check your credentials and Try again',
            });
          }
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({pwdIndicator: false});
          this.setState({errorMessage: error.response.data.responseMessage});
        }.bind(this),
      );
  }

  async resetRequest() {
    this.setState({resendIndicator: true});

    axios({
      method: 'POST',
      url: `${this.state.baseURL}/api/auth/sendResetToken`,
      data: {
        email: this.state.email,
      },
    })
      .then(
        function (response) {
          this.setState({resendIndicator: false});

          if (response.data.status === 'success') {
            try {
              this.setState({errorMessage: 'Your reset Token has been resent'});
            } catch (error) {
              this.setState({message: error});
            }
          } else {
            this.setState({
              errorMessage: 'Please check your credentials and Try again',
            });
          }
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({resendIndicator: false});
          if (error.response.data.status === 'fail') {
            this.setState({
              errorMessage: `${error.response.data.responseMessage}, Please try again`,
            });
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

  render() {
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
              color={'#000'}
              style={{fontSize: 24, marginLeft: 10}}
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
                  fontFamily: 'ProximaNovaSemiBold',
                  alignItems: 'flex-start',
                  fontSize: 20,
                  paddingHorizontal: 20,
                },
              ]}>
              Password reset code
            </Text>
            <Text
              style={[
                styles.textInput2,
                {fontFamily: 'ProximaNovaReg', paddingVertical: 10},
              ]}>
              Please fill in the OTP sent to your email
            </Text>
            <View>
              <SmoothPinCodeInput
                containerStyle={{alignSelf: 'center', marginTop: 20}}
                cellSpacing={20}
                cellStyle={[
                  styles.card,
                  {
                    borderWidth: 2,
                    borderRadius: 30,
                    borderColor: 'white',
                    backgroundColor: 'white',
                    marginVertical: 10,
                    marginHorizontal: 10,
                  },
                ]}
                password
                mask="●"
                cellSize={60}
                codeLength={4}
                value={this.state.password}
                onTextChange={(password) => this.setState({password})}
              />
              {this.state.errorMessage && (
                <Text
                  style={[
                    styles.textInput2,
                    {
                      fontFamily: 'ProximaNova-Regular',
                      color: 'red',
                      paddingVertical: 5,
                    },
                  ]}>
                  {this.state.errorMessage}
                </Text>
              )}

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
                  Resend code
                </Text>
                {this.state.resendIndicator && (
                  <ActivityIndicator
                    size="small"
                    color="red"
                    style={{paddingHorizontal: 5, marginTop: -3}}
                  />
                )}
              </View>

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
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() => this.verifyRequest()}
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
                      Continue
                    </Text>
                    {this.state.pwdIndicator && (
                      <ActivityIndicator
                        size="small"
                        color="#fff"
                        style={{paddingHorizontal: 5, marginTop: -3}}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}
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
      </Container>
    );
  }
}

export default Reset;
