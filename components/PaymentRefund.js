import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

class PaymentRefund extends Component {
  constructor(props) {
    super(props);
  }

  handleOk = () => {
    this.props.navigation.navigate('Home'); 
  };

  render() {
    const refundPayload = this.props.route.params?.refundPayload;
    const modifiedResponse = {};
    for (const key in refundPayload) {
      if (key.startsWith('Order.')) {
        const modifiedKey = key.replace('Order.', '');
        modifiedResponse[modifiedKey] = refundPayload[key];
      }
    }

    const responseString = JSON.stringify(modifiedResponse, null, 2);

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.header}>
            {refundPayload.status} - {refundPayload.detailedStatus}
          </Text>
          <Text style={styles.response}>{responseString}</Text>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.handleOk}>
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  response: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'monospace',
    textAlign: 'left',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#dddddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentRefund;
