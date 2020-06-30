import React, { useState, useEffect} from 'react';
import { Feather } from '@expo/vector-icons'
import Constants from 'expo-constants';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';
import * as Location from 'expo-location';

interface item {
    id: number;
    title: string;
    image_url: string;
}

interface Point {
    id: number;
    name: string;
    image: string;
    image_url: string;
    latitude: number;
    longitude: number;
    
}

interface Params {
    city: string;
    uf: string;
}

const Points = () => {
    const route = useRoute();
    const navigator = useNavigation();
    const [points, setPoints] = useState<Point[]>([]);
    const [items, setItems] = useState<item[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]); 

    useEffect(() => {
        async function loadPosition(){
            const { status } = await Location.requestPermissionsAsync();

            if(status !== 'granted'){
                Alert.alert('Ooooops...', 'Precisamos de sua permissão para obter a localização');
                return;
            }
            const location = await Location.getCurrentPositionAsync();

            const { latitude, longitude } = location.coords;

            setInitialPosition([latitude, longitude]);

        }

        loadPosition();
    }, []);

    useEffect(() => {
        api.get('items').then(res => {
            setItems(res.data);
        })
    }, []);

    useEffect(() => {
        api.get('points', {
            params: {
                city: route.params.Muniselected,
                uf: route.params.UFselected,
                items: selected,
                }
            }
        ).then(res => {
            setPoints(res.data)
        })
}, [selected])

    function handleNavigatorToDetail(id: number){
        navigator.navigate('Detail', { point_id: id});
    }

    function handleGoBack(){
        navigator.goBack();
    }

    function handleSelected(id: number){
        const alreadySelected = selected.findIndex(item => item === id);

        if(alreadySelected >= 0){
            const filteredItem = selected.filter(item => item !== id)

            setSelected(filteredItem);
        }else{
            setSelected([...selected, id])
        }
    }


    return(
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>

                <Text style={styles.title}>Bem-vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    {initialPosition[0] !== 0 && (
                        
                    <MapView style={styles.map}
                        initialRegion={{
                            latitude:  initialPosition[0],
                            longitude: initialPosition[1],
                            latitudeDelta: 0.010,
                            longitudeDelta: 0.010,
                        }}
                        >
                            <Marker coordinate={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                            }} />
                        {points.map(point => (
                            <Marker
                            key={String(point.id)}
                            style={styles.mapMarker}
                            onPress={() => handleNavigatorToDetail(point.id)}
                            coordinate={{
                                latitude: point.latitude,
                                longitude: point.longitude,
                            }}>
                                <View style={styles.mapMarkerContainer}>
                                    <Image style={styles.mapMarkerImage} source={{ uri: point.image_url}}/>
                                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                </View>
                            </Marker>
                        ))}
                    </MapView>
                        )}
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView 
                horizontal 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20}}
                >
                {items.map(item => (
                    <TouchableOpacity 
                    style={[
                        styles.item,
                        selected.includes(item.id) ? styles.selectedItem : {}
                    ]} 
                    onPress={() => {handleSelected(item.id)}}
                    key={String(item.id)}
                    activeOpacity={0.5}
                    >
                        <SvgUri width={42} height={42} uri={item.image_url} />
                <Text style={styles.itemTitle}>{item.title}</Text>
                    </TouchableOpacity>
                ))}

                </ScrollView>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points;