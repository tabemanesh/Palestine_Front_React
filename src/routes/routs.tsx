import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/home";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/about",
    element: <div>About</div>,
  }
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
