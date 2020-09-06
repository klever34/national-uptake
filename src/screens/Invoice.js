import React, {Component} from 'react';
import {
  ImageBackground,
  View,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios'
class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {ticketData: [], showView: false, page: null};
  }

  async componentDidMount() {
    console.log(this.props.route.params.ref);
    let pg = this.props.route.params.page;
    this.setState({page: pg})
    await this.paymentValidationRef(this.props.route.params.ref);
  }

  paymentValidationRef = async (ref) => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(
        `https://dragonflyapi.nationaluptake.com//api/transactions/invoice/${ref}`,
      );
      console.log(response.data.data)
      this.setState({ticketData: response.data.data});
      this.setState({showView: true});
    } catch (error) {
      console.log(error)
    }
  };

  render() {
    if (this.state.showView) {
      return (
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 20}}>
          <ScrollView
            style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
            <View
              style={{
                flex: 1,
                background: '#fff',
                marginHorizontal: 20,
                paddingBottom: 50,
              }}>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../assets/images/hurray.png')}
                  style={{height: 200, width: 200, resizeMode: 'contain'}}
                />
                <Text
                  style={{
                    fontFamily: 'ProximaNovaSemiBold',
                    fontSize: 20,
                    color: '#273444',
                  }}>
                  Great! You're in! 🎉
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  {
                    borderRadius: 18,
                    backgroundColor: '#fff',
                    padding: 10,
                    marginTop: 20,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {this.state.ticketData.draw.imageUrl && (
                    <Image
                      source={{uri: `${this.state.ticketData.draw.imageUrl}`}}
                      style={{height: 90, width: 90, borderRadius: 20}}
                    />
                  )}
                  <View
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      paddingRight: 70,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'ProximaNovaSemiBold',
                        fontSize: 16,
                        color: '#273444',
                      }}>
                      {this.state.ticketData.draw.name}{' '}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'ProximaNovaReg',
                        fontSize: 13,
                        color: '#273444',
                        // marginRight: 30
                      }}>
                      {this.state.ticketData.draw.desc}
                    </Text>
                    {/* <TouchableOpacity
                    style={{
                      backgroundColor: '#c4c4c4',
                      borderRadius: 20,
                      padding: 5,
                      width: '40%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 7,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'ProximaNovaSemiBold',
                      }}>
                      09:09:09
                    </Text>
                  </TouchableOpacity> */}
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 25,
                }}>
                <Text
                  style={{
                    fontFamily: 'ProximaNovaSemiBold',
                    fontSize: 13,
                    color: '#273444',
                    marginLeft: 10
                  }}>
                  Entry summary
                </Text>
                <Text
                  style={{
                    fontFamily: 'ProximaNovaReg',
                    fontSize: 13,
                    color: '#273444',
                    marginRight: 10
                  }}>
                  {this.state.ticketData.userTickets.length} Entries
                </Text>
              </View>
              <View
                style={[
                  styles.card,
                  {
                    borderRadius: 18,
                    backgroundColor: '#fff',
                    marginTop: 15,
                    elevation: 3,
                    padding: 10
                  },
                ]}>
                {this.state.ticketData.userTickets.map((item, i) => (
                  <View
                    key={i}
                    style={{
                      borderBottomColor: '#c4c4c4',
                      borderBottomWidth: 0.5,
                      paddingVertical: 15,
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'ProximaNovaReg',
                          fontSize: 14,
                          color: '#273444',
                          // marginRight: 30
                        }}>
                        Ticket No. {item.transactionReference.slice(0, 29)}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'ProximaNovaReg',
                          fontSize: 13,
                          color: '#273444',
                          // marginRight: 30
                        }}>
                        ₦{this.state.ticketData.draw.amount}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: 'ProximaNovaThin',
                        fontSize: 12,
                        color: '#273444',
                        // marginRight: 30
                      }}>
                      Reference ID. {item.ticketReference}
                    </Text>
                  </View>
                ))}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaSemiBold',
                      fontSize: 14,
                      color: '#273444',
                      // marginRight: 30
                    }}>
                    Subtotal
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaReg',
                      fontSize: 14,
                      color: '#273444',
                      // marginRight: 30
                    }}>
                    ₦{this.state.ticketData.totalAmount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaSemiBold',
                      fontSize: 14,
                      color: '#273444',
                      // marginRight: 30
                    }}>
                    Discount
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaReg',
                      fontSize: 12,
                      color: '#273444',
                      // marginRight: 30
                    }}>
                    referral code
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaReg',
                      fontSize: 12,
                      color: '#E24C4B',
                      // marginRight: 30
                    }}>
                    - ₦{this.state.ticketData.discount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaSemiBold',
                      fontSize: 14,
                      color: '#273444',
                      // marginRight: 30
                    }}>
                    TOTAL
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaSemiBold',
                      fontSize: 14,
                      color: '#35CF3B',
                      // marginRight: 30
                    }}>
                    ₦{this.state.ticketData.totalAmount}
                  </Text>
                </View>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>this.props.navigation.navigate('Available')}
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
                      fontFamily: 'ProximaNovaReg',
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.done}
                onRequestClose={() => {}}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}>
                  <View
                    style={{
                      marginTop: 70,
                      // marginLeft: 20,
                      // marginRight: 20,
                      // borderWidth: 10,
                      // borderColor: "white",
                    }}>
                    <View
                      style={{
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        width: 375,
                        borderRadius: 30,
                      }}>
                      <Image
                        source={require('../assets/images/done.png')}
                        resizeMode="contain"
                        style={{
                          position: 'relative',
                          width: 72,
                          height: 72,
                          alignSelf: 'center',
                          marginTop: 50,
                        }}></Image>
                      <View style={{marginTop: 30, alignSelf: 'center'}}>
                        <Text
                          style={{
                            color: '#273444',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: 20,
                            fontFamily: 'ProximaNovaSemiBold',
                          }}>
                          Congratulations
                        </Text>
                        <Text
                          style={{
                            color: '#273444',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            marginTop: 20,
                            marginLeft: 10,
                            marginRight: 10,
                            fontSize: 15,
                            fontFamily: 'ProximaNovaReg',
                            marginBottom: 10,
                          }}>
                          Your have successfully funded your credit bag.
                        </Text>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 50,
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({done: false})
                            }}
                            style={{
                              backgroundColor: '#FF6161',
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
                                fontFamily: 'ProximaNovaReg',
                              }}>
                              Okay, got it!
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal> */}
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: '#fff',
          }}>
          <ActivityIndicator size="large" color={'#00A7FF'} />
          <Text style={{fontFamily: 'ProximaNovaSemiBold'}}>
            {'Please wait...'}
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  card: {
    elevation: 3,
    backgroundColor: '#c4c4c4',
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default Invoice;
