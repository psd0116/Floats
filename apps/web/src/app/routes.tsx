import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Upload } from "./pages/Upload";
import { Detail } from "./pages/Detail";
import { Processing } from "./pages/Processing";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/upload",
    Component: Upload,
  },
  {
    path: "/processing",
    Component: Processing,
  },
  {
    path: "/detail/:id",
    Component: Detail,
  },
]);
