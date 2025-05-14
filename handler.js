const { nanoid } = require("nanoid");
const books = require('./books')
const { intToBoolean, isStringContains } = require('./utils')

const addBookHandler = (request, h) => {
    try {

        const { name, year, author, summary, publisher, pageCount, readPage, finished, reading } = request.payload;
        let message = null;
        if (readPage > pageCount) {
            message = 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
        }

        if (!name) {
            message = 'Gagal menambahkan buku. Mohon isi nama buku';
        }

        if (message) {
            const response = h.response({
                status: 'fail',
                message: message,
            });
            response.code(400);
            return response;
        }

        let newBook = {
            "name": name,
            "year": year,
            "author": author,
            "summary": summary,
            "publisher": publisher,
            "pageCount": pageCount,
            "readPage": readPage || 0,
            "reading": reading || false,
            "finished": finished || false,
            "createdAt": new Date().toISOString(),
            "insertedAt": new Date().toISOString(),
        }
        const newBookId = nanoid(16)
        newBook.id = newBookId;
        newBook.updatedAt = newBook.createdAt;

        if (readPage == pageCount) {
            newBook.finished = true
            newBook.reading = false
        }
        books.push(newBook)

        const isSuccess = books.filter((book) => book.id === newBookId).length > 0;

        if (isSuccess) {
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: newBookId,
                },
            });
            response.code(201);
            return response;
        }

        throw 'Buku gagal ditambahkan'
    } catch (error) {
        return h.response({
            status: 'fail',
            message: `${error}`,
        }).code(500);
    }
};

const getBooksHandler = (request, h) => {
    try {

        const { finished, name, reading } = request.query;
        let filteredResultBooks = books
        if (name) {
            filteredResultBooks = filteredResultBooks.filter((book) => isStringContains(book.name, name || ""))
        }

        if (finished) {
            filteredResultBooks = filteredResultBooks.filter((book) => book.finished == intToBoolean(finished))
        }

        if (reading) {
            filteredResultBooks = filteredResultBooks.filter((book) => book.reading == intToBoolean(reading))
        }

        filteredResultBooks = filteredResultBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }))

        return h.response({
            status: 'success',
            data: {
                books: filteredResultBooks
            }
        }).code(200);
    } catch (error) {
        return h.response({
            status: 'fail',
            message: `${error}`,

        }).code(500);
    }
}

const getBookByIdHandler = (request, h) => {
    try {
        const { bookId } = request.params;
        const filteredBook = books.filter((book) => book.id == bookId)
        if (filteredBook.length == 0) {
            return h.response({
                status: 'fail',
                message: "Buku tidak ditemukan"
            }).code(404);
        }

        return h.response({
            status: 'success',
            data: { book: filteredBook[0] }
        }).code(200);
    } catch (error) {
        return h.response({
            status: "fail",
            message: `${error}`
        }).code(500)
    }
}

const updateBookHandler = (request, h) => {
    try {
        const { bookId } = request.params;
        const bookIndex = books.findIndex((book) => book.id == bookId);
        console.log("🚀 ~ updateBookHandler ~ bookIndex:", bookIndex)
        if (bookIndex == -1) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Id tidak ditemukan',
            });
            response.code(400);
            return response;
        }

        const existingBook = books[bookIndex]

        const { name, year, author, summary, publisher, pageCount, readPage, finished, reading } = request.payload;
        let message = null;
        if (readPage > pageCount) {
            message = 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';
        }

        if (!name) {
            message = 'Gagal memperbarui buku. Mohon isi nama buku';
        }

        if (message) {
            const response = h.response({
                status: 'fail',
                message: message,
            });
            response.code(400);
            return response;
        }

        let updatedBook = {
            ...existingBook,
            "name": name || existingBook.name,
            "year": year || existingBook.year,
            "author": author || existingBook.author,
            "summary": summary || existingBook.summary,
            "publisher": publisher || existingBook.publisher,
            "pageCount": pageCount || existingBook.pageCount,
            "readPage": readPage || existingBook.pageCount,
            "reading": reading || existingBook.reading,
            "finished": finished || existingBook.reading,
            "updatedAt": new Date().toISOString(),
        }

        books[bookIndex] = updatedBook


        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
            data: {
                book: updatedBook,
            },
        });
        response.code(200);
        return response;

    } catch (error) {
        return h.response({
            status: 'fail',
            message: `${error}`,
        }).code(500);
    }
};


module.exports = { addBookHandler, getBooksHandler, getBookByIdHandler, updateBookHandler };