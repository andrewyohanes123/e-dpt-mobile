import React from 'react'
import { View, Image } from 'react-native'
import {Text, Button, Divider } from 'react-native-elements'

export default function EmptyData({ onPress }) {
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{ width: 400, height: 400, marginBottom: 5 }} source={require('../imgs/empty.png')} />
        <Text h4>Belum ada data DPT</Text>
        <Text>Silakan import data DPT</Text>
        <Divider style={{ marginVertical: 5 }} />
        <Button onPress={onPress} title="Import DPT" raised />
      </View>
    </>
  )
}
