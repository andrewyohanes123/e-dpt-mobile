import React, { useEffect, useState, useCallback } from 'react';
import { Header } from 'react-native-elements';
import { StatusBar, ToastAndroid, Alert } from 'react-native';
import RNFS from 'react-native-fs'
import Papa from 'papaparse'
import Realm from 'realm'
import Loading from './components/Loading';
import ImportModal from './components/ImportModal';
import DataDisplay from './components/DataDisplay';
import { VoterSchema } from './db/Voter';
import { FILE_PREFIX, HEADER_TITLE } from '@env';
import SplashScreen from 'react-native-splash-screen'

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
  const [statistic, setStatistic] = useState([]);
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    if (totalFile > 0) {
      getLastFile();
    }
  }, [totalFile]);

  useEffect(() => {
    if (totalData > 0) {
      check();
    }
  }, [totalData])

  useEffect(() => {
    RNFS.readDirAssets(`csv`).then(resp => {
      setTotalFile(resp.length);
      // console.log(resp.map(({ name, path }) => ({ name, path })))
    }).catch(e => {
      console.log(e);
    })
    console.log('running', FILE_PREFIX)
    SplashScreen.hide();
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

  const getLastFile = () => {
    RNFS.readFileAssets(`csv/${FILE_PREFIX}_${(totalFile - 1)}.csv`).then(res => {
      const arr = Papa.parse(res, { header: true, delimiter: ',' });
      const total = (999 * (totalFile - 1)) + arr.data.length - 1;
      console.log(total, realm.objects('Voter').length);
      setTotalData(total);
    })
  }

  useEffect(() => {
    if ((number + 1) === totalFile && (importCount + 1) === dataLength) {
      check();
    }
  }, [number, totalFile, dataLength, importCount])

  const check = async () => {
    console.log('check')
    const voters = realm.objects('Voter');
    const lastFile = (Math.floor((voters.length / 1000)) - 1);
    // const totalData = parseInt(TOTAL_DATA);
    // console.log(voters.length - ((lastFile+1) * 501) + 501, 'last row', voters.length, 'total', lastFile, 'last file');
    // console.log(voters.length)
    if (voters.length > 0) {
      if (voters.length < totalData) {
        // ToastAndroid.showWithGravity(`Data DPT Belum Lengkap ${voters.length}/${totalData}`, ToastAndroid.LONG, ToastAndroid.CENTER);
        Alert.alert('Jumlah data belum lengkap', `Jumlah data DPT untuk Kab/Kota ${HEADER_TITLE} belum lengkap.\n ${voters.length}/${totalData} data`)
        setNumber(lastFile < 0 ? 0 : lastFile);
      } else {
        toggleChecking(false);
        toggleLoading(false);
        ToastAndroid.showWithGravity(`Total data DPT: ${voters.length}`, ToastAndroid.LONG, ToastAndroid.TOP);
        Alert.alert('Jumlah data', `Jumlah data DPT untuk Kab/Kota ${HEADER_TITLE} adalah ${voters.length} data`)
      }
    } else {
      loadFile()
    }
  }

  const loadFile = useCallback(() => {
    RNFS.readFileAssets(`csv/${FILE_PREFIX}_${number}.csv`, 'utf8').then(fileStr => {
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
      setTimeout(() => {
        setDataLength(data.length);
        i = i + 1;
        setImportCount(i);
        if ((i + 1) === data.length) {
          // check();
          console.log('finish');
          setNumber(num => (num === totalFile ? num : num + 1));
          setImportCount(0);
        }
      }, 10);
      const currentVoter = realm.objects('Voter').filtered(
        'nama = $0 AND tanggal_lahir = $1 AND nik = $2 AND nkk = $3 AND tps = $4 AND kecamatan = $5 AND kelurahan = $6',
        `${d.nama}`.toUpperCase(),
        d.tanggal_lahir === 'tanggal_lahir' ? new Date(2020, 1, 1, 0, 0, 0) : new Date(...`${d.tanggal_lahir}`.split('|').reverse().map(e => parseInt(e)), 0, 0, 0),
        `${d.nik}`,
        `${d.nkk}`,
        `${d.tps}`,
        `${d.kecamatan}`,
        `${d.kelurahan}`
      )
      if (currentVoter.length === 0) {
        try {
          realm.write(() => {
            realm.create('Voter', {
              tanggal_lahir: d.tanggal_lahir === 'tanggal_lahir' ? new Date(2020, 1, 1, 0, 0, 0) : new Date(...`${d.tanggal_lahir}`.split('|').reverse().map(e => parseInt(e)), 0, 0, 0),
              nama: `${d.nama}`.toUpperCase(),
              nkk: `${d.nkk}`,
              nik: `${d.nik}`,
              kecamatan: `${d.kecamatan}`,
              kelurahan: `${d.kelurahan}`,
              tempat_lahir: `${d.tempat_lahir}`,
              tps: `${d.tps}`,
              kabupaten: `${d.kabupaten}`,
              jenis_kelamin: `${d.jenis_kelamin}`,
              // sumberdata: `${d.sumberdata}`,
              // keterangan: `${d.keterangan}`,
              // difabel: `${d.difabel}`,
              // ektp: `${d.ektp}`,
              // rt: `${d.rt}`,
              // rw: `${d.rw}`,
              // kawin: `${d.kawin}`,
              // alamat: `${d.alamat}`,
            });
          })
        } catch (error) {
          console.log(error, 'Error insert')
        }
      }
    });
  })

  const getStatistic = ({ tps, kecamatan, kelurahan }) => {
    const stat = realm.objects('Voter').filtered(`tps = $0 AND kecamatan = $1 AND kelurahan = $2`, tps, kecamatan, kelurahan);
    setStatistic(stat);
  }

  const getData = (nama, tanggal_lahir) => {
    const data = realm.objects('Voter')
    const voters = data.filtered(`nama CONTAINS $0 AND tanggal_lahir = $1`, `${nama}`.toUpperCase(), new Date(...`${tanggal_lahir}`.split('-').map(e => parseInt(e)), 0, 0, 0));
    if (voters.length > 0) {
      toggleNotFound(false);
      setVoter(voters);
      getStatistic(voters[0]);
    } else {
      setVoter([]);
      toggleNotFound(true);
    }
  }

  return (
    <>
      <StatusBar translucent={true} backgroundColor="#d35400" barStyle="light-content" />
      <Header backgroundColor="#d35400" centerComponent={{ text: `e-DPT ${HEADER_TITLE}`, style: { color: '#fff' } }} />
      {/* <View style={{ padding: 10, flex: 1 }}> */}
      {
        checking ?
          <Loading fileReady={fileReady} total={dataLength} number={number} totalFile={totalFile} progress={importCount} />
          :
          <>
            <DataDisplay voter={voter} statistic={statistic} notFound={notFound} onSearch={getData} />
          </>
      }
      {/* </View> */}
      <ImportModal loading={loading} number={number} total={totalFile} counter={importCount} dataLength={dataLength} />
    </>
  );
};
