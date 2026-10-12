const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const elements = {
    loadBtn: document.getElementById('load-btn'),
    status: document.getElementById('status'),
    noteForm: document.getElementById('note-form'),
    titleInput: document.getElementById('title-input'),
    bodyInput: document.getElementById('body-input'),
    submitBtn: document.getElementById('submit-btn'),
    notesList: document.getElementById('notes-list')
};

function showStatus(message, type) {
    elements.status.textContent = message;
    elements.status.className = type;
}

async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function loadNotes() {
    elements.loadBtn.disabled = true;
    showStatus('Loading notes...', 'loading');
    
    try {
        const notes = await request(`${API_URL}?_limit=10`);
        elements.notesList.innerHTML = '';
        
        if (notes.length === 0) {
            elements.notesList.innerHTML = '<li>No notes found.</li>';
        } else {
            notes.forEach(addNoteToList);
        }
        showStatus('Loaded 10 notes from the server.', 'success');
    } catch (error) {
        showStatus(`Error loading notes: ${error.message}`, 'error');
    } finally {
        elements.loadBtn.disabled = false;
    }
}

async function createNote(event) {
    event.preventDefault();
    const title = elements.titleInput.value.trim();
    const body = elements.bodyInput.value.trim();

    if (!title || title.length > 100) {
        showStatus('Title is required and must be under 100 characters.', 'error');
        return;
    }

    elements.submitBtn.disabled = true;
    showStatus('Creating note...', 'loading');

    try {
        const newNote = await request(API_URL, {
            method: 'POST',
            body: JSON.stringify({ title, body, userId: 1 }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });
        
        // Add to top of list
        elements.notesList.insertBefore(createNoteElement(newNote), elements.notesList.firstChild);
        showStatus(`Note created (status 201, id ${newNote.id}).`, 'success');
        elements.noteForm.reset();
    } catch (error) {
        showStatus(`Error creating note: ${error.message}`, 'error');
    } finally {
        elements.submitBtn.disabled = false;
    }
}

async function deleteNote(id, listItem) {
    const btn = listItem.querySelector('.delete-btn');
    btn.disabled = true;
    showStatus('Deleting note...', 'loading');

    try {
        await request(`${API_URL}/${id}`, { method: 'DELETE' });
        // Note: JSONPlaceholder doesn't actually delete resources or persist newly created ones. 
        // We simulate success by removing it from the DOM locally.
        listItem.remove();
        showStatus('Note deleted successfully.', 'success');
        
        if (elements.notesList.children.length === 0) {
            elements.notesList.innerHTML = '<li>No notes found.</li>';
        }
    } catch (error) {
        showStatus(`Error deleting note: ${error.message}`, 'error');
        btn.disabled = false;
    }
}

function createNoteElement(note) {
    const li = document.createElement('li');
    li.className = 'note-item';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'note-content';
    
    const h3 = document.createElement('h3');
    h3.textContent = note.title;
    
    const p = document.createElement('p');
    p.textContent = note.body;
    
    contentDiv.appendChild(h3);
    contentDiv.appendChild(p);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteNote(note.id, li);
    
    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);
    
    return li;
}

function addNoteToList(note) {
    elements.notesList.appendChild(createNoteElement(note));
}

elements.loadBtn.addEventListener('click', loadNotes);
elements.noteForm.addEventListener('submit', createNote);