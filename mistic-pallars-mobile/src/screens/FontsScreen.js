import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as Font from 'expo-font';

const FontsScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        // Aquí pots afegir fonts personalitzades
        // 'CustomFont': require('../assets/fonts/CustomFont.ttf'),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.log('Error carregant les fonts:', error);
      setFontsLoaded(true); // Continua amb les fonts per defecte
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregant fonts...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Fonts dels Pallars</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fonts Naturals</Text>
        
        <View style={styles.fontItem}>
          <Text style={styles.fontName}>Font de la Puda</Text>
          <Text style={styles.fontDescription}>
            Situada a Gerri de la Sal, famosa per les seves propietats minerals.
          </Text>
        </View>
        
        <View style={styles.fontItem}>
          <Text style={styles.fontName}>Font del Ferro</Text>
          <Text style={styles.fontDescription}>
            Al Parc Nacional d'Aigüestortes, amb alt contingut en ferro.
          </Text>
        </View>
        
        <View style={styles.fontItem}>
          <Text style={styles.fontName}>Font de l'Espill</Text>
          <Text style={styles.fontDescription}>
            A la Vall de Boí, coneguda per la claredat de les seves aigües.
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fonts Històriques</Text>
        
        <View style={styles.fontItem}>
          <Text style={styles.fontName}>Font de la Vila</Text>
          <Text style={styles.fontDescription}>
            Al centre de Sort, ha abastit la població durant segles.
          </Text>
        </View>
        
        <View style={styles.fontItem}>
          <Text style={styles.fontName}>Font del Monestir</Text>
          <Text style={styles.fontDescription}>
            A Gerri de la Sal, associada a l'antic monestir benedíctí.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3F0',
  },
  loadingText: {
    fontSize: 16,
    color: '#2D5016',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5016',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B6914',
    marginBottom: 12,
  },
  fontItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  fontName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4,
  },
  fontDescription: {
    fontSize: 14,
    color: '#5A6C57',
    lineHeight: 20,
  },
});

export default FontsScreen;
