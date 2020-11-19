import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Text } from 'react-native-elements'

export default function Loading({ progress, total, fileReady, number, totalFile }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color="#2c3e50" size="large" />
      { fileReady ?
        <Text h4 style={{ textAlign: 'center' }}>Mengimport data DPT</Text>
        :
        <Text h4 style={{ textAlign: 'center' }}>Memuat data DPT</Text>
        }
      <Text style={{ textAlign: 'center' }}>{progress}/{total} data</Text>
      <Text style={{ textAlign: 'center' }}>{number}/{totalFile} File DPT</Text>
      <Text style={{ textAlign: 'center', color: '#cdcdcd' }}>Harap tunggu 5 s/d 10 menit untuk mengimport data</Text>
    </View>
  )
}
