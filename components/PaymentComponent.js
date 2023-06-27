import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import CreateCard from './CreditCardScreen/components/CreateCard';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CheckoutLogic} from './CheckoutLogic';
import {TextInput} from 'react-native-paper';
import PaymentReceiptWidget from './ReceiptPage';

class PaymentComponent extends CheckoutLogic {
  constructor(props) {
    super(props);
    this.onDataChange = this.onDataChange.bind(this);
  }
  handleOptionChanges = option => {
    this.setState({selectedOption: option}, () =>
      console.log(this.state.selectedOption),
    );
  };

  handleOptionChange = option => {
    this.setState({selectedOption: option}, () => {
      if (this.state.selectedOption === 'geidea') {
        this.props.navigation.push('CheckoutScreen', {
          amount: Number(this.state.amount),
          screenTitle: 'Card Payment',
          title: 'Sample Geidea Payment Example Screen',
          description:
            'This is an example screen to show how to use Geidea SDK',
          currency: this.props.route.params?.currency,
          callbackUrl: this.props.route.params?.callbackUrl,
          publicKey: this.props.route.params?.publicKey,
          apiPassword: this.props.route.params?.apiPassword,
          billingAddress: this.props.route.params?.billingAddress,
          shippingAddress: this.props.route.params?.shippingAddress,
          showBilling: this.props.route.params?.showBilling,
          merchantReferenceID: this.props.route.params?.merchantReferenceID,
          sameAddress: this.props.route.params?.sameAddress,
          showEmail: this.props.route.params?.showEmail,
          hideLogo: this.props.route.params?.hideLogo,
          showReceipt: this.props.route.params?.showReceipt,
          showPhone: this.props.route.params?.showPhone,
          customerEmail: this.props.route.params?.customerEmail,
          code: this.props.route.params?.code,
          phoneNumber: this.props.route.params?.phoneNumber,
          lang: this.props.route.params?.lang,
          paymentOperation:
            this.state.paymentOperation === 'Default (merchant configuration)'
              ? null
              : this.state.paymentOperation,
          initiatedBy: this.state.initiatedBy,
          agreementType: this.state.agreementType,
          successResponse: '',
          failureResponse: '',
          textColor: '#ffffff',
          backgroundColor: '#000000',
          cardColor: '#000000', //#ff4d00
        });
      }
    });
  };

  resetPage = () => {
    this.props.navigation.navigate({
      name: 'Home',
    });
  };

  onPaymentSuccess = res => {
    this.orderId = res.order.orderId;
    this.operation = res.order.paymentOperation;
    const message = res.detailedResponseMessage;
    const geideaApiResponse = res.order;

    this.setState({showSuccessReceipt: true, successResponse: message}, () => {
      setTimeout(() => {
        this.setState({showSuccessReceipt: false, successResponse: ''}, () => {
          let publickeyforrefund = this.props.route.params?.publicKey;
          let apipasswordforrefund = this.props.route.params?.apiPassword;
          this.props.navigation.navigate('PaymentDetails', {
            geideaApiResponse,
            publickeyforrefund,
            apipasswordforrefund,
          });
        });
      }, 15000);
    });
  };

  onPaymentFailure = res => {
    const geideaApiResponse = res;
    this.orderId = this.state.orderId;
    this.failureMesg = res;
    this.setState({showFailureReceipt: true, failureResponse: res}, () => {
      setTimeout(() => {
        this.setState({showFailureReceipt: false, failureResponse: ''}, () => {
          this.props.navigation.navigate('PaymentFailure', {
            geideaApiResponse,
          });
        });
      }, 15000);
    });
  };

  onDataChange(form) {
    this.setState({creditCardFormValid: form.valid});
    this.setState({creditCardFormData: form.values});
  }

  render() {
    const {selectedOption, amount} = this.state;
    const language = this.myProps.lang;
    const isPaymentOptionSelected =
      selectedOption === 'geidea' || selectedOption === 'pci-dss';
    return (
      <View style={styles.container}>
        <Text
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          Payment Details
        </Text>

        <View style={{marginBottom: 20}}>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 15,
                marginRight: 20,
                color: 'black',
              }}>
              Amount
            </Text>
            <TextInput
              label=""
              style={{flex: 4, marginRight: 10, backgroundColor: '#fff'}}
              mode="outlined"
              dense={true}
              onChangeText={this.handlePaymentDetails.bind(this, 'amount')}
              defaultValue={amount}
            />
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 15,
                marginRight: 20,
                color: 'black',
              }}>
              Currency         {this.props.route.params?.currency}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => this.handleOptionChanges('geidea')}>
          <View style={styles.radioCircle}>
            {selectedOption === 'geidea' && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>Geidea SDK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => this.handleOptionChange('pci-dss')}>
          <View style={styles.radioCircle}>
            {selectedOption === 'pci-dss' && <View style={styles.selectedRb} />}
          </View>

          <Text style={styles.radioText}>Merchant PCI-DSS</Text>
        </TouchableOpacity>
        {this.state.selectedOption != 'pci-dss' && (
          <>
            <TouchableOpacity
              style={[
                styles.payButton,
                !isPaymentOptionSelected && styles.disabledPayButton,
              ]}
              onPress={() => this.handleOptionChange('geidea')}
              disabled={!isPaymentOptionSelected}>
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          </>
        )}
        <KeyboardAwareScrollView style={styles.cardcontainer}>
          {this.state.selectedOption === 'pci-dss' && (
            <>
              <CreateCard
                language={language}
                textColor="#000000"
                backgroundColor="#ffffff"
                onChange={this.onDataChange}
              />
              {this.renderButtonType(this.state.amount)}
            </>
          )}
        </KeyboardAwareScrollView>
        {this.orderId  && (
          <Modal
            visible={
              (this.state.showSuccessReceipt ||
                this.state.showFailureReceipt) &&
              this.myProps.showReceipt
            }
            transparent={true}
            animationType="slide">
            <View style={styles.container}>
              <PaymentReceiptWidget
                lang={this.myProps.lang}
                amount={this.state.amount}
                currency={this.myProps.currency}
                orderId={this.orderId}
                merchantReferenceID={this.myProps.merchantReferenceID}
                operation={this.operation}
                showSuccessReceipt={this.state.showSuccessReceipt}
                failureMesg={this.failureMesg}
              />
            </View>
          </Modal>
        )}
        {this._renderThreeDSecure()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardcontainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    marginTop: 60,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioCircle: {
    height: 30,
    width: 30,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#3740ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: '#3740ff',
  },
  radioText: {
    marginRight: 50,
    marginLeft: 10,
    fontSize: 20,
    color: '#000',
    fontWeight: '700',
  },
  payButton: {
    backgroundColor: '#ff4d00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  disabledPayButton: {
    opacity: 0.5,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentComponent;
