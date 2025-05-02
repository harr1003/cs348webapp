import "../styles/profile.css";
import { useAuthContext } from "../hooks/useAuthContext";

const Profile = () => {
  const { user } = useAuthContext();
  return (
    <>
      <div className="center">
        <h1>Profile</h1>
        <h2>Username: {user.username}</h2>
        <h2>Email: {user.email}</h2>
      </div>
    </>
  );
};
export default Profile;
