import React, {Component} from 'react';
import {
  ImageBackground,
  View,
  Image,
  Modal,
  AsyncStorage,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Button} from 'native-base';
class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    // let user = await AsyncStorage.getItem("userData");
    // if (user) {
    //   this.props.navigation.navigate("Available");
    // }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 20}}>
        <ScrollView style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
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
                <Image
                  source={require('../assets/images/pic.png')}
                  style={{height: 90, width: 90, borderRadius: 20}}
                />
                <View
                  style={{marginLeft: 20, marginRight: 20, paddingRight: 70}}>
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaSemiBold',
                      fontSize: 16,
                      color: '#273444',
                    }}>
                    Soak up at the Lekki Resort{' '}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaThin',
                      fontSize: 13,
                      color: '#273444',
                      // marginRight: 30
                    }}>
                    The winner would be announced at the end of the draw
                  </Text>
                  <TouchableOpacity
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
                  </TouchableOpacity>
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
                  fontFamily: 'ProximaNovaReg',
                  fontSize: 13,
                  color: '#273444',
                  // marginRight: 30
                }}>
                Entry summary
              </Text>
              <Text
                style={{
                  fontFamily: 'ProximaNovaReg',
                  fontSize: 13,
                  color: '#273444',
                  // marginRight: 30
                }}>
                2 Entries
              </Text>
            </View>
            <View
              style={[
                styles.card,
                {
                  borderRadius: 18,
                  backgroundColor: '#fff',
                  marginTop: 15,
                  elevation: 0,
                },
              ]}>
              <View
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
                    Ticket No. TBST6251
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaReg',
                      fontSize: 13,
                      color: '#273444',
                      // marginRight: 30
                    }}>
                    ₦1,000
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'ProximaNovaThin',
                    fontSize: 12,
                    color: '#273444',
                    // marginRight: 30
                  }}>
                  Reference ID. fhfueeyd73736483827dsshsnfs
                </Text>
              </View>
              <View
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
                    Ticket No. TBST6251
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'ProximaNovaReg',
                      fontSize: 13,
                      color: '#273444',
                      // marginRight: 30
                    }}>
                    ₦1,000
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'ProximaNovaThin',
                    fontSize: 12,
                    color: '#273444',
                    // marginRight: 30
                  }}>
                  Reference ID. fhfueeyd73736483827dsshsnfs
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
                  Subtotal
                </Text>
                <Text
                  style={{
                    fontFamily: 'ProximaNovaReg',
                    fontSize: 14,
                    color: '#273444',
                    // marginRight: 30
                  }}>
                  ₦2,000
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
                  Bammybestowed's referral code
                </Text>
                <Text
                  style={{
                    fontFamily: 'ProximaNovaReg',
                    fontSize: 12,
                    color: '#E24C4B',
                    // marginRight: 30
                  }}>
                  - ₦200
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
                  ₦1,800
                </Text>
              </View>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('Available')}
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
          </View>
        </ScrollView>
      </View>
    );
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
