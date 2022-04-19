import React, { useState, useEffect } from "react";
import Item from "./Item";
import DatePicker from "react-date-picker";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc } from "firebase/firestore";

function List() {
  let [title, setTitle] = useState("");
  let [date, setDate] = useState(new Date());
  let [todo, setTodo] = useState([]);

  const collectionName = "tasks";

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
  }, []);

  return (
    <div>
      <h1 className="header">Todo List</h1>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <DatePicker onChange={setDate} value={date} />
      <input type="button" value="Add" onClick={onSubmit} />
      {todo.map((data) => (
        <Item key={data.id} itemData={data} removeItem={removeItem} />
      ))}
    </div>
  );
}

export default List;
