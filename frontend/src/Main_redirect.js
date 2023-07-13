import { useLocation } from "react-router-dom";
function Data(){
    const location = useLocation();
    console.log("Hello world");
    console.log(location.state);
  }
export default Data;