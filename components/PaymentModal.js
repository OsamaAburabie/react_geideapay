import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableHighlight, View, Modal, Text} from 'react-native';
import {TextInput} from 'react-native-paper';
import {CreditCard} from './common/CreditCard';
import {CheckoutLogic, styles} from './CheckoutLogic';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PaymentReceiptWidget from './ReceiptPage';
import {Alert} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

class PaymentModal extends CheckoutLogic {
  constructor(props) {
    super(props);
    this._handleCloseModal = this._handleCloseModal.bind(this);
  }
  orderId = null;
  operation = '';
  failureMesg = '';

  renderTextInputRow(label, varName, defaultValue, isBilling) {
    const textColor = this.getTextColor();
    const backgroundColor = '#FFFFFF';
    return (
      <TextInput
        label={label}
        theme={{
          colors: {
            primary: textColor, // Outline color here
            text: textColor,
            placeholder: textColor,
            background: backgroundColor,
          },
        }}
        style={{textAlign: this.props.lang === 'Arabic' ? 'right' : 'left'}}
        mode="outlined"
        dense={true}
        onChangeText={value => this.onAddressChange(varName, isBilling, value)}
        defaultValue={defaultValue}
      />
    );
  }

  validateInput(inputName) {
    let input;
    if (this.state[inputName] == null) {
      input = this.props[inputName];
    } else {
      input = this.state[inputName];
    }
    if (inputName === 'phoneNumber') {
      const phoneRegex = /^\d{10}$/; // 10 digit phone number
      if (!phoneRegex.test(input)) {
        Alert.alert(
          'Invalid phone number',
          'Please enter a valid 10-digit phone number.',
        );
      }
    } else if (inputName === 'customerEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        Alert.alert('Invalid email', 'Please enter a valid email address.');
      }
    }
  }

  renderEmail() {
    const textColor = this.getTextColor();
    const backgroundColor = '#FFFFFF';
    return (
      <View>
        <Text
          style={[
            this.TitleStyle(),
            {textAlign: this.props.lang === 'Arabic' ? 'right' : 'left'},
          ]}>
          {this.props.lang === 'English'
            ? 'Customer Email'
            : 'البريد الإلكتروني للعميل'}
        </Text>
        <TextInput
          label={
            this.props.lang === 'English'
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
          style={{textAlign: this.props.lang === 'Arabic' ? 'right' : 'left'}}
          mode="outlined"
          dense={true}
          onChangeText={value =>
            this.handlePaymentDetails('customerEmail', value)
          }
          defaultValue={this.props.customerEmail}
          onBlur={value => {
            this.validateInput('customerEmail', value);
          }}
        />
      </View>
    );
  }

  renderPhone() {
    const textColor = this.getTextColor();
    const backgroundColor = '#FFFFFF';
    return (
      <View>
        <Text
          style={[
            this.TitleStyle(),
            {textAlign: this.props.lang === 'Arabic' ? 'right' : 'left'},
          ]}>
          {this.props.lang === 'English' ? 'Phone Number' : 'رقم التليفون'}
        </Text>
        <TextInput
          label={
            this.props.lang === 'English' ? 'Phone Number' : 'رقم التليفون'
          }
          theme={{
            colors: {
              primary: textColor,
              text: textColor,
              placeholder: textColor,
              background: backgroundColor,
            },
          }}
          style={{textAlign: this.props.lang === 'Arabic' ? 'right' : 'left'}}
          mode="outlined"
          dense={true}
          onChangeText={value =>
            this.handlePaymentDetails('phoneNumber', value)
          }
          defaultValue={this.props.phoneNumber}
          onBlur={value => this.validateInput('phoneNumber', value)}
        />
      </View>
    );
  }

  renderAddress(isBilling) {
    const {lang} = this.props;
    if (lang === 'Arabic') {
      return this.renderAddressAR(isBilling);
    }
    return this.renderAddressEN(isBilling);
  }
  renderAddressAR(isBilling) {
    const textColor = '#000000';
    const backgroundColor = '#FFFFFF';
    return (
      <View>
        <Text style={this.TitleStyle()}>
          {isBilling ? 'عنوان الدفع' : 'عنوان الشحن'}
        </Text>
        {this.renderTextInputRow(
          'الدوله',
          '_countryCode',
          isBilling
            ? this.props.billingAddress?._countryCode
            : this.props.shippingAddress?._countryCode,
          isBilling,
        )}
        {this.renderTextInputRow(
          'الشارع و رقم المنزل',
          '_street',
          isBilling
            ? this.props.billingAddress?._street
            : this.props.shippingAddress?._street,
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
                ? this.props.billingAddress?._city
                : this.props.shippingAddress?._city
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
                ? this.props.billingAddress?._postCode
                : this.props.shippingAddress?._postCode
            }
          />
        </View>
      </View>
    );
  }
  renderAddressEN(isBilling) {
    const textColor = '#000000';
    const backgroundColor = '#FFFFFF';
    return (
      <View>
        <Text style={this.TitleStyle()}>
          {' '}
          {isBilling ? 'Billing address' : 'Shipping address'}{' '}
        </Text>
        {this.renderTextInputRow(
          'Country Code',
          '_countryCode',
          isBilling
            ? this.props.billingAddress?._countryCode
            : this.props.shippingAddress?._countryCode,
          isBilling,
        )}
        {this.renderTextInputRow(
          'Street name & number',
          '_street',
          isBilling
            ? this.props.billingAddress?._street
            : this.props.shippingAddress?._street,
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
                ? this.props.billingAddress?._city
                : this.props.shippingAddress?._city
            }
          />
          <TextInput
            label="Postal"
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
                ? this.props.billingAddress?._postCode
                : this.props.shippingAddress?._postCode
            }
          />
        </View>
      </View>
    );
  }
  onPaymentSuccess(res) {
    this.orderId = res.order.orderId;
    this.operation = res.order.paymentOperation;
    const {amount, currency} = res;
    this.setState({
      showSuccessReceipt: true,
    });
    setTimeout(() => this.setState({showSuccessReceipt: false}), 15000);
    this._handleCloseModal();
    this.props.onPaymentSuccess(res)?.();
  }

  onPaymentFailure(res) {
    this.orderId = this.state.orderId;
    this.failureMesg = res;
    this.setState({
      showFailureReceipt: true,
    });
    setTimeout(() => this.setState({showFailureReceipt: false}), 15000);
    this._handleCloseModal();
    this.props.onPaymentFailure(res)?.();
  }
  _handleCloseModal() {
    this.setState({...this._calculateState()}, this.props.onRequestClose());
  }
  renderCreditCardForm() {
    return <CreditCard lang={this.props.lang} onChange={this.onDataChange} />;
  }
  updateSameAddressOnOpen = () => {
    this.setState({sameAddress: this.props.sameAddress});
  };
  renderContent() {
    return (
      <KeyboardAwareScrollView style={{flexGrow: 1, maxHeight: 400}}>
        <View>
          {this.renderCreditCardForm()}
          {this.props.showEmail ? this.renderEmail() : null}
          {this.props.showPhone ? this.renderPhone() : null}
          {this.props.showBilling ? this.renderAddress(true) : null}
          {this.props.showBilling ? (
            <View style={styles.CheckBox}>
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
              />
              <Text>
                {this.props.lang === 'English'
                  ? 'Shipping address is same as billing address'
                  : 'عنوان الشحن هو نفس عنوان إرسال الفواتير'}
              </Text>
            </View>
          ) : null}
          {this.props.showBilling && !this.state.sameAddress
            ? this.renderAddress(false)
            : null}
          {this.renderButtonType()}
        </View>
      </KeyboardAwareScrollView>
    );
  }

  renderPaymentForm() {
    return (
      <View style={[styles.parentSection, styles.paymentForm]}>
        <View style={styles.sectionContainer}>{this.renderContent()}</View>
      </View>
    );
  }

  renderCloseModalIcon() {
    return (
      <View style={styles.closeModalIconContainer}>
        <TouchableHighlight
          onPress={this._handleCloseModal}
          underlayColor="transparent">
          <View>
            <Text>
              <Icon name="times-circle" size={25} color="#000" />
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    const {visible, transparent, onRequestClose} = this.props;
    const {amount, currency} = this.props;
    return (
      <View>
        <Modal
          visible={
            (this.state.showSuccessReceipt || this.state.showFailureReceipt) &&
            this.props.showReceipt
          }
          transparent={true}
          animationType="slide">
          <View style={styles.container}>
            <PaymentReceiptWidget
              lang={this.props.lang}
              amount={amount}
              currency={currency}
              orderId={this.orderId}
              merchantReferenceID={this.props.merchantReferenceID}
              operation={this.operation}
              showSuccessReceipt={this.state.showSuccessReceipt}
              failureMesg={this.failureMesg}
            />
          </View>
        </Modal>

        <Modal
          visible={visible}
          transparent={transparent}
          animationType="slide"
          onShow={this.updateSameAddressOnOpen}
          onRequestClose={onRequestClose}>
          <View style={styles.container}>
            <View style={styles.paymentContainer}>
              <View style={{backgroundColor: this.props.headerColor}}>
                {this.renderCloseModalIcon()}
                {this.props.hideLogo ? null : this.renderPaymentInfo()}
              </View>
              {this.renderPaymentForm()}
            </View>
          </View>
        </Modal>
        {this._renderThreeDSecure()}
      </View>
    );
  }
}

PaymentModal.propTypes = {
  visible: PropTypes.bool,
  amount: PropTypes.number,
  currency: PropTypes.string,
  description: PropTypes.string,
  transparent: PropTypes.bool,
  onRequestClose: PropTypes.func,
  onPaymentSuccess: PropTypes.func,
  onPaymentFailure: PropTypes.func,
};

PaymentModal.defaultProps = {
  transparent: true,
  currency: '',
};

export default PaymentModal;
