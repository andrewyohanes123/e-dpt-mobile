import React, { useEffect, useState } from 'react';
import { Header, Button } from 'react-native-elements';
import { View, Alert } from 'react-native';
import Storage from 'react-native-storage'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from "react-native-document-picker";
import RNFS from 'react-native-fs'
import Papa from 'papaparse'
import EmptyData from './components/EmptyData';
import Loading from './components/Loading';
import ImportModal from './components/ImportModal';
import DataDisplay from './components/DataDisplay';

const storage = new Storage({
  size: 2048,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,

})

const App = () => {
  const [dataCount, setDataCount] = useState(0);
  const [checking, toggleChecking] = useState(true);
  const [importCount, setImportCount] = useState(0);
  const [dataLength, setDataLength] = useState(0);
  const [loading, toggleLoading] = useState(false);
  const [voter, setVoter] = useState({});
  const [notFound, toggleNotFound] = useState(false);

  useEffect(() => {
    check();
  }, [setDataCount]);

  const check = () => {
    storage.getAllDataForKey('voter').then(res => {
      toggleChecking(false);
      setDataCount(res.length)
    }).catch(e => {
      toggleChecking(false);
      console.log(e);
      setDataCount(0);
    })
  }

  const pickFile = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      })
      const content = await RNFS.readFile(doc.uri, 'utf8');
      const json = Papa.parse(content, {
        header: true
      });
      setDataLength(json.data.length);
      insertData({ data: json.data, meta: json.meta })
    } catch (error) {
      Alert.alert('Error', error.toString())
    }
  }

  const insertData = ({ data, meta }) => {
    console.log(data)
    toggleLoading(true);
    let count = 0;
    data.forEach(async d => {
      try {
        const res = await storage.save({
          key: `voter`,
          id: `${d.nik}`,
          data: { ...d }
        });
        console.log(res)
        count = count + 1;  
        setImportCount(count);      
        if ((count + 1) === data.length) {
          toggleLoading(false);
          check();
        }
        console.log(object)
      } catch (error) {
        console.log(error)
      }
    })
  }

  const getData = (id) => {
    // storage.getAllDataForKey('voter').then(resp => console.log(resp))
    //   .catch(e => console.log(e))
    storage.getBatchData([{
      key: 'voter',
      id
    }]).then(resp => {
      setVoter(resp[0]);
      console.log(resp)
      toggleNotFound(false);
    })
      .catch(e => {
        toggleNotFound(true);
        console.log(e.toString())
        Alert.alert('DPT Tidak ada', `DPT dengan NIK ${id} tidak ditemukan`);
      })
  }

  return (
    <>
      <Header backgroundColor="#2d3436" centerComponent={{ text: 'KPU', style: { color: '#fff' } }} />
      {/* <View style={{ padding: 10, flex: 1 }}> */}
        {
          checking ?
            <Loading />
            :
            dataCount === 0 ?
              <EmptyData onPress={pickFile} />
              :
              <>
                <DataDisplay voter={voter} notFound={notFound} onSearch={getData} />
              </>
        }
      {/* </View> */}
      <ImportModal loading={loading} counter={importCount} dataLength={dataLength} />
    </>
  );
};

export default App;
