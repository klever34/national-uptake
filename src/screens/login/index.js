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
  BackHandler,
} from 'react-native';
import {baseUrl} from '../../constants/index';
import styles from './style';

import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';

class Login extends Component {
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
      activateBtn: false,
    };
  }

  async componentDidMount() {
    await AsyncStorage.removeItem('userData');
  }

  async loginRequest() {
    this.setState({Spinner: true});
    try {
      const response = await axios.get(
        `${baseUrl}/api/auth/verifyAccount?email=${this.state.email}`,
      );
      if (response.data.accountExist === true) {
        this.props.navigation.push('Password', {
          email: this.state.email,
        });
      } else {
        this.props.navigation.push('Register', {
          email: this.state.email,
        });
      }
      this.setState({Spinner: false});
    } catch (error) {
      this.setState({Spinner: false});
      this.setState({message: this.state.default_message});
      this.showAlert();
    }
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

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    );
  }

  render() {
    const validateEmail = (text) => {
      let trimmedText = text.trim();
      this.setState({email: trimmedText});
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(trimmedText).toLowerCase())) {
        this.setState({activateBtn: true});
      } else {
        this.setState({activateBtn: false});
      }
    };

    return (
      <Container style={styles.container}>
        <Header
          noShadow
          style={{backgroundColor: '#FFF'}}
          androidStatusBarColor="#FFFFFF"
          iosBarStyle="dark-content">
          <Left>
            <AntDesign
              name={'closecircleo'}
              color={'#273444'}
              style={{fontSize: 24, paddingLeft: 6}}
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
              Continue with email
            </Text>
            <Text
              style={[styles.textInput2, {fontFamily: 'ProximaNova-Regular'}]}>
              We need your email to log you in if you have an account or create
              one if you do not
            </Text>
            <View>
              <Item regular rounded style={styles.inputStyle}>
                <Input
                  value={this.state.email}
                  style={{
                    borderColor: 'white',
                    borderWidth: 0,
                    color: '#273444',
                    marginLeft: 10,
                    fontFamily: 'ProximaNova-Regular',
                  }}
                  onChangeText={(text) => {
                    validateEmail(text);
                  }}
                  placeholder="Email"
                  autoCorrect={false}
                  autoCapitalize={'none'}
                />
              </Item>

              {this.state.activateBtn === false ? (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity
                    activeOpacity={0.8}
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
                    activeOpacity={0.8}
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
                      Continue
                    </Text>
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

export default Login;
