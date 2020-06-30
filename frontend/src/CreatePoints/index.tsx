import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import logo from '../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import DropZone from '../components/Dropzone';

interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEuf {
    sigla: string,
}

interface muni {
    nome: string
}



function CreatePoints() {
    const [selectedFile, setSelectedFile] = useState<File>()
    const [items, setItems] = useState<Item[]>([]);
    const [UF, setUF] = useState<string[]>([]);
    const [muni, setMuni] = useState<string[]>([])
    const [position, setPosition] = useState<[number, number]>([0, 0]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const [selected, setSelected] = useState('0');
    const [selectedcity, setSelectedCity] = useState('0');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })

    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([
                latitude,
                longitude
            ])
            setPosition([
                latitude,
                longitude
            ])
        })
    }, [])

    useEffect(() => {
        api.get('items').then(res => {
            setItems(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get<IBGEuf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(res => {
                const ufinitials = res.data.map(uf => uf.sigla);
                setUF(ufinitials);
            });


    }, []);

    useEffect(() => {
        if (selected === '0') {
            return;
        }

        axios.get<muni[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selected}/municipios`)
            .then(res => {
                // const ufinitials = res.data.map(uf => uf.sigla);
                // setUF(ufinitials);
                const nome = res.data.map(muni => muni.nome)

                setMuni(nome);
            });
    }, [selected]);

    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
        setSelected(event.target.value)

    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    }

    function handleClickMap(event: LeafletMouseEvent) {
        setPosition([
            event.latlng.lat, event.latlng.lng
        ]);
    }

    function handleInput(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value })

    }

    function handleItems(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if (alreadySelected >= 0) {
            const filterItem = selectedItems.filter(item => item !== id);
            setSelectedItems(filterItem);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    async function submit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const [latitude, longitude] = position;
        const uf = selected;
        const city = selectedcity;
        const items = selectedItems;

        const data = new FormData();


        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('uf', uf);
        data.append('city', city);
        data.append('items', items.join(','));

        if(selectedFile){
            data.append('image', selectedFile);
        }
        

        try {
            await api.post('points', data);
            alert('cadastro com sucesso');
            history.push('/');
        } catch (err) {
            alert('error');
        }
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    <FiLogOut />
                    Voltar para Home
                </Link>
            </header>

            <form onSubmit={submit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <DropZone onFileUpload={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text"
                            name="name"
                            id="name"
                            onChange={handleInput}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email"
                                name="email"
                                id="email"
                                onChange={handleInput}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInput}
                            />
                        </div>
                    </div>
                </fieldset>


                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um local no mapa</span>
                    </legend>
                    {/* -23.6075069 , -46.4489193 */}
                    <Map center={initialPosition} zoom={15} onClick={handleClickMap}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={position} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selected}
                                onChange={handleSelectUF}>
                                <option value="0">Selecione uma UF</option>
                                {UF.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                onChange={handleSelectedCity}
                                value={selectedcity}
                            >
                                <option value="0">Selecione uma Cidade</option>
                                {muni.map(muni => {
                                    return (
                                        <option key={muni} value={muni}>{muni}</option>
                                    );
                                })}
                            </select>
                        </div>


                    </div>
                </fieldset>


                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um item ou mais abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleItems(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
}

export default CreatePoints;