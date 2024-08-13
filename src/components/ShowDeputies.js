// ShowDeputies.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TextInput, Button } from 'react-native';
import axios from 'axios';

const ShowDeputies = () => {
  const [deputies, setDeputies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState(''); 
  const [searching, setSearching] = useState(false);

  const fetchDeputies = async (name) => {
    setSearching(true);
    try {
      const response = await axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados', {
        params: {
          nome: name,              
        }
      });
      setDeputies(response.data.dados);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchDeputies('');
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetchDeputies(searchName);
  };

  if (loading && !searching) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Erro ao carregar dados</Text>;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do deputado"
        value={searchName}
        onChangeText={setSearchName}
      />
      <Button title="Buscar" onPress={handleSearch} />
      <FlatList
        data={deputies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.urlFoto ? <Image source={{ uri: item.urlFoto }} style={styles.image} /> : null}
            <Text style={styles.name}>{item.nome}</Text>
            <Text>Partido: {item.siglaPartido}</Text>
            <Text>UF: {item.siglaUf}</Text>
            <Text>ID: {item.id}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShowDeputies;
