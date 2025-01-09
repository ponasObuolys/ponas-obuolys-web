import MainLayout from "./MainLayout";
import { Outlet } from "react-router-dom";

export const Root = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default Root;