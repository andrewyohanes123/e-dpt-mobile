import React, { useState } from 'react'
import { Input, Button, Divider, Card, Text } from 'react-native-elements'
import { View, ScrollView, Image, Dimensions } from 'react-native'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import id from 'moment/dist/locale/id'

const { width } = Dimensions.get('window');
export default function DataDisplay({ voter, notFound, onSearch }) {
  const [nama, setNama] = useState('');
  const [date, setDate] = useState(new Date().toISOString());

  moment.locale('id', id);

  const search = () => {
    if (nama.length > 0 && date.length > 0) {
      onSearch(nama, date);
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
        <Button onPress={search} title="Cari Data" />
      </View>
      {Object.keys(voter).length > 0 && <>
        {
          notFound ?
            <>
              <Image source={require('../imgs/notfound.png')} style={{ width: 400, height: 300 }} />
              <Text style={{ textAlign: 'center', fontSize: 18 }}>Data Pemilih Dengan NIK {nik} Tidak Ditemukan</Text>
            </>
            :
            <Card containerStyle={{ padding: 0, paddingVertical: 20, marginHorizontal: 0 }}>
              <Card.Title>Data Pemilih</Card.Title>
              <Card.Divider />
              {voter.map(v => (<>
                <Card containerStyle={{ margin: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>Nama Pemilih</Text>
                  <Text>{v.nama} <Text style={{ fontWeight: 'bold' }}>({v.jenis_kelamin})</Text></Text>
                </Card>
                <Card containerStyle={{ margin: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>NIK</Text>
                  <Text>{v.nik}</Text>
                </Card>
                <Card containerStyle={{ margin: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>NKK</Text>
                  <Text>{v.nkk}</Text>
                </Card>
                <Card containerStyle={{ margin: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>Tempat/Tanggal Lahir</Text>
                  <Text>{v.tempat_lahir}/{moment(v.tanggal_lahir).subtract(1, 'month').format('DD MMMM YYYY')}</Text>
                </Card>
                <Card containerStyle={{ margin: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>TPS</Text>
                  <Text>{v.tps} Kel. {v.kelurahan}, Kec. {v.kecamatan}, Kabupaten/Kota {v.kabupaten}</Text>
                </Card>
              </>))}
            </Card>}
      </>}
    </ScrollView>
  )
}
