import { ulid } from 'ulid'

export function getNoteId() {
    const hash = window.location.hash.substring(1)
    if(hash) return hash

    const noteId = ulid()
    window.location.hash = noteId
    return noteId
}

function getAllNotes() {
    const notes = []
    for(let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if(key?.startsWith('note-')) {
            const noteId = key.replace('note-', '')
            const content = localStorage.getItem(key) || ''

            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = content.split('<h1>')[1].split('</h1>')[0].trim().substring(0, 45)
            const title = tempDiv.textContent || 'Nova nota'

            notes.push({
                id: noteId,
                title,
                content
            })
        }
    }
    return notes.sort((a, b) => b.id.localeCompare(a.id))
}

export function updateNotesList() {
    const notesList = document.getElementById('notes-list')
    if(!notesList) return

    const noteId = getNoteId()
    const notes = getAllNotes()
    notesList.innerHTML = ''

    for(let i = 0; i < notes.length; i++) {
        const note = notes[i]
        const noteElement = document.createElement('div')
        noteElement.classList.add('note-item')
        if(note.id === noteId) {
            noteElement.classList.add('active')
        }
        noteElement.textContent = note.title
        noteElement.addEventListener('click', () => {
            window.location.hash = note.id
            window.location.reload()
        })
        notesList.appendChild(noteElement)
    }
}

export function removeNote() {
    const noteId = getNoteId()
    if(confirm('Deseja realmente excluir?')) {
        localStorage.removeItem(`note-${noteId}`)
        updateNotesList()
        const notes = getAllNotes()
        if(notes.length > 0) {
            window.location.hash = notes[0].id
            window.location.reload()
        }
    }
}