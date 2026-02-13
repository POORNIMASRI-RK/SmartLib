// ================= POPUP ELEMENTS =================
var popupoverlay = document.querySelector(".popup-overlay");
var popupbox = document.querySelector(".popup-box");
var addpopupbutton = document.getElementById("add-popup-button");
var cancelpopup = document.getElementById("cancel-popup");

// ================= BOOK ELEMENTS =================
var container = document.querySelector(".container");
var addbook = document.getElementById("add-book");
var booktitle = document.getElementById("book-title");
var bookauthor = document.getElementById("book-author");
var bookdescription = document.getElementById("book-description");

// Track edit mode
var editBookId = null;

// ================= OPEN POPUP =================
addpopupbutton.addEventListener("click", function () {
    clearInputs();
    editBookId = null;
    addbook.innerText = "ADD";

    popupoverlay.style.display = "block";
    popupbox.style.display = "block";
});

// ================= CLOSE POPUP =================
cancelpopup.addEventListener("click", function (event) {
    event.preventDefault();
    popupoverlay.style.display = "none";
    popupbox.style.display = "none";
    clearInputs();
});

// ================= LOAD BOOKS ON PAGE LOAD =================
document.addEventListener("DOMContentLoaded", function () {
    var books = JSON.parse(localStorage.getItem("books")) || [];
    books.forEach(createBook);
});

// ================= ADD / UPDATE BOOK =================
addbook.addEventListener("click", function (event) {
    event.preventDefault();

    if (booktitle.value === "" || bookauthor.value === "" || bookdescription.value === "") {
        alert("Please fill all fields");
        return;
    }
    if (editBookId) {
        updateBook(editBookId);
    } else {
        addNewBook();
    }

    popupoverlay.style.display = "none";
    popupbox.style.display = "none";
});

// ================= ADD NEW BOOK =================
function addNewBook() {
    var book = {
        id: Date.now(),
        title: booktitle.value,
        author: bookauthor.value,
        description: bookdescription.value
    };

    createBook(book);

    var books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));

    clearInputs();
}

// ================= CREATE BOOK CARD =================
function createBook(book) {
    var div = document.createElement("div");
    div.className = "book-container";
    div.setAttribute("data-id", book.id);

    div.innerHTML = `
        <h2>${book.title}</h2>
        <h5>${book.author}</h5>
        <p>${book.description}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

    container.appendChild(div);
}

// ================= EDIT & DELETE USING EVENT DELEGATION =================
container.addEventListener("click", function (event) {
    // DELETE BOOK
    if (event.target.classList.contains("delete-btn")) {
        var bookDiv = event.target.parentElement;
        var id = bookDiv.getAttribute("data-id");

        deleteBook(id);
        bookDiv.remove();
    }
    // EDIT BOOK
    if (event.target.classList.contains("edit-btn")) {
        var bookDiv = event.target.parentElement;
        var id = bookDiv.getAttribute("data-id");

        editBook(id);
    }
});

// ================= EDIT BOOK =================
function editBook(id) {
    var books = JSON.parse(localStorage.getItem("books")) || [];
    var book = books.find(b => b.id == id);

    booktitle.value = book.title;
    bookauthor.value = book.author;
    bookdescription.value = book.description;

    editBookId = id;
    addbook.innerText = "UPDATE";

    popupoverlay.style.display = "block";
    popupbox.style.display = "block";
}

// ================= UPDATE BOOK =================
function updateBook(id) {
    var books = JSON.parse(localStorage.getItem("books"));

    books = books.map(book => {
        if (book.id == id) {
            return {
                id: id,
                title: booktitle.value,
                author: bookauthor.value,
                description: bookdescription.value
            };
        }
        return book;
    });

    localStorage.setItem("books", JSON.stringify(books));

    container.innerHTML = "";
    books.forEach(createBook);

    editBookId = null;
    addbook.innerText = "Add Book";
    clearInputs();
}

// ================= DELETE BOOK FROM STORAGE =================
function deleteBook(id) {
    var books = JSON.parse(localStorage.getItem("books")) || [];
    books = books.filter(book => book.id != id);
    localStorage.setItem("books", JSON.stringify(books));
}

//  CLEAR INPUTS =================
function clearInputs() {
    booktitle.value = "";
    bookauthor.value = "";
    bookdescription.value = "";
}