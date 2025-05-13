const { nanoid } = require("nanoid");
const books = require('./books')

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


        console.log(`${JSON.stringify(request.payload)}`)
        var newBook = {
            "name": name,
            "year": year,
            "author": author,
            "summary": summary,
            "publisher": publisher,
            "pageCount": pageCount,
            "readPage": readPage,
            "reading": reading,
            "finished": finished,
            "createdAt": new Date().toISOString(),
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
        const response = h.response({
            status: 'fail',
            message: `${error}`,
        });
        response.code(500);
        return response
    }
};

module.exports = { addBookHandler };