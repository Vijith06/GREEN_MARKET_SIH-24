const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = mongoose.Types;
const multer = require('multer');
const path = require('path');



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Replace with your MongoDB connection string

mongoose.connect('mongodb://localhost:27017/greenmarket')
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

//User schme for fsignup

const fuserSchema = new mongoose.Schema({
  name: String,
  dob: String,
  email: String,
  phoneNumber: String,
  password: String,
  location: String,
  image: String, 
  // Field to store image filename
});

const FUser = mongoose.model('FUser', fuserSchema);


// Customer User Schema and Model
const customerUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const CustomerUser = mongoose.model('CustomerUser', customerUserSchema);

// Product Schema and Model
// Define Product schema and model
const productSchema = new mongoose.Schema({
  name: String,
  quantity: String,
  price: String,
  image: String,
  description: String,
  email: String,
  upi: String,
  Contact: String,
  Location: String,
});

const Product = mongoose.model('Product', productSchema);
// Endpoint to add a user
app.post('/add-user', async (req, res) => {
  const { name, dob, password, email, phoneNumber, location } = req.body;
  try {
    const user = new User({ name, dob, password, email, phoneNumber, location });
    await user.save();
    res.status(201).send('User added');
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Failed to add user');
  }
});

// Endpoint to fetch a user
app.get('/get-user', async (req, res) => {
  try {
    const user = await User.findOne();
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Failed to fetch user');
  }
});

// Customer User login
app.post('/CLDET', async (req, res) => {
  const { email, password } = req.body;
  try {
    const customerUser = new CustomerUser({ email, password });
    await customerUser.save();
    res.status(201).send('Customer User Received');
  } catch (error) {
    console.error('Error receiving customer user:', error);
    res.status(500).send('Failed to receive customer user');
  }
});

// Endpoint for customer login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error processing request');
  }
});





// Get Products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add Product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});


// Update Product



app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update product fields
    product.name = req.body.name || product.name;
    product.quantity = req.body.quantity || product.quantity;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;
    product.description = req.body.description || product.description;
    product.email = req.body.email || product.email;
    product.upi = req.body.upi || product.upi;
    product.Contact = req.body.Contact || product.Contact;
    product.Location = req.body.Location || product.Location;


    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Delete product endpoint
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await Product.findByIdAndDelete(productId);

    if (!result) {
      return res.status(404).send('Product not found');
    }

    res.status(200).send('Product deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
//----

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});

const upload = multer({ storage: storage });

// Handle user signup
app.post('/add-fuser', upload.single('image'), async (req, res) => {
  const { name, dob, email, phoneNumber, password, location } = req.body;
  const image = req.file ? req.file.filename : null; // Get uploaded image filename

  try {
    const fnewUser = new FUser({
      name,
      dob,
      email,
      phoneNumber,
      password,
      location,
      image,
    });

    await fnewUser.save();
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Error saving user to the database' });
  }
});

// Endpoint for farmer login
app.post('/flogin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const fuser = await FUser.findOne({ email, password });
    if (fuser) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error processing request');
  }
});

//----

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



