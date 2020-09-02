import React, { Component } from "react";
import { ImageBackground, View, StatusBar, Image } from "react-native";
import { Container, Button, H3, Text, Content, H1 } from "native-base";
import styles from "./style";

const launchLogo = require("../../assets/images/logooo.png");

class Home extends Component {
  componentDidMount() {
    this.timeoutHandle = setTimeout(() => {
      this.props.navigation.navigate("Welcome");
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutHandle); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
  }

  render() {
    return (
      <Container style={[styles.container, {backgroundColor: '#fff'}]}>
        <Content>
          <View>
            <Image
              source={launchLogo}
              resizeMode="contain"
              style={styles.imageLogo}
            ></Image>
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                color: "#273444",
                fontSize: 34,
                fontFamily: 'ProximaNovaSemiBold',
                letterSpacing: 1
              }}
            >
              National Uptake
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: 4,
                color: "#273444",
                fontSize: 14,
                fontWeight: "100",
                fontFamily: 'ProximaNovaReg'
              }}
            >
              What you believe is what you get
            </Text>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Home;
