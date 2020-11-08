import React from 'react'
import { Modal, View, Dimensions } from 'react-native'
import { Card, Text } from 'react-native-elements'

const {width} = Dimensions.get('screen');
export default function ImportModal({ loading, dataLength, counter }) {
  return (
    <>
      <Modal
        animationType="slide"
        // statusBarTranslucent={true}
        hardwareAccelerated={true}
        visible={loading}
        transparent={true}
      >
        <View
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Card containerStyle={{ width: width - 50 }}>
            <Card.Title>Memasukkan data DPT</Card.Title>
            <Text>Memasukkan data {counter}/{dataLength}</Text>
          </Card>
        </View>
      </Modal>
    </>
  )
}
