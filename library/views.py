from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Book

def home(request):
    books = Book.objects.all()
    return render(request, 'SmartLib.html', {'books': books})


def add_book(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        author = request.POST.get('author')
        description = request.POST.get('description')

        Book.objects.create(
            title=title,
            author=author,
            description=description
        )
        return redirect('home')  # refresh page
    
def delete_book(request, id):
    book = get_object_or_404(Book, id=id)
    book.delete()
    messages.success(request, "Book deleted successfully")
    return redirect('home')

def update_book(request,id):
    book = get_object_or_404(Book, id = id)
   
    if request.method == 'POST':
        book.title = request.POST['title']
        book.author = request.POST['author']
        book.description = request.POST['description']
        book.save()
        return redirect('home')
    return render(request, 'update.html', {'book': book})