import { usePlatformStore } from "@aroh/asdk";
import axios from "axios";

export function useArohJavaPathBridge() {
  const {
    user: arohUser,
    profile: arohProfile,
    token: arohToken,
    isAuthenticated,
    isLoading,
    login: arohLogin,
    logout: arohLogout,
    rewardUser
  } = usePlatformStore();

  const user = arohUser && arohProfile ? {
    username: arohProfile.displayName || arohUser.email.split("@")[0],
    email: arohUser.email,
    id: arohUser.id
  } : null;

  // Intercept and configure Axios headers with AROH credentials
  const syncAxiosToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const login = async (email: string, password?: string) => {
    await arohLogin(email, password);
  };

  const logout = () => {
    arohLogout();
    syncAxiosToken(null);
  };

  // Award user Aros upon curriculum progress
  const rewardForTaskCompletion = async (taskId: string, points = 50) => {
    if (!arohUser) return;
    await rewardUser(arohUser.id, points, `Completed JavaPath Challenge: ${taskId}`);
  };

  return {
    user,
    token: arohToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    syncAxiosToken,
    rewardForTaskCompletion
  };
}
