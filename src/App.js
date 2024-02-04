import Home from "./views/home";
import {Route, Routes} from "react-router-dom";
import Rocks from "./views/rocks";
import Rock from "./views/rock";
import MainLayout from './layouts/main'


function App() {
  return (
    <MainLayout>
    <Routes>
      <Route path="/" exact element={<Home/>} />
      <Route path="/rocks" exact element={<Rocks/>} />
      <Route path="/rocks/:tokenId" exact element={<Rock/>} />
    </Routes>
    </MainLayout>
  );
}

export default App;
