import React, { useState } from 'react'
import { Input, Button, Divider, Card, Text } from 'react-native-elements'
import { View, ScrollView, Image, Dimensions, ToastAndroid } from 'react-native'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import 'moment/locale/id'

const { width } = Dimensions.get('window');
export default function DataDisplay({ voter, notFound, onSearch }) {
  const [nama, setNama] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [searchQuery, setSearchQuery] = useState({ nama: '', date: '' });

  moment.locale('id');

  const search = () => {
    if (nama.length > 0 && date.length > 0) {
      onSearch(nama, date);
      setSearchQuery({ nama, date });
    } else {
      ToastAndroid.showWithGravity('Masukkan nama dan tanggal lahir', ToastAndroid.LONG, ToastAndroid.CENTER);
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, padding: 8 }}>
        <Input keyboardType="default" onChangeText={setNama} value={nama} placeholder="Nama Pemilih" />
        <DatePicker
          date={date}
          style={{ width }}
          placeholder="Masukkan Tanggal Lahir Pemilih"
          format="YYYY-MM-DD"
          confirmBtnText="Pilih"
          cancelBtnText="Batal"
          onDateChange={setDate}
        />
        <Divider style={{ marginVertical: 10 }} />
        <Button buttonStyle={{ backgroundColor: '#d35400' }} onPress={search} title="Cari Data" />
      </View>
      {
        notFound ?
          <View style={{ padding: 10 }}>
            <Image source={require('../imgs/notfound.png')} style={{ width: 400, height: 300 }} />
            <Text style={{ textAlign: 'center', fontSize: 18 }}>Data pemilih dengan nama {searchQuery.nama} dan tanggal lahir {moment(searchQuery.date).format('DD MMMM YYYY')} tidak ditemukan</Text>
          </View>
          :
          voter.length > 0 &&
          <Card containerStyle={{ padding: 0, paddingVertical: 20, marginHorizontal: 0 }}>
            <Card.Title>Data Pemilih</Card.Title>
            <Card.Divider />
            {voter.map((v, i) => (<React.Fragment key={i}>
              <View style={{ margin: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>Nama Pemilih</Text>
                <Text>{v.nama} <Text style={{ fontWeight: 'bold' }}>({v.jenis_kelamin})</Text></Text>
              </View>
              <View style={{ margin: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>NIK</Text>
                <Text>{v.nik}</Text>
              </View>
              <View style={{ margin: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>NKK</Text>
                <Text>{v.nkk}</Text>
              </View>
              <View style={{ margin: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>Tempat/Tanggal Lahir</Text>
                <Text>{v.tempat_lahir}/{moment(v.tanggal_lahir).subtract(1, 'month').format('DD MMMM YYYY')}</Text>
              </View>
              <View style={{ margin: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>TPS</Text>
                <Text>{`000${v.tps}`.slice(-3)} Kel. {v.kelurahan}, Kec. {v.kecamatan}, Kabupaten/Kota {v.kabupaten}</Text>
              </View>
            </React.Fragment>))}
          </Card>}
    </ScrollView>
  )
}
