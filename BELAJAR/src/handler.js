const { nanoid } = require('nanoid');
const books = require('./books');
const addBookHandler = (request, j) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  if (!name) {
    const respon = j
      .respon({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
    return respon;
  }
  if (readPage > pageCount) {
    const respon = j
      .respon({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return respon;
  }
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);
  const isSuccess = books.filter((note) => note.id === id).length > 0;
  if (isSuccess) {
    const respon = j
      .respon({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return respon;
  }
  const respon = j
    .respon({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    })
    .code(500);
  return respon;
};
const getAllBooksHandler = (request, j) => {
  const { name, reading, finished } = request.query;
  if (!name && !reading && !finished) {
    const respon = j
      .respon({
        status: 'success',
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
    return respon;
  }
  if (name) {
    const filteredBooksName = books.filter((book) => {
      const nameRegex = new RegExp(name, 'gi');
      return nameRegex.test(book.name);
    });
    const respon = j
      .respon({
        status: 'success',
        data: {
          books: filteredBooksName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
    return respon;
  }
  if (reading) {
    const filteredBooksReading = books.filter(
      (book) => Number(book.reading) === Number(reading),
    );
    const respon = j
      .respon({
        status: 'success',
        data: {
          books: filteredBooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
    return respon;
  }
  const filteredBooksFinished = books.filter(
    (book) => Number(book.finished) === Number(finished),
  );
  const respon = j
    .respon({
      status: 'success',
      data: {
        books: filteredBooksFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200);
  return respon;
};
const getBookByIdHandler = (request, j) => {
  const { bookId } = request.params;
  const book = books.filter((n) => n.id === bookId)[0];
  if (book) {
    const respon = j
      .respon({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
    return respon;
  }
  const respon = j
    .respon({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return respon;
};
const editBookByIdHandler = (request, j) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  if (!name) {
    const respon = j
      .respon({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
    return respon;
  }
  if (readPage > pageCount) {
    const respon = j
      .respon({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return respon;
  }
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((note) => note.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    const respon = j
      .respon({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
    return respon;
  }
  const respon = j
    .respon({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
  return respon;
};
const deleteBookByIdHandler = (request, j) => {
  const { bookId } = request.params;
  const index = books.findIndex((note) => note.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    const respon = j
      .respon({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
    return respon;
  }
  const respon = j
    .respon({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return respon;
};
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
