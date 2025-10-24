import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers['authorization'] ? 'Authorization present' : 'No auth'
  });
  next();
});
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔄 Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
  console.log('📊 Database: authapp');
})
.catch((error) => {
  console.error('❌ FAILED: MongoDB connection error:');
  console.error('Error details:', error.message);
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  isAdmin:
  {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'user'
  }
}, {
  timestamps: true
});
const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['saree', 'kurta', 'accessory', 'jewelry', 'footwear']
  },
  stock: {
    type: Number,
    default: 10,
    min: [0, 'Stock cannot be negative']
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'upi', 'netbanking'],
    default: 'cod'
  },
  transactionId: String
}, {
  timestamps: true
});
const Order = mongoose.model('Order', orderSchema);

// Review Schema
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
const Review = mongoose.model('Review', reviewSchema);

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('🔐 Auth Header:', authHeader);
  console.log('🔐 Token received:', token ? 'PRESENT' : 'MISSING');

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ 
      success: false,
      message: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(403).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
    console.log('✅ Token verified, user:', user);
    req.user = user;
    next();
  });
}

// ========== ROUTES ==========

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is running!',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// User routes
app.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt for:', req.body.email);
    
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ NEW: Check if this is the first user (make them admin)
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: isFirstUser,
      role: isFirstUser ? 'admin' : 'user'
    });

    await user.save();
    console.log('✅ User registered successfully:', email);
    console.log('👑 Admin status:', isFirstUser ? 'Yes (First User)' : 'No');

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt for:', req.body.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful:', email);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
});

// ========== ADMIN ROUTES ==========

// Admin Users Route
// Admin Users Route - ADD DEBUGGING
app.get('/admin/users', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 ADMIN USERS REQUEST DEBUG:');
    console.log('📨 Headers:', req.headers);
    console.log('👤 User ID from token:', req.user.userId);
    console.log('📧 User email from token:', req.user.email);
    console.log('👑 Is admin from token:', req.user.isAdmin);
    
    // Check if user exists in database
    const adminUser = await User.findById(req.user.userId);
    console.log('🔍 Admin user from DB:', adminUser ? {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      isAdmin: adminUser.isAdmin,
      role: adminUser.role
    } : 'USER NOT FOUND');
    
    if (!adminUser) {
      console.log('❌ User not found in database');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!adminUser.isAdmin) {
      console.log('❌ User is not admin');
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    console.log('✅ User is admin, fetching users...');
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    console.log(`📊 Found ${users.length} users`);
    
    res.json({
      success: true,
      users: users
    });
    
  } catch (error) {
    console.error('❌ Admin users error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching users: ' + error.message
    });
  }
});
// Admin Update User Route
app.put('/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isAdmin: role === 'admin' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('❌ Admin update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
});

// Admin Products Route
app.get('/admin/products', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const products = await Product.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('❌ Admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// ADD THIS ROUTE RIGHT AFTER YOUR EXISTING GET /admin/products ROUTE

app.post('/admin/products', authenticateToken, async (req, res) => {
  try {
    console.log('🔄 Admin creating new product...');
    
    // Check if user is admin
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!adminUser.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { name, description, price, category, stock, image } = req.body;
    console.log('📦 Received product data:', req.body);

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and category are required'
      });
    }

    // Handle category validation
    const validCategories = ['saree', 'kurta', 'accessory', 'jewelry', 'footwear'];
    const formattedCategory = category.toLowerCase().trim();
    
    if (!validCategories.includes(formattedCategory)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category: formattedCategory,
      stock: parseInt(stock) || 10,
      image: image || 'default-image-url'
    });

    await newProduct.save();
    
    console.log('✅ Product created successfully:', name);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('❌ Admin create product error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating product: ' + error.message
    });
  }
});
app.get('/test-post-route', (req, res) => {
  res.json({
    message: 'POST /admin/products route should be available',
    test: 'Try making a POST request to /admin/products'
  });
});
// Admin Delete Product Route
app.delete('/admin/products/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('❌ Admin delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
});

// Admin Orders Route
app.get('/admin/orders', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('❌ Admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// Admin Update Order Route
app.put('/admin/orders/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('❌ Admin update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order'
    });
  }
});

// Admin Dashboard Analytics Route
app.get('/admin/dashboard', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const orderStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // Popular products
    const popularProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { 
        _id: '$items.product', 
        totalSold: { $sum: '$items.quantity' } 
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }},
      { $unwind: '$product' }
    ]);

    res.json({
      success: true,
      dashboard: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        orderStatus,
        popularProducts
      }
    });
  } catch (error) {
    console.error('❌ Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// ========== EXISTING ROUTES (Keep all your existing routes below) ==========

// Update user profile (protected route)
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('📝 Profile update attempt for user:', req.user.userId);
    
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Update object to track changes
    const updateData = {};
    let hasChanges = false;

    // Update name if provided
    if (name && name !== user.name) {
      updateData.name = name;
      hasChanges = true;
      console.log('🔄 Name update requested');
    }

    // Update email if provided and different
    if (email && email !== user.email) {
      // Check if new email already exists
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: userId } // Exclude current user
      });
      
      if (existingUser) {
        return res.status(409).json({ 
          success: false,
          message: 'Email already exists' 
        });
      }
      
      updateData.email = email.toLowerCase();
      hasChanges = true;
      console.log('🔄 Email update requested');
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: 'Current password is incorrect' 
        });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters'
        });
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 12);
      hasChanges = true;
      console.log('🔄 Password update requested');
    }

    // If no changes requested
    if (!hasChanges) {
      return res.status(400).json({
        success: false,
        message: 'No changes provided for update'
      });
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    console.log('✅ Profile updated successfully for user:', updatedUser.email);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during profile update' 
    });
  }
});

