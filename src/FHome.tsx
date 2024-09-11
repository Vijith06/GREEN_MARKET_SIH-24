import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Modal, Alert, FlatList, StyleSheet, Dimensions , ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Adjust path as needed
const IP_ADDRESS = require('../IPAddress.js');




const { width } = Dimensions.get('window');

// Define the type for a Product
interface Product {
  _id: string;
  name: string;
  quantity: string;
  price: string;
  image: string;
  description: string;
  email: string;
  upi: string;
  Contact: string;
  Location:string;
}

const FHome: React.FC<{ navigation: any }> = ({ navigation }) => {

  const { email } = useAuth();
  const [isAddProductModalVisible, setAddProductModalVisible] = useState(false);
  const [isUpdateProductModalVisible, setUpdateProductModalVisible] = useState(false);
  const [isProductActionModalVisible, setProductActionModalVisible] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, '_id'>>({
    name: '',
    quantity: '',
    price: '',
    image: '',
    description: '',
    email: email || '',
    upi: '',
    Contact:'',
    Location:'',
  });
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://${IP_ADDRESS}:3000/api/products`);
        // Filter products for the logged-in farmer
        const filteredProducts = response.data.filter((product: Product) => product.email === email);
        setProducts(filteredProducts);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch products');
      }
    };

    fetchProducts();
  }, [email]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout Cancelled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // Perform logout actions here
            Alert.alert('Logout', 'You have been logged out.');
            navigation.navigate('Login'); // Navigate to the Login screen
          },
        },
      ],
      { cancelable: false } // Prevents dismissing by tapping outside
    );
  };
  
  const handleLC = () => {
    Alert.alert(
      'Login',
      'You are logging in as Customer',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Login cancelled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => navigation.navigate('CHome'), // Navigate to the desired screen
        },
      ],
      { cancelable: true }
    );
  };
  const handleBot = () => {
    navigation.navigate('ChatBot'); // Assuming you have a Login screen in your navigator
   
  };



  const handleAddProduct = async () => {
    // Destructure newProduct for easier access
    const { name, quantity, price, image, description, email, upi,Contact } = newProduct;
  
    // Check if all fields are filled
    if (!name || !quantity || !price || !image || !description || !email || !upi || !Contact) {
      Alert.alert('Incomplete Information', 'Please fill in all fields.');
      return;
    }
  
   
  
    try {
      const response = await axios.post(`http://${IP_ADDRESS}:3000/api/products`, newProduct);
      if (response.status === 201) {
        setProducts([...products, response.data]);
        setAddProductModalVisible(false);
        setNewProduct({
          name: '',
          quantity: '',
          price: '',
          image: '',
          description: '',
          email: email || '',
          upi: '',
          Contact:'',
          Location:'',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    }
  };
  
  const handleUpdateProduct = async () => {
    if (productToUpdate && productToUpdate._id) {
      try {
        const response = await axios.put(`http://${IP_ADDRESS}:3000/api/products/${productToUpdate._id}`, productToUpdate);
        if (response.status === 200) {
          const updatedProducts = products.map((product) =>
            product._id === productToUpdate._id ? response.data : product
          );
          setProducts(updatedProducts);
          setUpdateProductModalVisible(false);
          setProductToUpdate(null);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update product');
      }
    }
  };

  const handleDeleteProduct = (index: number) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete Cancelled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const productToDelete = products[index];
              await axios.delete(`http://${IP_ADDRESS}:3000/api/products/${productToDelete._id}`);
              setProducts(products.filter((_, i) => i !== index));
              closeProductActionModal();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ],
      { cancelable: false } // Prevents dismissing by tapping outside
    );
  };
  

  const handleProductAction = (index: number) => {
    setProductActionModalVisible(index);
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response && response.assets) {
        const { assets } = response;
        if (assets.length > 0) {
          setNewProduct({ ...newProduct, image: assets[0].uri || '' });
        }
      }
    });
  };
  
  const selectImageForUpdate = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response && response.assets) {
        const { assets } = response;
        if (assets.length > 0) {
          setProductToUpdate(prev => prev ? { ...prev, image: assets[0].uri || '' } : null);
        }
      }
    });
  };
  
  const closeProductActionModal = () => setProductActionModalVisible(null);

  const openUpdateProductModal = (index: number) => {
    setProductToUpdate(products[index]);
    setUpdateProductModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
  <TextInput
    placeholder="Search by product name"
    style={styles.searchInput}
    value={searchQuery}
    onChangeText={setSearchQuery}
  />
</View>

      

      {/* Product List */}
      <FlatList
  data={filteredProducts}
  keyExtractor={(item) => item._id}
  renderItem={({ item, index }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.priceQuantityContainer}>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          <Text style={styles.productQuantity}>Qty Avail: {item.quantity}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleProductAction(index)} style={styles.actionIcon}>
        <Text style={styles.actionText}>...</Text>
      </TouchableOpacity>
    </View>
  )}
