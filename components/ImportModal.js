import React from 'react'
import { Modal, View, Dimensions } from 'react-native'
import { Card, Text } from 'react-native-elements'

const {width} = Dimensions.get('screen');
export default function ImportModal({ loading, dataLength, counter, number, total }) {
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
            <Card.Divider />
            <Text>Memasukkan data {counter}/{dataLength}</Text>
            <Text>File DPT {number === null ? 1 : number + 1}/{total}</Text>
          </Card>
        </View>
      </Modal>
    </>
  )
}
