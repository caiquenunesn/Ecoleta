import React, { useEffect, useState } from 'react';
import { AppLoading } from 'expo';
import { Feather } from '@expo/vector-icons';
import { Text, ImageBackground , View, Image, StyleSheet, Alert} from 'react-native';
import { Roboto_400Regular, Roboto_500Medium, useFonts } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEuf {
  sigla: string;
}

interface IBGEname {
  nome: string;
}
const Home = () => {
   const [UFS, setUFS] = useState<string[]>([]);
   const [Muni, setMuni] = useState<string[]>([]);

   const [UFselected, setUFselected] = useState<string>('');
   const [Muniselected, setMuniselected] = useState<string>('');
    const navigation = useNavigation();
    const [FontsGoogle] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Ubuntu_700Bold,
      })
      
      useEffect(() => {
        axios.get<IBGEuf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(res => {
          const ufsiglas = res.data.map(siglas => siglas.sigla);
        setUFS(ufsiglas);
        }
          )
      }, [])

      useEffect(() => {
        axios.get<IBGEname[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UFselected}/municipios`)
        .then(res => {
            const Municipios = res.data.map(nome => nome.nome);
            setMuni(Municipios);
        })
      }, [UFselected])
    

    if(!FontsGoogle) {
        return <AppLoading />
    }

    

    function handleStackPoints(){
      const data ={
        Muniselected,
        UFselected,
      }

      if(!Muniselected){
        Alert.alert('Verifique o Campo', 'Por Favor Insire sua Cidade')
        return;
      }
         navigation.navigate('Points', data);
    }

    function handleUFselected(uf: string){
      setUFselected(uf);
    }
    function handleMuniselected(muni: string){
       setMuniselected(muni);
    }


    return(
        <ImageBackground
        source={require('../../assets/home-background.png')}
        style={style.container}
        imageStyle={{width: 273, height: 368}}
        >
            <View style={style.main}>
                <Image source={require('../../assets/logo.png')}/>
                <Text style={style.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={style.description}>Ajudamos pessoas a encotrarem pontos de coleta de forma eficiente </Text>
            </View>
            <RNPickerSelect
            onValueChange={(value) => handleUFselected(value)}
            items={UFS.map(uf => (
              
                {key: uf, label: uf, value: uf}
            ))} 
            >
            </RNPickerSelect>
            <RNPickerSelect onValueChange={value => handleMuniselected(value)}
              
            items={Muni.map(muni => (
                {key: muni, label: muni, value: muni}
            ))}>
            </RNPickerSelect>
              
                
              
            <View style={style.footer}>
              
                <RectButton style={style.button} onPress={handleStackPoints}>
                    <View style={style.buttonIcon}>
                        <Feather name="arrow-right" size={24} color="#fff"/>
                    </View>
                    <Text style={style.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        backgroundColor: '#f0f0f5'
      },
    
      main: {
        flex: 1,
        justifyContent: "center",
      },
    
      title: {
        color: "#322153",
        fontSize: 32,
        fontFamily: "Ubuntu_700Bold",
        maxWidth: 260,
        marginTop: 64,
      },
    
      description: {
        color: "#6C6C80",
        fontSize: 16,
        marginTop: 16,
        fontFamily: "Roboto_400Regular",
        maxWidth: 260,
        lineHeight: 24,
      },
    
      footer: {},
    
      select: {},
    
      input: {
        height: 60,
        backgroundColor: "#FFF",
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
      },
    
      button: {
        backgroundColor: "#34CB79",
        height: 60,
        flexDirection: "row",
        borderRadius: 10,
        overflow: "hidden",
        alignItems: "center",
        marginTop: 8,
      },
    
      buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        justifyContent: "center",
        alignItems: "center",
      },
    
      buttonText: {
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
        color: "#FFF",
        fontFamily: "Roboto_500Medium",
        fontSize: 16,
      },
});

export default Home;