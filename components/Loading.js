import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Text } from 'react-native-elements'

export default function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color="#2c3e50" size="large" />
      <Text style={{ textAlign: 'center' }}>Memuat dan mengecek data DPT</Text>
    </View>
  )
}
