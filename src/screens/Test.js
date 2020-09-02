import React, {useRef}from 'react';
import {View, Text} from 'react-native'
import PaystackWebView from "react-native-paystack-webview";

const Test = (props) => {
    const myRef = useRef(null);
    const uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
          c,
        ) {
          var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      };
    return (
        <View>
        <View style={{ flex: 1 }}>
        <PaystackWebView
        ref={myRef}
          buttonText="Pay Now"
          paystackKey="pk_test_84373cbbe24b24215e0fd67c1d9411c649734712"
          paystackSecretKey="sk_test_fc780c4bc0264bd7dd194dc92afc1fb3afa37c94"
          amount={170000}
          billingEmail={'lanre@gmail.com'}
          billingMobile={'09092929292'}
          billingName={'Lanre'}
          ActivityIndicatorColor={'red'}
          SafeAreaViewContainer={{marginTop: 5}}
          SafeAreaViewContainerModal={{marginTop: 5}}
          onCancel={(e) => {
            console.log(e);
          }}
          onSuccess={(e) => {
            console.log(e);
          }}
          autoStart={false}
          refNumber={uuidv4()}
        />
      </View>
        </View>
    )
}

export default Test;