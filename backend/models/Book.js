/*import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  author: { 
    type: String, 
    required: true,
    trim: true 
  },
  isbn: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  publicationYear: { 
    type: Number,
    required: true,
    min: [1800, 'Publication year must be after 1800'],
    max: [new Date().getFullYear(), 'Publication year cannot be in the future']
  },
  genre: { 
    type: String,
    default: 'Uncategorized',
    trim: true 
  },
  rentalStatus: { 
    type: String, 
    enum: ['Available', 'Rented'], 
    default: 'Available' 
  }
  
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

export default Book;*/

import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  author: { 
    type: String, 
    required: true,
    trim: true 
  },
  isbn: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  publicationYear: { 
    type: Number,
    required: true,
    min: [1800, 'Publication year must be after 1800'],
    max: [new Date().getFullYear(), 'Publication year cannot be in the future']
  },
  genre: { 
    type: String,
    default: 'Uncategorized',
    trim: true 
  },
  rentalStatus: { 
    type: String, 
    enum: ['Available', 'Rented'], 
    default: 'Available' 
  },
  coverImage: { 
    type: String,
    required: true
  }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

export default Book;