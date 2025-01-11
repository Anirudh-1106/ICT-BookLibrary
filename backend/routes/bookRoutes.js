/*import express from 'express';
import { getBooks, addBook,deleteBook } from '../controllers/bookController.js';

const router = express.Router();

// Get all books
router.get('/', getBooks);

// Add a new book
router.post('/', addBook);

// Delete a book by ISBN
router.delete('/:isbn', deleteBook);

export default router;*/

import express from 'express';
import path from 'path';
import { 
  getBooks, 
  addBook, 
  deleteBook, 
  uploadCoverImage 
} from '../controllers/bookController.js';

const router = express.Router();

// Get all books
router.get('/', getBooks);

// Add a new book with image upload
router.post('/', uploadCoverImage, addBook);

// Delete a book by ISBN
router.delete('/:isbn', deleteBook);

export default router;