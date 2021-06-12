// always import these 2
import React, { useEffect, useState } from "react";
import "./index.css";

/**
 * Import local files
 * e.g :
 * import ComponentName from "./path_to_component"
 *
 * "./" -> same folder
 * "../" -> folder before
 */

const styles = {
  button: {
    width: "50px", // or width:50
    padding: "10px 20px",
    backgroundColor: "#000",
    color: "#FFF",
    border: "none",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

const MyButtonComponent = ({ text, onClick, styles }) => {
  return (
    <button style={styles} onClick={onClick}>
      {text}
    </button>
  );
};

// Functional Component / Hooks - Newer
const Template = () => {
  //[1]
  const [data, setData] = useState(null); // e.g only
  const [number, setNumber] = useState(0);
  const [text, setText] = useState(null); // @ useState("") -> depends on how you want to condition them

  // [2]
  const getData = () => {
    // Do something here
  };

  const onMinus = () => {
    setNumber(number - 1);
  };

  const onAdd = () => {
    setNumber(number + 1);
  };

  const onChangeText = (event) => {
    const value = event.target.value;
    console.log(value);
    setText(value);
  };

  const onSubmit = () => {
    alert(text);
  };

  const onClickCustomComponent = () => {
    alert("Hello World");
  };

  // [3]
  useEffect(() => {
    getData();
  }, []);

  // [4]
  return (
    <div className="body-content">
      <h3>This is a Template Page </h3>
      <div className="buttonContainer">
        <button
          className="button"
          onClick={() => {
            onMinus();
          }}
        >
          -
        </button>
        <p>{number}</p>
        <button
          style={styles.button}
          onClick={() => {
            onAdd();
          }}
        >
          +
        </button>
      </div>
      <div className="inputContainer">
        <input
          className="inputText"
          value={text}
          onChange={(event) => onChangeText(event)}
        />
        <button className="buttonSubmit" onClick={() => onSubmit()}>
          submit
        </button>
      </div>
      <div className="customButtonContainer">
        <h6>This is an example of a custom component</h6>
        <MyButtonComponent
          text="Click Me!"
          onClick={() => {
            onClickCustomComponent();
          }}
          styles={{
            backgroundColor: "#000",
            padding: "10px 20px",
            fontSize: "16px",
            color: "#FFF",
            border: "none",
          }}
        />
      </div>
    </div>
  );
};

// [5]
export default Template;

// ============================================================================================================================================================
// NOTES

/**
 * [1]
 * - data -> the initial value (in useState(...) ) can be
 *      - null => useState(null);
 *      - String => useState("");
 *      - object => useState({});
 *      - array => useState([]);
 *      - number => useState(0)
 *   -> Depends on what type of data you want it to be
 */

/**
 * [2] Function
 *
 * Old Style < ES5
 * e.g function functionName(){..}
 *
 * New Style ES6 (called arrow function)
 * e.g const functionName = () => {...}
 *
 * */

/**
 * [3]
 *
 * Lifecycle:
 *
 *
 * 1) if want to call functionName() only once, dependencies will be empty array []
 * Functional Component
 * e.g
 *  useEffect(()=>{
 *      functionName()
 *  },[])
 *
 *
 * 2) if want to call functionName() every time variable changes,
 * Functional Component
 * e.g
 *  useEffect(()=>{
 *     functionName()
 *  },[variable])
 *
 *
 * 3) if no dependencies is set, it'll constantly call functionName() when document(html) is updated (Not a good practice)
 * Functional Component
 * e.g
 *  useEffect(()=>{
 *      functionName()
 *  })
 *
 *
 * if want to use eventListener (like firebase firestore realtime),
 * Functional Component
 * e.g
 *  const functionName = (snap) =>{
 *      Do something with snap
 *  }
 *
 *  useEffect(()=>{
 *      const unsubscribe = firebase.firestore()
 *                                  .collection("collectionName")
 *                                  .doc("docName")
 *                                  .onSnapshot((snap)=>{
 *                                      functionName(snap)
 *                                  });
 *      return unsubscribe
 *  },[])
 *
 */

/**
 * [4] what will be rendered to your website
 *    rules
 *        - return must have only one parent node(tagName)
 *            : Correct :
 *            return(
 *                <tagName>{...children}</tagName>
 *            )
 *
 *            :Incorrect:
 *            return(
 *                <tagName>{...children}</tagName>
 *                <tagName>{...children}</tagName>
 *            )
 *
 *
 * -> <tagName {...props}></tagName>
 * {..props} depends on tagName,
 * e.g props:-
 * - style
 * - onClick
 * - onChange
 * - className
 * - id
 * :-> boleh refer contoh atas
 *
 *
 * Custom Components
 * cth custom component, yg aku guna Material Ui tu
 * boleh buat dalam file yg sama @ import component dari file lain
 * contoh yg aku buat, Navbar dgn MySnackbar
 * kenapa aku guna file lain, sebab nanti senang nak panggil kat banyak file, tak perlu ulang yg sama
 *
 *  */
