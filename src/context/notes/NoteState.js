import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://127.0.0.1:8890";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);
  //get all notes
  const getNotes = async () => {
    //API CALL

    const response = await fetch(`${host}/api/notes/getallnotes`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type":"application/json",
        "auth-token":
         localStorage.getItem("token")
      }
    });
    const json = await response.json();
    console.log(json);
    setNotes(json)
  };
  //add notes
  const addNote = async (title, description, tag) => {
    //API CALL

    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
        "auth-token":
         localStorage.getItem("token")
      },

      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();
    setNotes(notes.concat(note));
    

    //logic to add at client side
   
  };
  //delete notes
  //API CALL

  const deleteNote = async (id) => {
    //API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type":"application/json",
        "auth-token":
         localStorage.getItem("token")
      },

     
    });
    const json = response.json();
    console.log(json)
    //logic to delete at client side
    console.log("Deleting note with id" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };
  //edit notes

  const editNote = async (id, title, description, tag) => {
    //API CALL

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type":"application/json",
        "auth-token":
         localStorage.getItem("token")
      },

      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json)

    let newNotes=JSON.parse(JSON.stringify(notes))
    //logic edit at client side
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title= title;
        newNotes[index].description= description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, getNotes, addNote, deleteNote, editNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
