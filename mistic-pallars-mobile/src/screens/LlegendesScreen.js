import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const LlegendesScreen = () => {
  // Sample data - no real backend connection yet
  const sampleLlegendes = [
    {
      id: '1',
      title: 'La Llegenda del Llac de la Torrassa',
      description: 'Una història misteriosa sobre les aigües encantades del Pallars...',
      category: 'Natura'
    },
    {
      id: '2',
      title: 'El Tresor dels Bandolers',
      description: 'Contes sobre els antics bandolers que van habitar aquestes muntanyes...',
      category: 'Història'
    },
    {
      id: '3',
      title: 'Els Esperits del Bosc',
      description: 'Relats sobrenaturals dels esperits que protegeixen els boscos...',
      category: 'Misteri'
    },
  ];

  const renderLlegenda = ({ item }) => (
    <TouchableOpacity style={styles.llegendaCard}>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
      <Text style={styles.llegendaTitle}>{item.title}</Text>
      <Text style={styles.llegendaDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Llegendes del Pallars</Text>
        <Text style={styles.headerSubtitle}>Descobreix les històries del nostre territori</Text>
      </View>
      
      <FlatList
        data={sampleLlegendes}
        renderItem={renderLlegenda}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4caf50',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e8f5e8',
    textAlign: 'center',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
  },
  llegendaCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryBadge: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  llegendaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  llegendaDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default LlegendesScreen;
