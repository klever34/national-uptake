import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import AntDesign from "react-native-vector-icons/AntDesign";

class Faq extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showView: false,
    };
  }
  componentDidMount() {
    const vm = this;
    setTimeout(() => {
      vm.setState({ showView: true });
    }, 3000);
  }
  //   const [showView, setView] = React.useState(false);
  //   var showView = false;

  render() {
    const { navigation } = this.props;
    const url = navigation.getParam("webUrl", "NO-ID");
    if (this.state.showView) {
      return (
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#ffffff", paddingTop: 30 }}
        >
          <View style={{ padding: 20 }}>
            <AntDesign
              name={"leftcircleo"}
              color={"#000"}
              style={{ fontSize: 20 }}
            />
            <Text style={{ fontFamily: "ProximaNovaBold", fontSize: 20, marginTop: 8 }}>
              FAQs
            </Text>
          </View>
          <WebView
            disabled={true}
            source={{ uri: "https://nationaluptake.com/faq-naup" }}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: "#fff",
          }}
        >
          <ActivityIndicator size="large" color={"#00A7FF"} />
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({});

export default Faq;
