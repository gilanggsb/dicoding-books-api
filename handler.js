const { nanoid } = require("nanoid");
const books = require('./books')
const { intToBoolean, isStringContains } = require('./utils')

const addBookHandler = (request, h) => {
    try {

        const { name, year, author, summary, publisher, pageCount, readPage, finished, reading } = request.payload;
        var message = null;
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

        var newBook = {
            "name": name,
            "year": year,
            "author": author,
            "summary": summary,
            "publisher": publisher,
            "pageCount": pageCount,
            "readPage": readPage || 0,
            "reading": reading || true,
            "finished": finished || false,
            "createdAt": new Date().toISOString(),
            "insertedAt": new Date().toISOString(),
        }
        const newBookId = nanoid(16)
        newBook.id = newBookId;
        newBook.updatedAt = newBook.createdAt;
        if (readPage != 0) newBook.reading = true

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
        console.log("cekk params ", bookId, request.params)
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


module.exports = { addBookHandler, getBooksHandler, getBookByIdHandler };