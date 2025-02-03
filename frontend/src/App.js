import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* 
        The 'flex-grow' class makes the main area expand to fill the available space.
        The background gradient will now cover the full height of this flexible area.
      */}
      <main className="flex-grow bg-gradient-to-t from-teal-400 via-cyan-300 to-teal-400">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
