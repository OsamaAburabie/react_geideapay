import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Alert} from 'react-native';
import RefundRequestBody from '../request/RefundRequestBody';
import GeideaApi from '../actions/GeideaApi';

class PaymentDetails extends Component {
  constructor(props) {
    super(props);
    this.onRefundButtonPress = this.onRefundButtonPress.bind(this);
  }
  componentDidMount() {
    const geideaApiResponse = this.props.route.params?.geideaApiResponse;
  }

  onRefundButtonPress() {
    const geideaApiResponse = this.props.route.params?.geideaApiResponse;
    const publicKey = this.props.route.params?.publickeyforrefund;
    const apiPassword = this.props.route.params?.apipasswordforrefund;
    this.setState({isLoading: true});
    let refundRequestBody = new RefundRequestBody(geideaApiResponse.orderId);

    GeideaApi.refund(refundRequestBody, publicKey, apiPassword)
      .then(res => {
        const refundPayload = res.order;
        this.props.navigation.navigate('PaymentRefund', {refundPayload});
      })
      .catch(err => {
        Alert.alert('Refund error', err);
      });
  }

  handleOk = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
    const geideaApiResponse = this.props.route.params?.geideaApiResponse;
    const modifiedResponse = {};
    for (const key in geideaApiResponse) {
      if (key.startsWith('Order.')) {
        const modifiedKey = key.replace('Order.', '');
        modifiedResponse[modifiedKey] = geideaApiResponse[key];
      }
    }

    const responseString = JSON.stringify(modifiedResponse, null, 2);

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.header}>
            {geideaApiResponse.status} - {geideaApiResponse.detailedStatus}
          </Text>
          <Text style={styles.response}>{responseString}</Text>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.onRefundButtonPress}>
            <Text style={styles.buttonText}>Refund Order</Text>
          </TouchableOpacity>
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

export default PaymentDetails;
