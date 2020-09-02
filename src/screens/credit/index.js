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
  BackHandler,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import styles from './style';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

const robot = require('../../assets/images/top.png');

const empty = require('../../assets/images/not.png');

const coin = require('../../assets/images/coinss.png');

const try1 = require('../../assets/images/try1.png');

import Moment from 'moment';

import {NavigationEvents} from 'react-navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';

class Enteries extends Component {
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
              style={{fontSize: 24}}
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
              marginTop: 10,
            }}>
            <View
              style={{
                marginLeft: 10,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: '#273444',
                  marginLeft: 10,
                  fontSize: 20,
                  marginTop: 0,
                  fontFamily: 'ProximaNovaReg',
                }}>
                Credit Bag
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 5,
                  backgroundColor: '#F2F7FB',
                  padding: 10,
                  borderRadius: 24,
                  width: 100,
                  marginLeft: 25,
                  // marginTop: 10,
                }}>
                <Image
                  source={coin}
                  style={{marginRight: 5, height: 20, width: 20}}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'ProximaNovaSemiBold',
                    color: '#000',
                  }}>
                  ₦0.00
                </Text>
              </View>
            </View>
          </View>

          <View>
            <Image source={empty} style={styles.imageLogo} />
            <Text
              style={[styles.centerText, {fontFamily: 'ProximaNovaSemiBold'}]}>
              {' '}
              Nothing to see here
              {'\n'}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'normal',
                  fontFamily: 'ProximaNovaReg',
                }}>
                Credit Bag transactions will appear here
              </Text>
            </Text>
          </View>

          {/* <View>
            <List>
            <ListItem  onPress={() => this.props.navigation.navigate("Details")} style={styles.selectStyle}>
              <Left>
                <Text style={{color: 'black'}}>
                  Spent {"\n"}
                  <Text style={{color: 'black', fontSize:11, fontWeight: "normal",}}>
                  Transaction ID. fhfueeyd73736483827dsshsnfs
                  </Text>
                  
                </Text>
                
              </Left>
              <Right>
              <Text style={{color: 'red', fontSize:11}}>
                  -₦1,000 {"\n"}
                  <Text style={{color: 'black', fontSize:11}}>
                  12:23 PM
                  </Text>
                  
                </Text>
              </Right>
            </ListItem>
            

            <ListItem  onPress={() => this.props.navigation.navigate("Details")} style={styles.selectStyle}>
              <Left>
                <Text style={{color: 'black', }}>
                Purchased {"\n"}
                  <Text style={{color: 'black', fontSize:11, fontWeight: "normal",}}>
                  Transaction ID. fhfueeyd73736483827dsshsnfs
                  </Text>
                  
                </Text>
                
              </Left>
              <Right>
              <Text style={{color: 'green', fontSize:11}}>
                  ₦1,000 {"\n"}
                  <Text style={{color: 'black', fontSize:11}}>
                  12:23 PM
                  </Text>
                  
                </Text>
              </Right>
            </ListItem>

          </List>

            </View> */}
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
                  fontFamily: 'ProximaNovaReg',
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
                    fontFamily: 'ProximaNovaReg',
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

export default Enteries;
