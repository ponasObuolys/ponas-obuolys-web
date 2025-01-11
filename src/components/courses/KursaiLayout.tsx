import { Outlet } from "react-router-dom";
import MainLayout from "../MainLayout";

const KursaiLayout = () => {
  console.log("KursaiLayout rendered");
  return (
    <MainLayout>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default KursaiLayout;