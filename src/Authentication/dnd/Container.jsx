import React, { useCallback, useState, useEffect, useContext } from "react";
import update from "immutability-helper";
import { Card } from "./Card.jsx";
import { useNavigate } from "react-router-dom";

import {
  getFirestore,
  collection,
  query,
  where,
  addDoc,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

import { Context } from "../../Utilities/Context.jsx";

export const Container = () => {
  const db = getFirestore();

  let { user, setuser, id, setid, errorMessage, setpage, setfcmToken } =
    useContext(Context);

  const [cards, setCards] = useState([]);

  // get approvers
  useEffect(() => {
    const userCollectionRef = collection(db, "companies");
    const query4 = query(userCollectionRef, where("userId", "==", id));

    getDocs(query4)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = [];
          querySnapshot.forEach((doc) => {
            userData.push(doc.data());
          });
          setCards(userData[0].approvers);
        } else {
        }
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });
  }, [id]);

  useEffect(() => {
    const updateApprovers = async () => {
      if (cards.length > 0) {
        try {
          const userCollectionRef = collection(db, "companies");
          const query4 = query(userCollectionRef, where("userId", "==", id));

          const querySnapshot = await getDocs(query4);

          querySnapshot.forEach(async (doc) => {
            try {
              const docRef = doc.ref;

              await setDoc(docRef, { approvers: cards }, { merge: true });
            } catch (error) {
              console.error(
                "Error updating document in 'companies' collection:",
                error
              );
            }
          });
          console.log(cards);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    updateApprovers();
  }, [cards]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);
  const renderCard = useCallback((card, index) => {
    return (
      <Card
        key={index + 1}
        index={index}
        id={index + 1}
        text={card}
        moveCard={moveCard}
      />
    );
  }, []);
  return (
    <>
      <div style={{ width: "100%" }}>
        {cards.map((card, i) => renderCard(card, i))}
      </div>
    </>
  );
};
