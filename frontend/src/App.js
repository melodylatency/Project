import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Header />
      <main className="h-screen bg-gradient-to-t from-blue-300 via-green-200 to-green-300 gap-5">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
