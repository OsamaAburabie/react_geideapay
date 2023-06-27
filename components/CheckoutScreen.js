import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CreateCard from './CreditCardScreen/components/CreateCard';
import {CheckoutLogic, styles} from './CheckoutLogic';
import {View, Text, Modal} from 'react-native';
import PaymentReceiptWidget from './ReceiptPage';
import {TextInput} from 'react-native-paper';
import {Alert} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

class CheckoutScreen extends CheckoutLogic {
  constructor(props) {
    super(props);
    this.sameAddressState = this.sameAddressState.bind(this);
  }
  orderId = null;
  operation = '';
  failureMesg = '';

  closeScreen() {
    this.props.navigation.pop(1);
  }
  cardContainer() {
    const backgroundColor = this.getBackgroundColor();

    return {
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: backgroundColor,
    };
  }

  validateInput(inputName) {
    let input;
    if (this.state[inputName] == null) {
      input = this.myProps[inputName];
    } else {
      input = this.state[inputName];
    }
    if (inputName === 'customerEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        Alert.alert('Invalid email', 'Please enter a valid email address.');
      }
    }
  }

  renderTextInputRow(label, varName, defaultValue, isBilling) {
    const textColor = this.getTextColor();
    return (
      <TextInput
        label={label}
        theme={{
          colors: {
            primary: textColor, // Outline color here
            text: textColor,
            placeholder: textColor,
          },
        }}
        style={this.TextInputRowStyle()}
        mode="outlined"
        dense={true}
        onChangeText={value => this.onAddressChange(varName, isBilling, value)}
        defaultValue={defaultValue}
      />
    );
  }

  renderEmail() {
    const textColor = this.getTextColor();
    const backgroundColor = this.getBackgroundColor();
    return (
      <View>
        <TextInput
          label={
            this.myProps.lang === 'English'
              ? 'Customer Email'
              : 'البريد الإلكتروني للعميل'
          }
          theme={{
            colors: {
              primary: textColor,
              text: textColor,
              placeholder: textColor,
              background: backgroundColor,
            },
          }}
          style={{textAlign: this.myProps.lang === 'Arabic' ? 'right' : 'left'}}
          mode="outlined"
          dense={true}
          onChangeText={value =>
            this.handlePaymentDetails('customerEmail', value)
          }
          defaultValue={this.myProps.customerEmail}
          onBlur={value => this.validateInput('customerEmail', value)}
        />
      </View>
    );
  }

  renderPhone() {
    const textColor = this.getTextColor();
    const backgroundColor = this.getBackgroundColor();
    return (
      <View>
        <TextInput
          label={
            this.myProps.lang === 'English' ? 'Phone Number' : 'رقم التليفون'
          }
          theme={{
            colors: {
              primary: textColor,
              text: textColor,
              placeholder: textColor,
              background: backgroundColor,
            },
          }}
          style={[
            {marginTop: 12},
            {textAlign: this.myProps.lang === 'Arabic' ? 'right' : 'left'},
          ]}
          mode="outlined"
          dense={true}
          onChangeText={value =>
            this.handlePaymentDetails('phoneNumber', value)
          }
          defaultValue={`${this.myProps.code}${this.myProps.phoneNumber}`}
          onBlur={value => this.validateInput('phoneNumber', value)}
        />
      </View>
    );
  }

  renderAddress(isBilling) {
    const {lang} = this.myProps;
    if (lang === 'Arabic') {
      return this.renderAddressAR(isBilling);
    }
    return this.renderAddressEN(isBilling);
  }
  renderAddressAR(isBilling) {
    const textColor = this.getTextColor();
    const backgroundColor = this.getBackgroundColor();
    return (
      <View>
        <Text style={this.TitleStyle()}>
          {isBilling ? 'عنوان الدفع' : 'عنوان الشحن'}
        </Text>
        {this.renderTextInputRow(
          'الدوله',
          '_countryCode',
          isBilling
            ? this.myProps.billingAddress._countryCode
            : this.myProps.shippingAddress._countryCode,
          isBilling,
        )}
        {this.renderTextInputRow(
          'الشارع و رقم المنزل',
          '_street',
          isBilling
            ? this.myProps.billingAddress._street
            : this.myProps.shippingAddress._street,
          isBilling,
        )}
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
          }}>
          <TextInput
            label="المحافظه"
            theme={{
              colors: {
                primary: textColor, // Outline color here
                text: textColor,
                placeholder: textColor,
                background: backgroundColor,
              },
            }}
            style={{flex: 3, marginRight: 10, textAlign: 'right'}}
            mode="outlined"
            dense={true}
            onChangeText={value =>
              this.onAddressChange('_city', isBilling, value)
            }
            defaultValue={
              isBilling
                ? this.myProps.billingAddress?._city
                : this.myProps.shippingAddress?._city
            }
          />
          <TextInput
            label="الرقم البريدى"
            theme={{
              colors: {
                primary: textColor, // Outline color here
                text: textColor,
                placeholder: textColor,
                background: backgroundColor,
              },
            }}
            style={{flex: 3, textAlign: 'right'}}
            mode="outlined"
            dense={true}
            onChangeText={value =>
              this.onAddressChange('_postCode', isBilling, value)
            }
            defaultValue={
              isBilling
                ? this.myProps.billingAddress?._postCode
                : this.myProps.shippingAddress?._postCode
            }
          />
        </View>
      </View>
    );
  }
  renderAddressEN(isBilling) {
    const textColor = this.getTextColor();
    const backgroundColor = this.getBackgroundColor();
    return (
      <View>
        <Text style={this.TitleStyle()}>
          {' '}
          {isBilling ? 'Billing Address' : 'Shipping Address'}{' '}
        </Text>
        {this.renderTextInputRow(
          'Country Code',
          '_countryCode',
          isBilling
            ? this.myProps.billingAddress._countryCode
            : this.myProps.shippingAddress._countryCode,
          isBilling,
        )}
        {this.renderTextInputRow(
          'Street Name & Number',
          '_street',
          isBilling
            ? this.myProps.billingAddress._street
            : this.myProps.shippingAddress._street,
          isBilling,
        )}
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
          }}>
          <TextInput
            label="City"
            theme={{
              colors: {
                primary: textColor, // Outline color here
                text: textColor,
                placeholder: textColor,
                background: backgroundColor,
              },
            }}
            style={{flex: 3, marginRight: 10}}
            mode="outlined"
            dense={true}
            onChangeText={value =>
              this.onAddressChange('_city', isBilling, value)
            }
            defaultValue={
              isBilling
                ? this.myProps.billingAddress._city
                : this.myProps.shippingAddress._city
            }
          />
          <TextInput
            label="Post Code"
            theme={{
              colors: {
                primary: textColor, // Outline color here
                text: textColor,
                placeholder: textColor,
                background: backgroundColor,
              },
            }}
            style={{flex: 3}}
            mode="outlined"
            dense={true}
            onChangeText={value =>
              this.onAddressChange('_postCode', isBilling, value)
            }
            defaultValue={
              isBilling
                ? this.myProps.billingAddress._postCode
                : this.myProps.shippingAddress._postCode
            }
          />
        </View>
      </View>
    );
  }
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

  sameAddressState() {
    this.setState({sameAddress: this.myProps.sameAddress});
  }
  componentDidMount() {
    this.setState({sameAddress: this.myProps.sameAddress});
  }
  render() {
    const {amount, currency} = this.myProps;
    const language = this.myProps.lang;
    return (
      <View onClose={this.sameAddressState} onOpen={this.sameAddressState}>
        <KeyboardAwareScrollView style={this.cardContainer()}>
          <CreateCard
            language={language}
            textColor="#000000"
            backgroundColor="#ffffff"
            onChange={this.onDataChange}
          />

          {this.myProps.showEmail || this.myProps.showPhone ? (
            <Text style={[this.TitleStyle()]}>
              {language === 'English'
                ? 'Customer Details'
                : 'البريد الإلكتروني للعميل'}
            </Text>
          ) : null}
          {this.myProps.showEmail ? this.renderEmail() : null}
          {this.myProps.showPhone ? this.renderPhone() : null}
          {this.myProps.showBilling ? this.renderAddress(true) : null}
          {this.myProps.showBilling ? (
            <View style={[styles.CheckBox, {color: 'white'}]}>
              <CheckBox
                value={this.state.sameAddress}
                onValueChange={val => {
                  this.setState({sameAddress: val});
                  if (val) {
                    this.setState({
                      shippingAddress: {...this.state.billingAddress},
                    });
                  }
                }}
                tintColors={{true: 'black', false: 'black'}}
              />
              <Text style={{color: 'black'}}>
                {this.myProps.lang === 'English'
                  ? 'Shipping address same as billing address'
                  : 'عنوان الشحن هو نفس عنوان إرسال الفواتير'}
              </Text>
            </View>
          ) : null}
          {this.myProps.showBilling && !this.state.sameAddress
            ? this.renderAddress(false)
            : null}
          {this.renderButtonType(amount, currency)}
          {this.myProps.hideLogo ? null : this.renderPaymentInfo()}
          <View
            style={{
              marginTop: 15,
            }}
          />
          {this._renderThreeDSecure()}
          {this.orderId && (
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
                  amount={amount}
                  currency={currency}
                  orderId={this.orderId}
                  merchantReferenceID={this.myProps.merchantReferenceID}
                  operation={this.operation}
                  showSuccessReceipt={this.state.showSuccessReceipt}
                  failureMesg={this.failureMesg}
                />
              </View>
            </Modal>
          )}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default CheckoutScreen;
