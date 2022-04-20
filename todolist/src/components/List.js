import React, { useState, useEffect, useReducer } from "react";
import Item from "./Item";
import DatePicker from "react-date-picker";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const WORKER_LINK =
  "https://us-central1-automation-nk.cloudfunctions.net/ical?url=";

function List() {
  const [user] = useAuthState(auth);
  let [title, setTitle] = useState("");
  let [date, setDate] = useState(new Date());
  let [todo, setTodo] = useState([]);
  let [open, setOpen] = useState(false);
  let [link, setLink] = useState("");

  const collectionName = `users/${user.uid}/tasks`;

  function removeItem(data) {
    const result = todo.filter((item) => item.id !== data.id);
    setTodo(result);
    deleteDoc(doc(db, collectionName, data.id));
  }

  function onSubmit() {
    const obj = { id: uuidv4(), title: title, date: date };
    setTodo([...todo, obj]);
    setDoc(doc(db, collectionName, obj.id), obj);
    setTitle("");
    setDate(new Date());
  }

  function openModal() {
    setOpen(true);
  }

  async function saveLink() {
    await setDoc(doc(db, "users", user.uid), {
      calendarurl: link,
    });
    setOpen(false);
  }

  async function bsSync() {
    const bsTasks = await fetch(WORKER_LINK + link).then((tasks) =>
      tasks.json()
    );
    console.log(bsTasks);
    let arr = todo;
    bsTasks.forEach((task) => {
      let foundMatch = false;
      todo.forEach((item) => {
        if (
          item.title == task.name &&
          item.date.getTime() == new Date(task.time).getTime()
        )
          foundMatch = true;
      });
      if (!foundMatch) {
        const obj = {
          id: uuidv4(),
          title: task.name,
          date: new Date(task.time),
        };
        setDoc(doc(db, collectionName, obj.id), obj);
        arr.push(obj);
      }
    });
    setTodo([...arr]);
  }

  useEffect(() => {
    let newArr = [];
    getDocs(collection(db, collectionName)).then((tasks) => {
      tasks.forEach((task) => {
        newArr.push({
          title: task.data().title,
          date: new Date(task.data().date.seconds * 1000),
          id: task.data().id,
        });
      });
      setTodo(newArr);
    });
    getDoc(doc(db, "users", user.uid)).then((user) => {
      setLink(user.data().calendarurl);
    });
  }, []);

  return (
    <div>
      <h1 className="header">Todo List</h1>
      <marquee>
        Signed in as: {user.displayName}, {user.email}{" "}
      </marquee>
      <br />
      <button
        value="Sign Out"
        onClick={() => {
          signOut(auth);
        }}
      >
        Sign out
      </button>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <DatePicker onChange={setDate} value={date} />
      <input type="button" value="Add" onClick={onSubmit} />
      <input type="button" value="Get Brightspace Link" onClick={openModal} />
      <input type="button" value="Sync Calendar" onClick={bsSync} />
      {todo.map((data) => (
        <Item key={data.id} itemData={data} removeItem={removeItem} />
      ))}
      <Modal open={open} onClose={saveLink} center>
        <h2>Place Brightspace Link here</h2>
        <input
          type="text"
          value={link}
          onChange={(event) => setLink(event.target.value)}
        />
      </Modal>
    </div>
  );
}

export default List;
