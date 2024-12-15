"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

interface Props {
  children: ReactNode;
}
export interface UserContextProps {
  currentUserId: string;
  setCurrentUser(user_id: string): void;
  selectedMovieId: string;
  setSelectedMovie(movie_id: string): void;
  currentAdminId: string;
  setCurrentAdmin(admin_id: string): void;
}

const UserContext = createContext<UserContextProps>({
  currentUserId: "",
  selectedMovieId: "",
  currentAdminId: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentUser(user_id: string) {},
  setSelectedMovie(movie_id: string) {},
  setCurrentAdmin(admin_id: string) {},
});

export const UserContextProvider = ({ children }: Props) => {
  // Get currentUserId from localStorage on initial load, or default to an empty string
  const [currentUserId, setCurrentUserId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId") || ""; // Retrieve from localStorage if available
    }
    return "";
  });
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [currentAdminId, setCurrentAdminId] = useState("");

  // Set currentUserId and store it in localStorage whenever it changes
  const setCurrentUser = (userId: string) => {
    setCurrentUserId(userId);
    if (typeof window !== "undefined") {
      localStorage.setItem("userId", userId); // Save userId in localStorage
    }
  };

  const setSelectedMovie = (movieId: string) => {
    setSelectedMovieId(movieId);
  };

  const setCurrentAdmin = (adminId: string) => {
    setCurrentAdminId(adminId);
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminId") || ""; // Retrieve from localStorage if available
    }
    return "";
  };
  return (
    <UserContext.Provider
      value={{
        currentUserId,
        setCurrentUser,
        selectedMovieId,
        setSelectedMovie,
        currentAdminId,
        setCurrentAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