/>

      {/* Add Product Modal */}
      <Modal visible={isAddProductModalVisible} transparent={true} animationType="slide">
      <ScrollView contentContainerStyle={styles.Mcontainer}>

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Product</Text>
            <TextInput
              placeholder="Product Name"
              style={styles.input}
              value={newProduct.name}
              onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
            />
            <TextInput
              placeholder="Quantity"
              style={styles.input}
              value={newProduct.quantity.toString()}
              onChangeText={(text) => setNewProduct({ ...newProduct, quantity: text })}
            />
            <TextInput
              placeholder="Price"
              style={styles.input}
              value={newProduct.price.toString()}
              onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
            />
            <TouchableOpacity onPress={selectImage} style={styles.imagePicker}>
              <Text style={styles.imagePickerText}>Pick Image</Text>
            </TouchableOpacity>
            {newProduct.image ? (
              <Image source={{ uri: newProduct.image }} style={styles.selectedImage} />
            ) : null}
          <TextInput
             placeholder="Description"
             style={[styles.input, { height: 120, textAlignVertical: 'top' }]} // Adjust the height as needed
             value={newProduct.description}
              onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
             multiline={true} // Enables multiline input
              numberOfLines={4} // Sets the number of visible text lines
              />

            <TextInput
              placeholder="UPI Number"
              style={styles.input}
              value={newProduct.upi}
              onChangeText={(text) => setNewProduct({ ...newProduct, upi: text })}
            />
              <TextInput
              placeholder="Location"
              style={styles.input}
              value={newProduct.Location}
              onChangeText={(text) => setNewProduct({ ...newProduct, Location: text })}
            />
             <TextInput
              placeholder="Contact Number"
              style={styles.input}
              value={newProduct.Contact}
              onChangeText={(text) => setNewProduct({ ...newProduct, Contact: text })}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddProduct}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setAddProductModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>

      </Modal>

      {/* Update Product Modal */}
      <Modal visible={isUpdateProductModalVisible} transparent={true} animationType="slide">
      <ScrollView contentContainerStyle={styles.Mcontainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Product</Text>
            <TextInput
              placeholder="Product Name"
              style={styles.input}
              value={productToUpdate?.name || ''}
              onChangeText={(text) => setProductToUpdate((prev) => prev ? { ...prev, name: text } : prev)}
            />
            <TextInput
              placeholder="Quantity"
              style={styles.input}
              value={productToUpdate?.quantity?.toString() || '0'}
              onChangeText={(text) => setProductToUpdate((prev) => prev ? { ...prev, quantity: text } : prev)}
            />
            <TextInput
              placeholder="Price"
              style={styles.input}
              value={productToUpdate?.price?.toString() || '0'}
              onChangeText={(text) => setProductToUpdate((prev) => prev ? { ...prev, price: text } : prev)}
            />
            <TouchableOpacity onPress={selectImageForUpdate} style={styles.imagePicker}>
              <Text style={styles.imagePickerText}>Pick Image</Text>
            </TouchableOpacity>
            {productToUpdate?.image ? (
              <Image source={{ uri: productToUpdate.image }} style={styles.selectedImage} />
            ) : null}
            <TextInput
               placeholder="Description"
               style={[styles.input, { height: 120, textAlignVertical: 'top' }]} // Adjust the height as needed
               value={productToUpdate?.description || ''}
               onChangeText={(text) =>
                setProductToUpdate((prev) => (prev ? { ...prev, description: text } : prev))
                }
                multiline={true} // Enables multiline input
                numberOfLines={4} // Sets the number of visible text lines
               />

            <TextInput
              placeholder="UPI Number"
              style={styles.input}
              value={productToUpdate?.upi || ''}
              onChangeText={(text) => setProductToUpdate((prev) => prev ? { ...prev, upi: text } : prev)}
            />
                <TextInput
              placeholder="Location"
              style={styles.input}
              value={productToUpdate?.Location || ''}
              onChangeText={(text) => setProductToUpdate((prev) => prev ? { ...prev, Location: text } : prev)}
            />
              <TextInput
              placeholder="Contact Number"
              style={styles.input}
              value={productToUpdate?.Contact || ''}
              onChangeText={(text) => setProductToUpdate((prev) => prev ? { ...prev, Contact: text } : prev)}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleUpdateProduct}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setUpdateProductModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* Product Action Modal */}
      <Modal visible={isProductActionModalVisible !== null} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.actionButton} onPress={() => {
              if (isProductActionModalVisible !== null) {
                openUpdateProductModal(isProductActionModalVisible);
                closeProductActionModal();
              }
            }}>
              <Text style={styles.actionButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => {
              if (isProductActionModalVisible !== null) {
                handleDeleteProduct(isProductActionModalVisible);
                closeProductActionModal();
              }
            }}>
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={closeProductActionModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
       {/* Add Logout Button */}
       <View style={styles.footer}>
      <TouchableOpacity onPress={handleLC} style={styles.iconButton}>
        <Image
          source={{ uri: 'https://png.pngtree.com/png-clipart/20231116/original/pngtree-buy-icon-shopping-photo-png-image_13598097.png' }}
          style={styles.iconImage1}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBot} style={styles.iconButton}>
        <Image
          source={{ uri: 'https://png.pngtree.com/png-vector/20220611/ourmid/pngtree-chatbot-icon-chat-bot-robot-png-image_4841963.png' }}
          style={styles.iconImage2}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setAddProductModalVisible(true)} style={styles.iconButton}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5665/5665446.png' }}
          style={styles.iconImage3}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgSMuu3YoUZtxNMiw6ExCRkF0p8u56lQTd1zKZdTq4Y02YA7OmYyBcgwaYCugUqwm6B_8&usqp=CAU' }}
          style={styles.iconImage4}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f8e9', // Light green background color
  },
  Mcontainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
  },
  
  footer: {
    position: 'absolute',
    flexDirection: 'row', // Aligns icons horizontally
    justifyContent: 'space-around', // Spreads icons evenly across the screen
    alignItems: 'center', // Centers icons vertically
    bottom: 0, // Distance from the bottom of the screen
    left: 0,
    right: 0,
    height: 65,
    paddingHorizontal: 20,
    backgroundColor: '#d4edda',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#c8e6c9',
  },
  searchContainer: {
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  searchInput: {
    height: 43,
    borderColor: '#c8e6c9', // Light green border color
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#d4edda',
    color: 'black',
  },
  

  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage1: {
    width: 40, // Adjust the width of the image
    height: 40, // Adjust the height of the image
  },
  iconImage2: {
    width: 42, // Adjust the width of the image
    height: 42, // Adjust the height of the image
  },
  iconImage3: {
    width: 28, // Adjust the width of the image
    height: 28, // Adjust the height of the image
  },
  iconImage4: {
    width: 26, // Adjust the width of the image
    height: 28, // Adjust the height of the image
  },



  logoutContainer: {
    marginTop: 20,
    alignSelf: 'flex-end', // Align to the right end
    marginRight: 15,       // Optional: Adjust right margin as needed
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes the icon circular (if the icon is square)
    backgroundColor: '#f0f0f0', // Light gray background for better visibility
    borderWidth: 2, // Adds a border
    borderColor: '#ddd', // Border color
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 3, // Adds elevation for Android shadow
    alignItems: 'center', // Centers content horizontally
    justifyContent: 'center', // Centers content vertically
  },
  
  addButton: {
    backgroundColor: '#66bb6a', // Lighter green background color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 4, // Add shadow for depth
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#ffffff', // White background color
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#66bb6a', // Green border color
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32', // Darker green
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 15,

    alignItems: 'center',
  },
  productPrice: {
    fontSize: 15,
    color: '#388e3c', // Darker green for price
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 16,
    color: '#0288d1', // Blue color for quantity
    fontWeight: '600',
  },
  actionIcon: {
    marginLeft: 12,
  },
  actionText: {
    fontSize: 28,
    color: '#66bb6a', // Green color
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#66bb6a', // Green color
  },
  input: {
    height: 45,
    borderColor: '#c8e6c9', // Light green border color
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#d4edda',
    color: 'black',
  },
  imagePicker: {
    marginVertical: 12,
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 18,
    color: 'green',
  },
  selectedImage: {
    width: 140,
    height: 140,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#66bb6a', // Green border color
  },
  submitButton: {
    backgroundColor: '#2e7d32', // Darker green
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 12,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#d32f2f', // Red color
    paddingVertical: 14,
    borderRadius: 10,
  },
  
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#66bb6a',
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 6,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default FHome;
