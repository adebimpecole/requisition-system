import React, { useContext, useEffect, useId, useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

import "./Dashboard.sass";
import SideNav from "./SideNav";
import LilNav from "./LilNav";
import UserHome from "./UserHome";
import Records from "./Records";
import { Context } from "../Utilities/Context";
import Teams from "./Teams";
import Settings from "./Settings";
import Requests from "./Requests";
import Analytics from "./Analytics";

const Dashboard = () => {
  const db = getFirestore();

  const {
    user,
    setuser,
    id,
    setid,
    errorMessage,
    successMessage,
    page,
    setpage,
  } = useContext(Context);

  const [userfirstname, setUserfirstname] = useState("");
  const [userlastname, setUserlastname] = useState("");
  const [useremail, setUseremail] = useState("");
  const [usercomapny, setUsercompany] = useState("");
  const [userrole, setUserrole] = useState("");
  const [userdepartment, setUserdepartment] = useState("");
  const [downloadURL, setDownloadURL] = useState("");

  // function to list user pictures
  const listUserImages = async (userId) => {
    const storagePath = `/images/${userId}/'profile_picture'`; // Adjust the path as needed

    const imageURLs = [];
    const userImagesRef = ref(storage, storagePath);
    try {
      const imageRefs = await listAll(userImagesRef);
      for (const imageRef of imageRefs.items) {
        const url = await getDownloadURL(imageRef);
        imageURLs.push(url);
      }
      return imageURLs;
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error;
    }
  };

  // function to get most recent profile picture
  const findMostRecentImage = async (userId) => {
    const userImages = await listUserImages(userId);
    if (userImages.length === 0) {
      return null; // No images found
    }
    userImages
      .filter((image) => image && image.name)
      .sort((a, b) => b.name.localeCompare(a.name));
    return userImages[0]; // The most recent image
  };

  const getDownloadURLForImage = async (path) => {
    try {
      const imageRef = ref(storage, `${path}`);
      const url = await getDownloadURL(imageRef);
      setDownloadURL(url);
      return url;
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }
  };

  useEffect(() => {
    findMostRecentImage(id)
      .then((mostRecentImage) => {
        if (mostRecentImage) {
          const imagePath = mostRecentImage.name; // Get the image path
          const downloadURL = getDownloadURLForImage(mostRecentImage);
          // You can use the image path and download URL as needed
        } else {
        }
      })
      .catch((error) => {
        console.error("Error fetching most recent image:", error);
      });

    // Signed in
    // Reference to the user's document in Firestore
    const userDocRef = collection(db, "users");

    const query3 = query(userDocRef, where("userId", "==", id));

    getDocs(query3)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Retrieve the first document that matches the query
          const docSnapshot = querySnapshot.docs[0];
          const userData = docSnapshot.data();
          setUserfirstname(userData.first_name);
          setUserlastname(userData.last_name);
          setUserdepartment(userData.department);
          setUserrole(userData.role);
          setUseremail(userData.email);
          setUsercompany(userData.company_name);
        } else {
          errorMessage("No user data found.");
        }
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });
  }, []);

  const propsGroup = {
    firstname: userfirstname,
    lastname: userlastname,
    mail: useremail,
    company: usercomapny,
    role: userrole,
    dept: userdepartment,
    url: downloadURL,
  };
  return (
    <>
      {userfirstname != "" ? (
        <div className="Dashboard">
          <SideNav {...propsGroup} />
          <div className="sub_dash">
            <LilNav {...propsGroup} />
            {(() => {
              switch (page) {
                case "Home":
                  return <UserHome {...propsGroup} />;
                case "Analytics":
                  return <Analytics {...propsGroup} />;
                case "Records":
                  return <Records {...propsGroup} />;
                case "Requests":
                  return <Requests {...propsGroup} />;
                case "Teams":
                  return <Teams {...propsGroup} />;
                case "Settings":
                  return <Settings {...propsGroup} />;
                default:
                  return null;
              }
            })()}
          </div>
        </div>
      ) : (
        <span>loading</span>
      )}
    </>
  );
};

export default Dashboard;