// Product routes

// Get all products (public route - no authentication needed)
app.get('/products', async (req, res) => {
  try {
    console.log('📦 Fetching products from database...');
    const products = await Product.find();
    console.log(`✅ Found ${products.length} products`);
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products from database'
    });
  }
});

// Get products by category
app.get('/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// Get all users (for admin purposes)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: false,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Protected route - Get user profile
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user profile' 
    });
  }
});

app.post('/add-products', async (req, res) => {
  try {
    console.log('🔄 Adding products to database...');
    
    const products = [
  {
    name: 'Elegant Evening Saree',
    description: 'Beautiful floor-length evening saree perfect for special occasions',
    price: 3499,
    category: 'saree',
    image: 'pr1',
    stock: 8
  },
  {
    name: 'Summer Floral Saree',
    description: 'Light and comfortable floral print saree for summer',
    price: 1999,
    category: 'saree',
    image: 'pr2',
    stock: 15
  },
  {
    name: 'Casual Cotton Saree',
    description: 'Perfect for everyday wear with comfortable fabric',
    price: 1599,
    category: 'saree',
    image: 'pr3',
    stock: 12
  },
  {
    name: 'Party Wear Saree',
    description: 'Stylish party saree with elegant design',
    price: 4299,
    category: 'saree',
    image: 'pr4',
    stock: 5
  },
  {
    name: 'Designer Kurti',
    description: 'Traditional kurti with modern design',
    price: 1299,
    category: 'kurta',
    image: 'pr10',
    stock: 20
  },
  {
    name: 'Embroidered Kurta',
    description: 'Hand-embroidered kurta with intricate patterns',
    price: 1899,
    category: 'kurta',
    image: 'pr11',
    stock: 10
  },
  {
    name: 'Diamond Necklace',
    description: 'Beautiful diamond necklace for special occasions',
    price: 5999,
    category: 'jewelry',
    image: 'pr7',
    stock: 7
  },
  {
    name: 'Gold Earrings',
    description: 'Elegant gold earrings with precious stones',
    price: 2999,
    category: 'jewelry',
    image: 'pr8',
    stock: 12
  },
  {
    name: 'Silver Anklet',
    description: 'Traditional silver anklet with intricate designs',
    price: 2499,
    category: 'jewelry',
    image: 'pr9',
    stock: 25
  },
  {
    name: 'Designer Silk Saree',
    description: 'Traditional silk saree with modern touch',
    price: 4599,
    category: 'saree',
    image: 'pr5',
    stock: 6
  },
  {
    name: 'Traditional Lehenga',
    description: 'Traditional lehenga for festivals and weddings',
    price: 6999,
    category: 'saree',
    image: 'pr6',
    stock: 4
  }
];

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Add new products
    const result = await Product.insertMany(products);
    console.log(`✅ Added ${result.length} products to database`);

    res.json({
      success: true,
      message: `${result.length} products added successfully`,
      products: result
    });

  } catch (error) {
    console.error('❌ Error adding products:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding products to database'
    });
  }
});

// Order Routes
app.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
      
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod
    });
    
    await order.save();
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
    
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
});

app.get('/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// Wishlist Routes
app.post('/wishlist', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    let wishlist = await Wishlist.findOne({ user: req.user.userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.userId,
        products: [productId]
      });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Product already in wishlist'
        });
      }
      wishlist.products.push(productId);
    }
    
    await wishlist.save();
    
    res.json({
      success: true,
      message: 'Product added to wishlist'
    });
    
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist'
    });
  }
});

// Add review and update product rating
app.post('/reviews', authenticateToken, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.userId,
      product: productId
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }
    
    const review = new Review({
      user: req.user.userId,
      product: productId,
      rating,
      comment
    });
    
    await review.save();
    
    // Update product average rating
    const reviews = await Review.find({ product: productId });
    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: averageRating,
      reviewCount: reviews.length
    });
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
    
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review'
    });
  }
});

// Advanced product search
app.get('/products/search', async (req, res) => {
  try {
    const { 
      query, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy, 
      page = 1, 
      limit = 12 
    } = req.query;
    
    const filter = {};
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    const sortOptions = {};
    if (sortBy === 'price_asc') sortOptions.price = 1;
    else if (sortBy === 'price_desc') sortOptions.price = -1;
    else if (sortBy === 'rating') sortOptions.rating = -1;
    else sortOptions.createdAt = -1;
    
    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(filter);
    
    res.json({
      success: true,
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products'
    });
  }
});

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 MongoDB Atlas: Connected`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🛍️ Products endpoint: http://localhost:${PORT}/products`);
  console.log(`👥 Users endpoint: http://localhost:${PORT}/users`);
  console.log(`🔐 Auth endpoints: /register , /login`);
  console.log(`👑 Admin endpoints: /admin/users, /admin/products, /admin/orders, /admin/dashboard`);
});