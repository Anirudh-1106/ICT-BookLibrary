// controllers/rentalController.js
import RentalRequest from '../models/RentalRequest.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

export const getRentalRequests = async (req, res) => {
  try {
    const requests = await RentalRequest.find({ status: 'pending' })
      .populate('book')
      .populate('user', '-password');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rental requests', error: error.message });
  }
};

export const requestRental = async (req, res) => {
  try {
    const { bookId, userId } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.rentalStatus !== 'Available') {
      return res.status(400).json({ message: 'Book is not available for rent' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if there's already a pending request
    const existingRequest = await RentalRequest.findOne({
      book: bookId,
      user: userId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this book' });
    }

    // Create new rental request
    const rentalRequest = new RentalRequest({
      book: bookId,
      user: userId
    });

    await rentalRequest.save();

    // Update book status
    book.rentalRequests.push(userId);
    await book.save();

    res.status(201).json({
      message: 'Rental request created successfully',
      request: rentalRequest
    });

  } catch (error) {
    res.status(500).json({ message: 'Error creating rental request', error: error.message });
  }
};

export const acceptRentalRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await RentalRequest.findById(requestId)
      .populate('book')
      .populate('user');

    if (!request) {
      return res.status(404).json({ message: 'Rental request not found' });
    }

    // Update book status
    await Book.findByIdAndUpdate(request.book._id, {
      rentalStatus: 'Rented',
      $pull: { rentalRequests: request.user._id }
    });

    // Update request status
    request.status = 'accepted';
    await request.save();

    res.status(200).json({
      message: 'Rental request accepted successfully',
      request
    });

  } catch (error) {
    res.status(500).json({ message: 'Error accepting rental request', error: error.message });
  }
};

export const getRentedBooks = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find accepted rental requests for this user
    const rentedBooks = await RentalRequest.find({
      user: userId,
      status: 'accepted'
    }).populate('book');

    // Extract just the book information
    const books = rentedBooks.map(request => request.book);
    
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rented books', error: error.message });
  }
};