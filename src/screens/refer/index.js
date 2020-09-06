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
  Right,
  Badge,
  CardItem,
  Card,
  Thumbnail,
  ListItem,
} from 'native-base';
import {
  Clipboard,
  View,
  Image,
  Modal,
  StatusBar,
  Share,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import styles from './style';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

const robot = require('../../assets/images/top.png');

const empty = require('../../assets/images/rep.png');

const coin = require('../../assets/images/coins.png');

const try1 = require('../../assets/images/try1.png');

import Moment from 'moment';

import {NavigationEvents} from 'react-navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class Referral extends Component {
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
      code: '123456',
      userData: {},
      credit: 0,
      available: [],
      now: '',
      myCode: null,
    };
  }

  async componentDidMount() {
    let code = await AsyncStorage.getItem('referral_code');
    this.setState({myCode: code});
  }

  shareFunction = async () => {
    try {
      const result = await Share.share({
        message: 'HSWYTWHY',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  getToken = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userData');
      if (userProfile === null) {
        const userData = {
          firstname: 'Guest',
          lastname: 'Guest',
        };
        await this.setState({userData});
      } else {
        const userData = JSON.parse(userProfile);
        await this.setState({userData});
        await this.availableUptake();
      }
    } catch (error) {}
  };

  async availableUptake() {
    axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/draws/livedraws`,
      params: {},
    })
      .then(
        function (response) {
          let available = response.data.data;

          this.setState({available});
        }.bind(this),
      )
      .catch(
        function (error) {
          this.setState({message: this.state.default_message});
          this.showAlert();
        }.bind(this),
      );
  }

  async creditBag() {
    axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/auth/verifyAccount`,
      params: {
        email: this.state.email,
      },
    })
      .then(
        function (response) {
          if (response.data.accountExist === true) {
            this.props.navigation.navigate('Password', {
              email: this.state.email,
            });
          } else {
            this.props.navigation.navigate('Register', {
              email: this.state.email,
            });
          }
        }.bind(this),
      )
      .catch(
        function (error) {
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

  render() {
    return (
      <Container style={styles.container}>
        <Header
          noShadow
          style={{backgroundColor: '#fff', marginTop: 10}}
          androidStatusBarColor="#FFFFFF"
          iosBarStyle="dark-content">
          <Left>
            <AntDesign
              name={'leftcircleo'}
              color={'#273444'}
              style={{fontSize: 24, marginLeft: 5}}
              onPress={() => this.props.navigation.goBack()}
            />
          </Left>
          <Body></Body>
        </Header>
        <Content>
          <Text
            style={[
              {
                fontFamily: 'ProximaNovaAltBold',
                alignItems: 'flex-start',
                fontSize: 20,
                paddingHorizontal: 20,
                marginTop: 10,
              },
            ]}>
            Referral code
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginRight: 10,
              marginLeft: 10,
              marginTop: 25,
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Refer')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#DCEAFD',
                padding: 10,
                fontFamily: 'ProximaNovaBold',
                fontSize: 18,
                marginRight: 20,
                borderRadius: 24,
                paddingHorizontal: 20,
                width: '30%',
              }}>
              <Text>Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Refer2')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#DCEAFD',
                padding: 10,
                fontFamily: 'ProximaNovaThin',
                fontSize: 18,
                borderRadius: 24,
                paddingHorizontal: 20,
                width: '30%',
                opacity: 0.5,
              }}>
              <Text>Status</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Image source={empty} style={styles.imageLogo} />
            <Text style={[styles.centerText, {fontFamily: 'ProximaNovaBold'}]}>
              {' '}
              Refer & earn
              {'\n'}
              {'\n'}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'normal',
                  fontFamily: 'ProximaNovaThin',
                  lineHeight: 20,
                  color: '#000',
                }}>
                Share your referral code and earn as much ₦1,000 when people
                signup using your referral code.
              </Text>
            </Text>
          </View>

          <List>
            <ListItem style={styles.selectStyle}>
              <Left>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#5B9DEE',
                    marginLeft: 30,
                    fontFamily: 'ProximaNovaBold',
                  }}>
                  {this.state.myCode}
                </Text>
              </Left>
              <Right style={{marginLeft: -100}}>
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => Clipboard.setString('HSWYTWHY')}>
                  <FontAwesome
                    name={'copy'}
                    color={'#273444'}
                    style={{fontSize: 20}}
                    onPress={() => this.props.navigation.goBack()}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#273444',
                      fontFamily: 'ProximaNovaReg',
                      marginLeft: 5,
                    }}>
                    copy code
                  </Text>
                </TouchableOpacity>
              </Right>
            </ListItem>
          </List>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => this.shareFunction()}
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
                Share referral code
              </Text>
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
              <Spinner color="white" />
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

export default Referral;
