import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/home";
import SignIn from "../pages/signIn";
import SignUp from "../pages/signUp";
import ProtectedRoute from "../utilz/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <SignUp />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
