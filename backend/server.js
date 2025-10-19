import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

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

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
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

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();
    console.log('✅ User registered successfully:', email);

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email 
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
        email: user.email
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
        email: user.email 
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
        email: user.email
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

// Add new product (protected route - for admin)
// Add products to database (one-time setup)
app.post('/add-products', async (req, res) => {
  try {
    console.log('🔄 Adding products to database...');
    
    const products = [
      {
        name: 'Elegant Evening Dress',
        description: 'Beautiful floor-length evening gown perfect for special occasions',
        price: 3499,
        category: 'Dresses',
        image: 'pr1',
        stock: 8,
        rating: 4.5
      },
      {
        name: 'Summer Floral Dress',
        description: 'Light and comfortable floral print dress for summer',
        price: 1999,
        category: 'Dresses',
        image: 'pr2',
        stock: 15,
        rating: 4.2
      },
      {
        name: 'Casual Day Dress',
        description: 'Perfect for everyday wear with comfortable fabric',
        price: 1599,
        category: 'Dresses',
        image: 'pr3',
        stock: 12,
        rating: 4.3
      },
      {
        name: 'Party Wear Gown',
        description: 'Stylish party gown with elegant design',
        price: 4299,
        category: 'Dresses',
        image: 'pr4',
        stock: 5,
        rating: 4.7
      },
      {
        name: 'Designer Kurti',
        description: 'Traditional kurti with modern design',
        price: 1299,
        category: 'Kurtas',
        image: 'pr10',
        stock: 20,
        rating: 4.4
      },
      {
        name: 'Embroidered Kurta',
        description: 'Hand-embroidered kurta with intricate patterns',
        price: 1899,
        category: 'Kurtas',
        image: 'pr11',
        stock: 10,
        rating: 4.6
      },
      {
        name: 'Diamond Necklace',
        description: 'Beautiful diamond necklace for special occasions',
        price: 5999,
        category: 'Jewelry',
        image: 'pr7',
        stock: 7,
        rating: 4.8
      },
      {
        name: 'Gold Earrings',
        description: 'Elegant gold earrings with precious stones',
        price: 2999,
        category: 'Jewelry',
        image: 'pr8',
        stock: 12,
        rating: 4.5
      },
      {
        name: 'Sports Shoes',
        description: 'Comfortable running shoes for daily wear',
        price: 2499,
        category: 'Footwear',
        image: 'pr9',
        stock: 25,
        rating: 4.1
      },
      {
        name: 'Designer Saree',
        description: 'Traditional silk saree with modern touch',
        price: 4599,
        category: 'Traditional',
        image: 'pr5',
        stock: 6,
        rating: 4.7
      },
      {
        name: 'Lehenga Choli',
        description: 'Traditional lehenga for festivals and weddings',
        price: 6999,
        category: 'Traditional',
        image: 'pr6',
        stock: 4,
        rating: 4.9
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

// Add multiple products at once (for initial setup)
/*app.post('/products/bulk', authenticateToken, async (req, res) => {
  try {
    const products = req.body.products;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required'
      });
    }

    const insertedProducts = await Product.insertMany(products);
    
    res.status(201).json({
      success: true,
      message: `${insertedProducts.length} products added successfully`,
      products: insertedProducts
    });

  } catch (error) {
    console.error('Error adding bulk products:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding products'
    });
  }
});
*/

// ========== USER MANAGEMENT ROUTES ==========

// Get all users (for admin purposes)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
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

// ========== PROTECTED ROUTES ==========

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
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
});


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

// Admin Routes
app.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (you'll need to add admin field to user schema)
    const user = await User.findById(req.user.userId);
    if (!user.isAdmin) {
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
    
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders
      }
    });
    
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats'
    });
  }
});

// Product management routes for admin
app.put('/admin/products/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
    
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
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

// Add after your existing routes in server.js

// Admin Stats Route
app.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    // In real app, check if user is admin
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats'
    });
  }
});

// Admin Orders Route
app.get('/admin/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// Update Order Status
app.put('/admin/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order'
    });
  }
});

// Add Product (Admin)
app.post('/admin/products', authenticateToken, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    res.json({
      success: true,
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product'
    });
  }
});
