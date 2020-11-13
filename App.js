import React, { useEffect, useState } from 'react';
import { Header, Button } from 'react-native-elements';
import { View, Alert } from 'react-native';
import Storage from 'react-native-storage'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import DocumentPicker from "react-native-document-picker";
import RNFS from 'react-native-fs'
import Papa from 'papaparse'
// import EmptyData from './components/EmptyData';
import Realm from 'realm'
// import csvtojson from 'csvtojson'
import Loading from './components/Loading';
import ImportModal from './components/ImportModal';
import DataDisplay from './components/DataDisplay';
import { VoterSchema } from './db/Voter';
// import csv from './csv/sitaro.csv';

const storage = new Storage({
  size: 2048,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,

})
const realm = new Realm({ schema: [VoterSchema]})
const App = () => {
  const [checking, toggleChecking] = useState(true);
  const [importCount, setImportCount] = useState(0);
  const [dataLength, setDataLength] = useState(0);
  const [loading, toggleLoading] = useState(false);
  const [voter, setVoter] = useState({});
  const [notFound, toggleNotFound] = useState(false);

  useEffect(() => {
    check();
  }, []);

  const check = () => {
    console.log('check')
    const voters = realm.objects('Voter');
    if (voters.length > 0) {
      console.log(voters.length)
      toggleChecking(false);
    } else {
      RNFS.readFileAssets('csv/sitaro.csv').then(resp => {
        const parsedData = Papa.parse(resp, {header: true, delimitersToGuess: ['#', ',']});
        setDataLength(parsedData.data.length);
        toggleLoading(true);
        insertData(parsedData);
      }).catch(e => {
        Alert.alert('Error', 'File data DPT Tidak ada');
        console.log(e)
      })
    }
  }

  const insertData = ({ data }) => {
    let count = 0;
    data.forEach(d => {
      count = count + 1;
      realm.write(() => {
        realm.create('Voter', {
          ...d,
          tanggal_lahir: new Date(...d.tanggal_lahir.split('|').reverse().map(e => parseInt(e)), 0, 0, 0)
        });
      })
      setImportCount(c => c + 1);
      if ((count + 1) === data.length) {
        toggleLoading(false);
        toggleChecking(false);
        check();
      }
    })
  }

  const getData = (nama, tanggal_lahir) => {
    const data = realm.objects('Voter')
    const voters = data.filtered(`nama COINTAINS $0 AND tanggal_lahir = $1`, nama, tanggal_lahir);
    setVoter(voters);
  }

  return (
    <>
      <Header backgroundColor="#2d3436" centerComponent={{ text: 'KPU', style: { color: '#fff' } }} />
      {/* <View style={{ padding: 10, flex: 1 }}> */}
      {
        checking ?
          <Loading />
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
