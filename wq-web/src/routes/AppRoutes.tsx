import { useContext } from "react";
import { Outlet } from "react-router-dom";
import AppContainer from "../pages/Common/AppContainer";
import { AuthContext } from "../components/auth/AuthProvider";

const AppRoutes = () => {
  const authContext: any = useContext(AuthContext);

  return (
    <AppContainer isLoading={authContext?.isLoading}>
      <Outlet />
    </AppContainer>
  );
};

export default AppRoutes;
