import React, { useState } from 'react'
import { Input, Button, Divider, Card, Text } from 'react-native-elements'
import { View, ScrollView, Image, Dimensions, ToastAndroid, StyleSheet } from 'react-native'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import 'moment/locale/id'

const { width } = Dimensions.get('window');
export default function DataDisplay({ voter, notFound, onSearch, statistic }) {
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
            <Text style={{ textAlign: 'center', color: '#777' }}>Data pemilih dengan nama {searchQuery.nama} dan tanggal lahir {moment(searchQuery.date).format('DD MMMM YYYY')} tidak ditemukan</Text>
          </View>
          :
          voter.length > 0 ?
            <>
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
              </Card>
              <Card containerStyle={{ marginHorizontal: 0 }}>
                <Card.Title>Statistik TPS</Card.Title>
                <Card.Divider />
                <Text>Jumlah pemilih di TPS {`000${voter[0].tps}`.slice(-3)}: {statistic.length} orang</Text>
                <Text>Laki - laki: {statistic.filter(stat => stat.jenis_kelamin === 'L').length} orang</Text>
                <Text>Perempuan: {statistic.filter(stat => stat.jenis_kelamin === 'P').length} orang</Text>
              </Card>
            </>
            :
            <View>
              <Card>
                <Card.Title>Syarat Sebagai Pemilih</Card.Title>
                <Card.Divider />
                <View style={styles.row}>
                  <View style={styles.col1}><Text>1.</Text></View>
                  <View style={styles.col2}>
                    <Text style={styles.justify}>Genap berumur 17 (tujuh belas) tahun atau lebih pada hari pemungutan suara, sudah kawin, atau sudah pernah kawin</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col1}><Text>2.</Text></View>
                  <View style={styles.col2}>
                    <Text style={styles.justify}>Tidak sedang terganggu jiwa/ingatanya</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col1}><Text>3.</Text></View>
                  <View style={styles.col2}>
                    <Text style={styles.justify}>Tidak sedang dicabut hak pilihnya berdasarkan putusan pengadilan yang telah mempunyai kekuatan hukum tetap</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col1}><Text>4.</Text></View>
                  <View style={styles.col2}>
                    <Text style={styles.justify}>Berdomisili di wilayah administratif Pemilih yang dibuktikan dengan KTP-el</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col1}><Text>5.</Text></View>
                  <View style={styles.col2}>
                    <Text style={styles.justify}>Pemilih yang belum memiliki KTP-el, Pemilih dapat menggunakan Surat Keterangan perekaman KTP-el yang dikeluarkan oleh Dinas Kependudukan dan Pencatatan Sipil atau instansi sejenisnya yang memiliki kewenangan untuk itu; dan</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col1}><Text>6.</Text></View>
                  <View style={styles.col2}>
                    <Text style={styles.justify}>Tidak sedang menjadi Tentara Nasional Indonesia, atau Kepolisisan Negara Republik Indonesia</Text>
                  </View>
                </View>
              </Card>
            </View>
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  justify: {
    textAlign: 'justify',
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    marginBottom: 3.5
  },
  col1: {
    flex: 0,
    marginRight: 2.5
  },
  col2: {
    flex: 1
  }
})