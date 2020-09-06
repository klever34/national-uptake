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
import {ActivityIndicator, View, TouchableOpacity, Modal} from 'react-native';

import styles from './style';
import AsyncStorage from '@react-native-community/async-storage';

import axios from 'axios';

import {NavigationEvents} from 'react-navigation';
import {AuthContext} from '../../../context';
import AntDesign from 'react-native-vector-icons/AntDesign';

class Change extends Component {
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
      view: true,
      pwdIndicator: false
    };
  }

  async componentDidMount() {
    await this.getToken();
  }

  getToken = async () => {
    try {
      const email = await AsyncStorage.getItem('@reg_email');
      const tokenz = await AsyncStorage.getItem('@@reg_token');

      this.setState({email});
      this.setState({tokenz});
    } catch (error) {}
  };

  async resetRequest() {
    this.setState({pwdIndicator: true});

    axios({
      method: 'POST',
      url: `${this.state.baseURL}/api/auth/updatePassword`,
      data: {
        email: this.state.email,
        token: this.state.tokenz,
        newPassword: this.state.password,
      },
    })
      .then(
        function (response) {
          console.log(response)
          this.setState({Spinner: false});
          console.log(response);

          if (response.data.status === 'success') {
            try {
              this.loginRequest();
            } catch (error) {
              this.setState({message: error});
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
          console.log(error.response.data)
          this.setState({Spinner: false});

          if (error.response.data.status === 'fail') {
            this.setState({
              message: `${error.response.data.responseMessage}, Please try again`,
            });
            this.showAlert();
          }
        }.bind(this),
      );
  }

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
          this.setState({Spinner: false});

          if (response.data.status === 'success') {
            try {
              AsyncStorage.setItem(
                'userData',
                JSON.stringify(response.data.userSignInResult),
              );
              await AsyncStorage.setItem(
                '@user_token',
                response.data.userSignInResult.token,
              );
              this.props.signIn();
              // this.props.navigation.navigate("Available");
            } catch (error) {
              this.setState({message: error});
              this.showAlert();
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

  render() {
    return (
      <Container style={styles.container}>
        <Header
          noShadow
          style={{backgroundColor: '#FFF'}}
          androidStatusBarColor="#FFFFFF"
          iosBarStyle="ldark-content">
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
              Reset Password
            </Text>
            <Text
              style={[styles.textInput2, {fontFamily: 'ProximaNova-Regular'}]}>
              Set your new password.
            </Text>
            <View style={{paddingVertical: 10}}>
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
                />
                <AntDesign
                  active
                  name="eyeo"
                  style={{fontSize: 25, color: '#c4c4c4', marginRight: 10}}
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
                      Set Password
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.resetRequest()}
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
                      Set Password
                    </Text>
                    {this.state.pwdIndicator && (
                      <ActivityIndicator
                        size="small"
                        color="#fff"
                        style={{paddingHorizontal: 5}}
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
                  fontFamily: 'ProximaNovaBold',
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
                    fontFamily: 'ProximaNovaBold',
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

export default function (props) {
  const {signIn} = React.useContext(AuthContext);

  return <Change {...props} signIn={signIn} />;
}
