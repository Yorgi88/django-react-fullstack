import React from 'react'
import "../styles/note.css"

const Note = ({note, onDelete}) => {
    // we need a var to create the date aspect of the code
    // const formattedDate = new Date(note.created_at).toLocaleDateString('en-us');
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")
    // this gives us a nicely formatted date
  return (
    <div className='note-container'>
        <p className="note-title">{note.title}</p>
        <p className="note-content">{note.content}</p>
        <p className="note-date">{formattedDate}</p>
        <button className="delete-button" onClick={() => onDelete(note.id)}>
            Delete
        </button>
    </div>
  )
}

export default Note