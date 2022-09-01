import React from "react";
import { useUser } from "../../store";
import "./myProfile.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ChangeEmail from "../../components/profile/ChangeEmail";
import ChangePassword from "../../components/profile/ChangePassword";
import { Typography } from "@mui/material";


require('dayjs/locale/fr')
dayjs.locale("fr")
dayjs.extend(relativeTime);

const MyProfile = () => {

      const { user } = useUser();
  return (
    <div className="profilePage">
      <Typography
            variant="h3"
            className="pageTitleProfil"
            sx={{
              fontWeight:"bold",
             textAlign:"center"
             
            }}
            
          >
            Mon profil
          </Typography>
      <div className="details">
        <h4>Nom : {user.name}</h4>
        <h4>Email : {user.email}</h4>
        <h4>Member depuis : {dayjs().from(user.createdAt, true)}</h4>
      </div>
      <ChangeEmail/>
      <ChangePassword/>

    </div>
  );
}; 

export default MyProfile;
 