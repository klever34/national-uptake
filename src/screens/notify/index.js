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
  AsyncStorage,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import styles from './style';

import axios from 'axios';

import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

const robot = require('../../assets/images/top.png');

const empty = require('../../assets/images/not.png');

const coin = require('../../assets/images/coins.png');

const try1 = require('../../assets/images/try1.png');

import Moment from 'moment';

import {NavigationEvents} from 'react-navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';

class Notify extends Component {
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
      notif: [],
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
      this.setState({Spinner: true});
      const userProfile = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userProfile);
      await this.setState({userData});
      await this.notificationUptake();

      this.setState({Spinner: false});
    } catch (error) {
      this.setState({Spinner: false});
    }
  };

  async notificationUptake() {
    this.setState({Spinner: true});
    axios({
      method: 'GET',
      url: `${this.state.baseURL}/api/notifications/${this.state.userData.userid}`,
      params: {},
    })
      .then(
        function (response) {
          this.setState({Spinner: false});

          let notif = response.data.data;

          this.setState({notif});
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
              color={'#000'}
              style={{fontSize: 20, marginRight: 10}}
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
            <View style={{marginLeft: 10, flex: 1, flexDirection: 'row'}}>
              <Text
                style={{
                  color: '#273444',
                  marginLeft: 0,
                  fontSize: 20,
                  marginTop: 0,
                  fontFamily: 'ProximaNovaBold',
                }}>
                Notifications
              </Text>
            </View>
          </View>

          {this.state.notif.length <= 0 ? (
            <View>
              <Image source={empty} style={styles.imageLogo} />
              <Text
                style={[styles.centerText, {fontFamily: 'ProximaNovaBold'}]}>
                {' '}
                Nothing to see here
                {'\n'}
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'normal',
                    fontFamily: 'ProximaNovaBold',
                  }}>
                  Notifications will appear here
                </Text>
              </Text>
            </View>
          ) : (
            <View>
              {this.state.notif.map((item, i) => {
                return (
                  <ScrollView key={i} style={{flex: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flex: 1,
                      borderBottomColor: '#c4c4c4',
                      borderBottomWidth: 0.5,
                      paddingVertical: 20,
                      paddingHorizontal: 20
                    }}>
                    <View>
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: 'ProximaNovaSemiBold',
                          alignItems: 'flex-start',
                          paddingVertical: 5
                        }}>
                        {item.subject}
                      </Text>
                      <Text
                        style={{
                          // color: 'black',
                          fontSize: 12,
                          fontFamily: 'ProximaNovaReg',
                          paddingVertical: 5

                        }}>
                        {item.message}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: 'red',
                        fontSize: 12,
                        fontFamily: 'ProximaNovaReg',
                      }}>
                      {Moment(item.dateSent).format('hh:mm:ss a')}
                    </Text>
                  </View>
                  </ScrollView>
                );
              })}
            </View>
          )}
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
              <Spinner color="white" />
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

export default Notify;
