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
  ImageBackground,
  View,
  Image,
  Modal,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import styles from './style';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

const robot = require('../../assets/images/top.png');

const empty = require('../../assets/images/not.png');

const coin = require('../../assets/images/coins.png');

const try1 = require('../../assets/images/try1.png');

import Moment from 'moment';

import {NavigationEvents} from 'react-navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';

class Hoq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      baseURL: 'http://oftencoftdevapi-test.us-east-2.elasticbeanstalk.com',
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
    };
  }

  componentDidMount() {
    const now = Moment().format('a');
    this.setState({now});

    this.getToken();
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () =>
      this.props.navigation.goBack(),
    );
  }

  getToken = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userProfile);
      await this.setState({userData});
      // await this.availableUptake();
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
      // <ScrollView>
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
          <View
            style={{
              flexDirection: 'row',
              marginRight: 10,
              marginLeft: 10,
              marginTop: -20,
            }}>
            <View style={{marginLeft: 10, flex: 1, flexDirection: 'row'}}>
              <Text
                style={{
                  color: '#273444',
                  marginLeft: 0,
                  fontSize: 20,
                  marginTop: 20,
                  fontFamily: 'ProximaNovaAltBold',
                }}>
                How it works
              </Text>
            </View>
          </View>
          {/* <Image source={require('../../../assets/youtube_vid.png')} style={{height: '50%', width: '100%', resizeMode: 'contain'}} /> */}

          <View>
            <List>
              <ListItem style={styles.selectStyle}>
                <Left>
                  <Text style={{color: 'black', fontFamily: 'ProximaNovaReg'}}>
                    1. When you have entered an uptake and your payment has been
                    confirmed you will be presented with a reference number
                  </Text>
                </Left>
              </ListItem>

              <ListItem style={styles.selectStyle}>
                <Left>
                  <Text style={{color: 'black', fontFamily: 'ProximaNovaReg'}}>
                    2. Your reference number will also be sent to your
                    registered email address
                  </Text>
                </Left>
              </ListItem>

              <ListItem style={styles.selectStyle}>
                <Left>
                  <Text style={{color: 'black', fontFamily: 'ProximaNovaReg'}}>
                    3. If you bought multiple entries for that uptake you will
                    receive multiple reference numbers
                  </Text>
                </Left>
              </ListItem>

              <ListItem style={styles.selectStyle}>
                <Left>
                  <Text style={{color: 'black', fontFamily: 'ProximaNovaReg'}}>
                    4. The system puts the reference number(s) into a collective
                    pot
                  </Text>
                </Left>
              </ListItem>

              <ListItem style={styles.selectStyle}>
                <Left>
                  <Text style={{color: 'black', fontFamily: 'ProximaNovaReg'}}>
                    5. Once the uptake has ended at 7:30pm on the draw date the
                    system will shake all the entries up
                  </Text>
                </Left>
              </ListItem>

              <ListItem style={styles.selectStyle}>
                <Left>
                  <Text style={{color: 'black', fontFamily: 'ProximaNovaReg'}}>
                    6. At 9pm on the draw date our proprietary algorithm then
                    acts on it and randomly picks a reference number
                  </Text>
                </Left>
              </ListItem>

              <ListItem style={styles.selectStyle}>
                <Left>
                  <Text style={{color: 'black', fontFamily: 'ProximaNovaReg'}}>
                    7. The reference number will be announced on your social
                    media channels. If you are winner you will receive a
                    notification on the app and to your email
                  </Text>
                </Left>
              </ListItem>
            </List>
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
      // </ScrollView>
    );
  }
}

export default Hoq;
