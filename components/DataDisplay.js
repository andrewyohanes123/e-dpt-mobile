import React, { useState } from 'react'
import { Input, Button, Divider, Card, Text } from 'react-native-elements'
import { View, ScrollView, Image } from 'react-native'
import moment from 'moment'
import 'moment/dist/locale/id'

export default function DataDisplay({ voter, notFound, onSearch }) {
  const [nik, setNik] = useState('');

  moment.locale('id');

  const search = () => {
    if (nik.length > 0) {
      onSearch(nik);
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, padding: 8 }}>
        <Input keyboardType="number-pad" onChangeText={setNik} value={nik} placeholder="Cari data Pemilih berdasarkan NIK" />
        <Divider />
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
              <>
                <Card containerStyle={{ margin: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>Nama Pemilih</Text>
                  <Text>{voter.nama} <Text style={{ fontWeight: 'bold' }}>({voter.jenis_kelamin})</Text></Text>
                </Card>
                <Card containerStyle={{ margin: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>NIK</Text>
                  <Text>{voter.nik}</Text>
                </Card>
                <Card containerStyle={{ margin: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>NKK</Text>
                  <Text>{voter.nkk}</Text>
                </Card>
                <Card containerStyle={{ margin: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>Tempat/Tanggal Lahir</Text>
                  <Text>{voter.tempat_lahir}/{moment(voter.tanggal_lahir).format('DD MMMM YYYY')}</Text>
                </Card>
                <Card containerStyle={{ margin: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>TPS</Text>
                  <Text>{voter.tps} Kel. {voter.kelurahan}, Kec. {voter.kecamatan}, Kota Manado</Text>
                </Card>
              </>
            </Card>}
      </>}
    </ScrollView>
  )
}
