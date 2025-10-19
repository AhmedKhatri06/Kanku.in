import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use the EXACT same products as your frontend sampleProducts
const products = [
  {
    name: 'Elegant Evening Dress',
    description: 'Beautiful floor-length evening gown perfect for special occasions',
    price: 3499,
    image: 'pr1',
    category: 'Dresses',
    stock: 8,
    rating: 4.5
  },
  {
    name: 'Summer Floral Dress',
    description: 'Light and comfortable floral print dress for summer',
    price: 1999,
    image: 'pr2',
    category: 'Dresses',
    stock: 15,
    rating: 4.2
  },
  {
    name: 'Casual Day Dress',
    description: 'Perfect for everyday wear with comfortable fabric',
    price: 1599,
    image: 'pr3',
    category: 'Dresses',
    stock: 12,
    rating: 4.3
  },
  {
    name: 'Party Wear Gown',
    description: 'Stylish party gown with elegant design',
    price: 4299,
    image: 'pr4',
    category: 'Dresses',
    stock: 5,
    rating: 4.7
  },
  {
    name: 'Designer Kurti',
    description: 'Traditional kurti with modern design',
    price: 1299,
    image: 'pr10',
    category: 'Kurtas',
    stock: 20,
    rating: 4.4
  },
  {
    name: 'Embroidered Kurta',
    description: 'Hand-embroidered kurta with intricate patterns',
    price: 1899,
    image: 'pr11',
    category: 'Kurtas',
    stock: 10,
    rating: 4.6
  },
  {
    name: 'Diamond Necklace',
    description: 'Beautiful diamond necklace for special occasions',
    price: 5999,
    image: 'pr7',
    category: 'Jewelry',
    stock: 7,
    rating: 4.8
  },
  {
    name: 'Gold Earrings',
    description: 'Elegant gold earrings with precious stones',
    price: 2999,
    image: 'pr8',
    category: 'Jewelry',
    stock: 12,
    rating: 4.5
  },
  {
    name: 'Sports Shoes',
    description: 'Comfortable running shoes for daily wear',
    price: 2499,
    image: 'pr9',
    category: 'Footwear',
    stock: 25,
    rating: 4.1
  },
  {
    name: 'Designer Saree',
    description: 'Traditional silk saree with modern touch',
    price: 4599,
    image: 'pr5',
    category: 'Traditional',
    stock: 6,
    rating: 4.7
  },
  {
    name: 'Lehenga Choli',
    description: 'Traditional lehenga for festivals and weddings',
    price: 6999,
    image: 'pr6',
    category: 'Traditional',
    stock: 4,
    rating: 4.9
  }
];

const addProductsToDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Use the EXACT same schema as your server.js
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
        required: [true, 'Product category is required']
      },
      stock: {
        type: Number,
        default: 10,
        min: [0, 'Stock cannot be negative']
      },
      rating: {
        type: Number,
        default: 4.0
      }
    }, {
      timestamps: true
    });

    const Product = mongoose.model('Product', productSchema);

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert new products
    const result = await Product.insertMany(products);
    console.log(`✅ Successfully added ${result.length} products to database`);

    // Display added products
    console.log('\n📦 Added Products:');
    result.forEach(product => {
      console.log(`   - ${product.name} (₹${product.price}) - ${product.category} - Image: ${product.image}`);
    });

    console.log('\n🎉 Products added successfully!');
    console.log('🔗 Check your database at: http://localhost:5002/products');

  } catch (error) {
    console.error('❌ Error adding products:', error);
    console.error('Error details:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔗 Database connection closed');
    process.exit(0);
  }
};

addProductsToDB();