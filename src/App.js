import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";

import { store } from "./store/index";
import { Provider } from "react-redux";
import { ModalProvider } from "react-modal-hook";
import HesaplaPage from "./pages/HesaplaPage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/hesapla",
        element: <HesaplaPage />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <Provider store={store}>
          <ModalProvider>
            <RouterProvider router={router} />
          </ModalProvider>
        </Provider>
      </ChakraProvider>
    </div>
  );
}

export default App;
