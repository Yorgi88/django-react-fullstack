import React from 'react';
import { useState, useEffect } from 'react';
import api from '../api';
import Note from '../components/Note';
import "../styles/home.css"


const Home = () => {
    // keep track with all of the notes that we have grabbed from the server
    // we send an authorised req to get the notes we've created
    const [notes, setNotes] = useState([]);

    // we then need some state for the form that will allow us to create a new note
    const [content, setContent] = useState('');

    const [title, setTitle] = useState('');

    // now lets write some func that will send reqs to the server
    // a func to get notes the user has, see the docs, line 633
    // useEffect(() => {
    //     getNotes();
    // }, []);
    
    const getNotes = () => {
        api.get('/api/notes/')
        .then((res) => res.data)
        // This first .then receives the entire response object (usually includes headers, status, and data).
        // res.data extracts just the data portion, which likely contains an array of note objects (e.g., titles, content).

        .then((data)=> {setNotes(data); console.log(data);
        })
        .catch((err)=> alert(err));
        // this will give all the notes the user has written
        // go to the urls.py in the base dir in the backend
        // for more info see the docs, line 658 and more
        
        

    }

    const deleteNote = (id) => {
      api.delete(`/api/notes/delete/${id}/`)
      .then((res)=> {
        if (res.status === 204) {
          alert('Note deleted')
        }else{
          alert('fail to delete note')
        }
        getNotes();
      }).catch((error)=> alert(error))
      // the idea is after deleting a note, we should display whatever notes left on the screen
      //not the most optimal way though, using [] is better
      
    };


    const createNote = (e) => {
      // since it will come from the form, we need e.preventdefault
      e.preventDefault();
      api.post('/api/notes/', {content, title})
      .then((res)=> {
        if (res.status === 201) {
          alert('Note created')
        }else{
          alert('Failed to create note')
        }
        getNotes();
      }).catch((error)=> alert(error));
      
      // making a post req to the django backend and we also pass in the content, state and title state in along
      // e.preventDefault();
      // api
      //     .post("/api/notes/", { content, title })
      //     .then((res) => {
      //         if (res.status === 201) alert("Note created!");
      //         else alert("Failed to make note.");
      //         getNotes();
      //     })
      //     .catch((err) => alert(err));
    }
    
  return (
    <div>
    <div>
        {/* write a structure for displaying the note */}
        <h2>Notes</h2>

        {notes.map((note, id)=> {
          return <Note note={note} onDelete={deleteNote} key={note.id}/>
        })}
    </div>

    <h2>Create a note</h2>
    <form action="" onSubmit={createNote}>
      <label htmlFor="title">Title</label>
      <br />
      <input type="text" id='title' name='title' required onChange={(e)=> setTitle(e.target.value)}
      value={title} />

     <label htmlFor="content">Content</label>
     <textarea name="content" id="content" required value={content} onChange={(e)=> setContent(e.target.value)}></textarea>
     <br />
     <input type="submit" value='Submit' />
     </form>
    </div>
  )
}

export default Home;