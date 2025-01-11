/*import Book from '../models/Book.js';

export const getBooks = async (req, res) => {
  try {
    // Fetch all books from the database
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, publicationYear, genre, rentalStatus } = req.body;

    // Validate required fields
    if (!title || !author || !isbn) {
      return res.status(400).json({ message: 'Title, author, and ISBN are required' });
    }

    // Check if book with the same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'A book with this ISBN already exists' });
    }

    // Create a new book document
    const newBook = new Book({
      title,
      author,
      isbn,
      publicationYear,
      genre,
      rentalStatus,
    });

    // Save to database
    await newBook.save();

    // Respond with the created book
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Error adding book', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { isbn } = req.params;

    // Find and delete the book
    const deletedBook = await Book.findOneAndDelete({ isbn });

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};
*/

import Book from '../models/Book.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

/*export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, publicationYear, genre, rentalStatus } = req.body;

    // Validate required fields
    if (!title || !author || !isbn || !req.file) {
      return res.status(400).json({ message: 'Title, author, ISBN, and cover image are required' });
    }

    // Check if book with the same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'A book with this ISBN already exists' });
    }

    // Create a new book document
    const newBook = new Book({
      title,
      author,
      isbn,
      publicationYear: parseInt(publicationYear),
      genre,
      rentalStatus,
      coverImage: req.file.path // Save the path of the uploaded image
    });

    // Save to database
    await newBook.save();

    // Respond with the created book
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Error adding book', error: error.message });
  }
};*/

export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, publicationYear, genre, rentalStatus } = req.body;

    // Validate required fields
    if (!title || !author || !isbn) {
      return res.status(400).json({ message: 'Title, author, and ISBN are required' });
    }

    // Check if book with the same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'A book with this ISBN already exists' });
    }

    // Ensure the cover image path is saved correctly
    const coverImagePath = req.file 
      ? `uploads/${req.file.filename}` 
      : 'uploads/default-book-cover.jpg';

    // Create a new book document
    const newBook = new Book({
      title,
      author,
      isbn,
      publicationYear: publicationYear ? parseInt(publicationYear) : undefined,
      genre,
      rentalStatus,
      coverImage: coverImagePath
    });

    // Save to database
    await newBook.save();

    // Respond with the created book
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Error adding book', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { isbn } = req.params;

    // Find and delete the book
    const deletedBook = await Book.findOneAndDelete({ isbn });

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Remove the cover image file
    if (deletedBook.coverImage) {
      fs.unlink(deletedBook.coverImage, (err) => {
        if (err) {
          console.error('Error deleting cover image:', err);
        }
      });
    }

    res.json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

// Multer upload middleware
export const uploadCoverImage = upload.single('coverImage');