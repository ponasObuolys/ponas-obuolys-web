import { Outlet } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

const Root = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default Root;