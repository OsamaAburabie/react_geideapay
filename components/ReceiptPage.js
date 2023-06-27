import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaymentReceiptWidget = ({
  lang,
  amount,
  currency,
  orderId,
  merchantReferenceID,
  operation,
  showSuccessReceipt,
  failureMesg,
}) => {
  const date = new Date();
  const navigation = useNavigation();
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  if (showSuccessReceipt) {
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.container}>
          <Image
            style={{ width: 100, height: 100 }} 
            source={require('../assets/approved.jpg')}
          />
          <Text style={[styles.title, styles.textMarginTop, {fontWeight: 'bold'},{color:'black'}]} numberOfLines={1}>
            {lang === 'English'
              ? 'Transaction Approved'
              : 'تمت الموافقة على الصفقة'}
          </Text>
          <Text style={[styles.text, styles.poweredBy]} numberOfLines={1}>
            {lang === 'English'
              ? 'The Receipt will close automatically after 15 sec'
              : 'سيتم إغلاق الإيصال تلقائيًا بعد 15 ثانية'}
          </Text>

          <View style={[styles.row, {marginTop: 20}]}>
            <View style={styles.label}>
              <Text style={styles.labelText}>
                {lang === 'English' ? 'Date/Time' : 'التاريخ / الوقت'}
              </Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.valueText}>{formattedDate}</Text>
            </View>
          </View>

          <View style={[styles.row, {marginTop: 20}]}>
            <View style={styles.label}>
              <Text style={styles.labelText}>
                {lang === 'English' ? 'Operation' : 'عملية'}
              </Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.valueText}>{operation}</Text>
            </View>
          </View>

          <View style={[styles.row, {marginTop: 20}]}>
            <View style={styles.label}>
              <Text style={styles.labelText}>
                {lang === 'English' ? 'Geidea order ID' : 'معرّف طلب جيديا'}
              </Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.valueText}>{orderId}</Text>
            </View>
          </View>
          <View style={[styles.row, {marginTop: 20}]}>
            <View style={styles.label}>
              <Text style={styles.labelText}>
                {lang === 'English'
                  ? 'Merchant Reference ID'
                  : 'معرّف مرجع التاجر'}
              </Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.valueText}>{merchantReferenceID}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          </View>
          <View style={[styles.row, {marginTop: 20}]}>
            <View style={styles.label}>
              <Text style={[styles.labelText,{fontWeight: 'bold'}]}>
                {lang === 'English' ? 'Total' : 'الإجمالي'}
              </Text>
            </View>
            <View style={styles.value}>
              <Text style={[styles.valueText, {fontWeight: 'bold'}]}>
                {amount} {currency}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={[styles.poweredBy, styles.textMarginTop,{color:'blue'}]} numberOfLines={1}>
              {lang === 'English' ? 'Go to merchant website' : 'الانتقال إلى موقع التاجر'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  } else {
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={[styles.container]}>
          <Image
           style={{ width: 100, height: 100 }} 
            source={require('../assets/failed.png')}
          />
          <Text style={[styles.title, styles.textMarginTop, {fontWeight: 'bold'},{color:'black'}]} numberOfLines={1}>
            {lang === 'English' ? 'Transaction Failed' : 'فشل الاجراء'}
          </Text>
          <Text style={[styles.text, styles.poweredBy]} numberOfLines={1}>
            {lang === 'English'
              ? 'The Receipt will close automatically after 15 sec'
              : 'سيتم إغلاق الإيصال تلقائيًا بعد 15 ثانية'}
          </Text>

          <View style={[styles.row, {marginTop: 20}]}>
            <View style={styles.label}>
              <Text style={styles.labelText}>
                {lang === 'English' ? 'Date/Time' : 'التاريخ / الوقت'}
              </Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.valueText}>{formattedDate}</Text>
            </View>
          </View>

          <View style={[styles.row, {marginTop: 20}]}>
            <View style={styles.label}>
              <Text style={styles.labelText}>
                {lang === 'English' ? 'Geidea order ID' : 'معرّف طلب جيديا'}
              </Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.valueText}>{orderId}</Text>
            </View>
          </View>

          <View style={[styles.row, {marginTop: 20}]}>
            <View style={styles.label}>
              <Text style={styles.labelText}>
                {lang === 'English'
                  ? 'Merchant Reference ID'
                  : 'معرّف مرجع التاجر'}
              </Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.valueText}>{merchantReferenceID}</Text>
            </View>
          </View>

          <View style={[styles.row, {marginTop: 20}]}>
            <View style={styles.label}>
              <Text style={styles.labelText}>
                {lang === 'English' ? 'Failure Reason' : 'سبب الفشل'}
              </Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.valueText}>{failureMesg}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={[styles.poweredBy, styles.textMarginTop,{color:'blue'}]} numberOfLines={1}>
              {lang === 'English' ? 'Go to merchant website' : 'الانتقال إلى موقع التاجر'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  label: {
    width: '50%',
    paddingHorizontal: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  labelText: {
    color: '#000',
    fontSize: 16,
  },
  value: {
    width: '50%',
    paddingHorizontal: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  valueText: {
    color: '#000',
    fontSize: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 10,
    textAlign: 'center',
  },
  text: {
    color: '#000',
    fontSize: 16,
  },
  poweredBy: {
    fontSize: 15,
    color: '#555',
  },
  textMarginTop: {
    marginTop: 20,
  },
});

export default PaymentReceiptWidget;
