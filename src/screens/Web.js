import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {ListItem, List} from 'native-base';
import {WebView} from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

class Web extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showView: true,
      showTicket: false,
      ticketData: null,
      done: false
    };
  }
  componentDidMount() {}
  //   const [showView, setView] = React.useState(false);
  //   var showView = false;

  render() {
    const {navigation} = this.props;
    const email = this.props.route.params.email;
    const amount = this.props.route.params.amount;
    const page = this.props.route.params.page;
    const reference = this.props.route.params.reference;
    console.log(reference);

    const messageReceived = async (data) => {
      var webResponse = JSON.parse(data);

      switch (webResponse.event) {
        case 'cancelled':
          this.props.navigation.goBack();
          break;
        case 'successful':
          const reference = webResponse.transactionRef;
          console.log(reference.reference);
          this.setState({showView: false});
          if (page == 'Pay') {
            setTimeout(() => {
              paymentValidationRef(reference.reference);
            }, 3000);
            return;
          } else {
            setTimeout(() => {
              paymentValidation(reference.reference);
            }, 10000);
          }
          break;

        default:
          break;
      }
    };

    const paymentValidation = async (ref) => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(
          `https://dragonflyapi.nationaluptake.com//api/transactions/invoice/${ref}`,
        );
        console.log("here");
        console.log(response.data.data);
        this.setState({showView: true});
        this.setState({showTicket: true});
        this.setState({ticketData: response.data.data});
        // console.log("ticket data");
        // console.log(this.state.ticketData);
      } catch (error) {
        console.log(error);
      }
    };

    const paymentValidationRef = async (ref) => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(
          `https://dragonflyapi.nationaluptake.com//api/transactions/invoice/${ref}`,
        );
        this.props.navigation.navigate('Pay');

        alert('Payment successful')
      } catch (error) {
        this.props.navigation.navigate('Pay');

      }
    };

    const goToNext = () => {
      this.props.navigation.navigate('Pay');
    }

    const htm = `   
    <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <!-- Latest compiled and minified CSS -->
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
              <!-- Fonts -->
              <link rel="dns-prefetch" href="//fonts.gstatic.com">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">
              <title>SUBSCRIPTION</title>
            </head>
            <body style="background-color:#fff;height:100vh ">
            <form >
            <script src="https://js.paystack.co/v1/inline.js"></script>

          </form>
           
          <script>
            window.onload = payWithPaystack;
            function payWithPaystack(){
              console.log("${reference} in pop up")
              var handler = PaystackPop.setup({
                key: 'pk_test_84373cbbe24b24215e0fd67c1d9411c649734712',
                email: '${email}',
                amount: ${amount * 100},
                currency: "NGN",
                ref: '${reference}', // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
                metadata: {
                   custom_fields: [
                      {
                          display_name: "Mobile Number",
                          variable_name: "mobile_number",
                          value: "+2348012345678"
                      }
                   ]
                },
                callback: function(response){
                  var resp = {event:'successful', transactionRef:response};
                  window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                },
                onClose: function(){
                  var resp = {event:'cancelled'};
                  window.ReactNativeWebView.postMessage(JSON.stringify(resp))
                }
              });
              handler.openIframe();
            }
          </script>
            </body>
    </html> 
    `;
    if (this.state.showView) {
      if (this.state.showTicket && this.state.ticketData !==null) {
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
                    <Image
                      source={{uri: `${this.state.ticketData.draw.imageUrl}`}}
                      style={{height: 90, width: 90, borderRadius: 20}}
                    />
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
                          fontFamily: 'ProximaNovaThin',
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
                      elevation: 0,
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
                          Ticket No. {item.transactionReference}
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
                <Modal
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
                            this.goToNext();
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
            </Modal>
              </View>
            </ScrollView>
          </View>
        );
      } else {
        return (
          <SafeAreaView
            style={{flex: 1, backgroundColor: '#ffffff', paddingTop: 30}}>
            <WebView
              disabled={true}
              source={{html: htm}}
              onMessage={(e) => {
                messageReceived(e.nativeEvent.data);
              }}
              onLoad={() => this.setState({showView: true})}
            />
          </SafeAreaView>
        );
      }
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
            {page === 'Pay' ? 'Please wait...' : 'Preparing Ticket'}
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

export default Web;
