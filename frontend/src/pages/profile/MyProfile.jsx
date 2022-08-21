import React from "react";
import { useUser } from "../../store";
import "./myProfile.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ChangeEmail from "../../components/profile/ChangeEmail";
import ChangePassword from "../../components/profile/ChangePassword";
import { Typography } from "@mui/material";


dayjs.extend(relativeTime);

const MyProfile = () => {

      const { user } = useUser();
  return (
    <div className="profilePage">
      <Typography
            variant="h3"
           
            sx={{
              mr: 2,
              fontWeight:"bold",
             textAlign:"center"
             
            }}
          >
            Mon profil
          </Typography>
      <div className="details">
        <h3>Nom : {user.name}</h3>
        <h3>Email : {user.email}</h3>
        <h4>Member depuis : {dayjs().from(user.createdAt, true)}</h4>
      </div>
      <ChangeEmail/>
      <ChangePassword/>

    </div>
  );
}; 

export default MyProfile;
 