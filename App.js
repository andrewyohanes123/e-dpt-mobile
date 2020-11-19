import React, { useEffect, useState, useCallback } from 'react';
import { Header } from 'react-native-elements';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs'
import Papa from 'papaparse'
import Realm from 'realm'
import Loading from './components/Loading';
import ImportModal from './components/ImportModal';
import DataDisplay from './components/DataDisplay';
import { VoterSchema } from './db/Voter';

const realm = new Realm({ schema: [VoterSchema] })

export default function App() {
  const [checking, toggleChecking] = useState(true);
  const [importCount, setImportCount] = useState(0);
  const [dataLength, setDataLength] = useState(0);
  const [loading, toggleLoading] = useState(false);
  const [voter, setVoter] = useState([]);
  const [notFound, toggleNotFound] = useState(false);
  const [fileReady, toggleFileReady] = useState(false);
  const [number, setNumber] = useState(0);
  const [totalFile, setTotalFile] = useState(false);

  useEffect(() => {
    if (totalFile > 0) {
      check();
      console.log(Platform.Version, 'version')
    }
  }, [totalFile]);

  useEffect(() => {
    RNFS.readDirAssets('csv/').then(resp => setTotalFile(resp.length));
  }, []);

  useEffect(() => {
    if (number <= (totalFile - 1) && number > 0) {
      loadFile();
    }

    // if ((number + 1) === totalFile) {
    //   toggleChecking(false);
    //   toggleLoading(false);
    //   console.log('finish all')
    // }
  }, [number, totalFile]);

  useEffect(() => {
    if ((number + 1) === totalFile && (importCount + 1) === dataLength) {
      check();
    }
  }, [number, totalFile, dataLength, importCount])

  const check = async () => {
    console.log('check')
    const voters = realm.objects('Voter');
    console.log(voters.length)
    if (voters.length > 0) {
      toggleChecking(false);
      toggleLoading(false);
    } else {
      loadFile()
    }
  }

  const loadFile = useCallback(() => {
    RNFS.readFileAssets(`csv/sitaro_${number}.csv`, 'utf8').then(fileStr => {
      toggleLoading(true);
      const parsedData = Papa.parse(fileStr, { header: true, delimitersToGuess: ['#', ','] });
      toggleFileReady(true);
      console.log('file ready')
      insertData(parsedData);
    }).catch(error => {
      // Alert.alert('Error', 'File data DPT Tidak ada');
      console.log(error)
    });
  });

  // console.log({ dataLength });

  const insertData = useCallback(({ data }) => {
    console.log('insert data')
    // for (let i = 0; i < data.length; i++) {
    //   toggleLoading(true);
    //   setDataLength(data.length);
    //   setImportCount(i + 1);
    //   if ((i + 1) === data.length) {
    //     check();
    //     console.log('finish')
    //     toggleLoading(false);
    //     toggleChecking(false);
    //   }
    //   // console.log(data[i]);
    // }
    let i = 0;
    data.forEach((d) => {
      realm.write(() => {
        setTimeout(() => {
          setDataLength(data.length);
          i = i + 1;
          setImportCount(i);
          if ((i + 1) === data.length) {
            // check();
            console.log('finish');
            setNumber(num => (num === totalFile ? num : num + 1));
          }
        }, 50);
        realm.create('Voter', {
          tanggal_lahir: new Date(...`${d.tanggal_lahir}`.split('|').reverse().map(e => parseInt(e)), 0, 0, 0),
          nama: `${d.nama}`.toUpperCase(),
          nkk: `${d.nkk}`,
          nik: `${d.nik}`,
          kecamatan: `${d.kecamatan}`,
          kelurahan: `${d.kelurahan}`,
          sumberdata: `${d.sumberdata}`,
          keterangan: `${d.keterangan}`,
          difabel: `${d.difabel}`,
          ektp: `${d.ektp}`,
          id: `${d.id}`,
          tempat_lahir: `${d.tempat_lahir}`,
          rt: `${d.rt}`,
          rw: `${d.rw}`,
          tps: `${d.tps}`,
          kabupaten: `${d.kabupaten}`,
          jenis_kelamin: `${d.jenis_kelamin}`,
          kawin: `${d.kawin}`,
          alamat: `${d.alamat}`,
        });
      })
    });
  })

  const getData = (nama, tanggal_lahir) => {
    const data = realm.objects('Voter')
    const voters = data.filtered(`nama CONTAINS $0 AND tanggal_lahir = $1`, `${nama}`.toUpperCase(), new Date(...`${tanggal_lahir}`.split('-').map(e => parseInt(e)), 0, 0, 0));
    if (voters.length > 0) {
      toggleNotFound(false);
      setVoter(voters);
    } else {
      setVoter([]);
      toggleNotFound(true);
    }
  }

  return (
    <>
      <Header backgroundColor="#2d3436" centerComponent={{ text: 'KPU', style: { color: '#fff' } }} />
      {/* <View style={{ padding: 10, flex: 1 }}> */}
      {
        checking ?
          <Loading fileReady={fileReady} total={dataLength} number={number} totalFile={totalFile} progress={importCount} />
          :
          <>
            <DataDisplay voter={voter} notFound={notFound} onSearch={getData} />
          </>
      }
      {/* </View> */}
      <ImportModal loading={loading} number={number} total={totalFile} counter={importCount} dataLength={dataLength} />
    </>
  );
};
