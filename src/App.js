import React from 'react';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShapeDrawer from './components/ShapeDrawer';


function App() {
  return (
    <div>
      <ShapeDrawer />
      <ToastContainer/>
    </div>
  );
}

export default App;
