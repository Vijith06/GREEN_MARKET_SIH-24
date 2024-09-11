import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, FlatList, StyleSheet, TouchableOpacity, Modal, Alert, ImageBackground } from 'react-native';
const IP_ADDRESS = require('../IPAddress.js');
import { Linking } from 'react-native';

import Geolocation from '@react-native-community/geolocation'; // Import Geolocation API
import MapView, { Marker } from 'react-native-maps';



interface Product {
  _id: string;
  name: string;
  price: string;
  quantity: string;
  image: string;
  description: string;
  upi: string;
  Contact: string;
  Location:string;
}

const CHome = ({ navigation }: { navigation: any }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('low-to-high');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false); // New state to handle filter options visibility

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://${IP_ADDRESS}:3000/api/products`);
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Unexpected data format');
        }

        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'Failed to fetch products');
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = () => {
   
    
    setProducts(products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())));
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  
    // Clone the products array to avoid mutating state directly
    let sortedProducts = [...products];
  
    console.log('Products before sorting:', sortedProducts);
  
    // Function to extract numeric value from price
    const extractPrice = (price: string): number => {
      const match = price.match(/(\d+(\.\d+)?)/); // Matches numbers and decimal points
      return match ? parseFloat(match[0]) : 0;
    };
  
    // Sorting logic
    switch (newFilter) {
      case 'low-to-high':
        sortedProducts.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
        break;
      case 'high-to-low':
        sortedProducts.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
        break;
      case 'date':
        sortedProducts.sort((a, b) => b._id.localeCompare(a._id)); // Assuming _id is comparable in this way
        break;
      default:
        break;
    }
  
    console.log('Products after sorting:', sortedProducts);
  
    // Update state with sorted products
    setProducts(sortedProducts);
    setShowFilterOptions(false); // Hide filter options after selection
  };
  
  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleChat = () => {
    Alert.alert('Chat', `Starting chat with farmer for ${selectedProduct?.name}`);
  };
  


  const handleUpi = () => {
    if (selectedProduct?.upi) {
      const upiId = selectedProduct.upi; // Ensure this is a complete UPI ID like 'john.doe@okhdfcbank'
      const payeeName = "Farmer"; // Customize this to the actual payee name
      const amount = "0"; // Set to '0' to allow user input or specify a fixed amount
      const currency = "INR"; // Currency code
  
      // Construct UPI URL with the UPI ID
      const upiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=${currency}`;
  
      // Show alert to the user
      Alert.alert(
        'Confirm Payment',
        'Do you want to proceed with the payment using Google Pay?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              Linking.openURL(upiUrl)
                .then(() => console.log('Opened Google Pay'))
                .catch((err) => {
                  console.error('Failed to open Google Pay', err);
                  Alert.alert('Error', 'Unable to open Google Pay. Make sure you have it installed.');
                });
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert('Error', 'UPI ID is not available');
    }
  };
  
  
  const handleLogout = () => {
    Alert.alert('Logout', 'You have been logged out.');
    navigation.navigate('Login'); // Assuming you have a Login screen in your navigator
  };
  const handleLocationFetch = () => {

    Alert.alert('Opening Map');
    navigation.navigate('Map'); 
  };


  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productIcon} onPress={() => handleProductPress(item)}>
      <Image source={{ uri: item.image || 'default_image_url' }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>₹{item.price}</Text>
    </TouchableOpacity>
  );


  const handleContactPress = (contact : string) => {
    Alert.alert(
      "Contact Farmer",
      "Would you like to message or call?",
      [
        {
          text: "Message",
          onPress: () => Linking.openURL(`sms:${contact}`), // Opens the messaging app
        },
        {
          text: "Call",
          onPress: () => Linking.openURL(`tel:${contact}`), // Initiates a call
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ImageBackground source={{ uri: 'https://media.istockphoto.com/id/1166946350/photo/young-green-corn-growing-on-the-field-at-sunset-time.webp?b=1&s=612x612&w=0&k=20&c=LR3IQ8mlo3NlIflUARZWkaGkkn8GoK8OX3qO6FONGk8=' }} 
    style={styles.backgroundImage}
    blurRadius={2} // Added blur effect
>
      
      <View style={styles.container}>
        {/* Header with location icon, search bar, and filter icon */}
        <View style={styles.header}>
        <TouchableOpacity onPress={handleLocationFetch}>
             <Image source={require('./assets/map-icon.png')} style={styles.headerIcon} />
          </TouchableOpacity>


          <TextInput
            style={styles.searchInput}
            placeholder="Search for products"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />

          <TouchableOpacity onPress={() => setShowFilterOptions(!showFilterOptions)}>
            <Image source={require('./assets/filter-icon.png')} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>

        {/* Filter Options */}
        {showFilterOptions && (
          <View style={styles.filterContainer}>
            <Button title="Low to High" onPress={() => handleFilterChange('low-to-high')} />
            <Button title="High to Low" onPress={() => handleFilterChange('high-to-low')} />
            <Button title="Date Published" onPress={() => handleFilterChange('date')} />
          </View>
        )}

        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
        />

        {showDetails && selectedProduct && (
          <Modal
            visible={showDetails}
            onRequestClose={() => setShowDetails(false)}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Image source={{ uri: selectedProduct.image || 'default_image_url' }} style={styles.modalImage} />
                <Text style={styles.modalName}>{selectedProduct.name}</Text>
                <Text style={styles.modalPrice}>₹{selectedProduct.price}</Text>
                <Text style={styles.modalQuantity}>Qty Avil: {selectedProduct.quantity}</Text>
                <Text style={styles.modalQuantity}>Location : {selectedProduct.Location}</Text>
                <TouchableOpacity onPress={() => handleContactPress(selectedProduct.Contact)}>
      <Text style={styles.modalContact}>Contact No.: {selectedProduct.Contact}</Text>
    </TouchableOpacity>
                <Text style={styles.modalDescription}>Description: {selectedProduct.description}</Text>
  
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleUpi}>
                    <Image source={require('./assets/upi-icon.png')} style={styles.icon1} />
                  </TouchableOpacity>

             {/*}    <TouchableOpacity onPress={handleChat}>
                   <Image source={require('./assets/chat-icon.png')} style={styles.icon2} />
                </TouchableOpacity> */}

                  <TouchableOpacity onPress={() => setShowDetails(false)}>
                    <Image source={require('./assets/close-icon.png')} style={styles.icon3} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* Add Logout Button */}
        <View style={styles.logoutContainer}>
          <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  container: { 
    flex: 1, 
    padding: 20, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  headerIcon: {
    width: 39,
    height: 39,
    borderRadius: 8, 
    resizeMode: 'contain'
  },
  searchInput: { 
    flex: 1,
    borderWidth: 2, 
    borderColor: '#fff', 
    padding: 10, 
    borderRadius: 8, 
    marginHorizontal: 10, 
    fontSize: 16,
    width: 45,
    height: 45,
  },
  filterContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  productIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  productName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    marginTop: 2,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContent: { 
    width: '85%', 
    backgroundColor: '#fff', 
    padding: 25, 
    borderRadius: 15, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 6, 
    elevation: 5 
  },
  modalImage: { 
    width: 220, 
    height: 220, 
    borderRadius: 12 
  },
  modalName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginTop: 15 
  },
  modalPrice: { 
    fontSize: 18, 
    color: '#4CAF50', 
    marginTop: 5 
  },
  modalDescription: { 
    fontSize: 16, 
    color: '#666', 
    marginTop: 8, 
    textAlign: 'center' 
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },
  icon1: { 
    width: 40, 
    height: 40, 
    resizeMode: 'contain', 
    margin: 10, 
    paddingTop: 80,
  },
  icon2: { 
    width: 40, 
    height: 40, 
    resizeMode: 'contain', 
    margin: 20 
  },
  icon3: { 
    width: 80, 
    height: 80, 
    resizeMode: 'contain', 
    margin: 10, 
  },
  modalQuantity: { 
    marginTop: 5, 
    fontSize: 12, 
    color: '#888', 
    textAlign: 'center' 
  },
  modalContact: { 
    marginTop: 5, 
    fontSize: 15, 
    color: '#888', 
    textAlign: 'center' 
  },
  logoutContainer: { 
    position: 'absolute', 
    bottom: 10, 
    left: 0, 
    right: 0, 
    paddingHorizontal: 20 
  }
});

export default CHome;
