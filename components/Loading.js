import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Text } from 'react-native-elements'

export default function Loading({ progress, total, fileReady }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color="#2c3e50" size="large" />
      { fileReady ?
        <Text style={{ textAlign: 'center' }}>Mengimport data DPT</Text>
        :
        <Text style={{ textAlign: 'center' }}>Memuat data DPT</Text>
        }
      {/* <Text style={{ textAlign: 'center' }}>{progress}/{total}</Text> */}
      <Text style={{ textAlign: 'center' }}>Harap tunggu 5 s/d 10 menit untuk mengimport data</Text>
    </View>
  )
}
