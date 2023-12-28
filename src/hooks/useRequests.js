import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const useRequests = () => {
    const [requests, setRequests] = useState([]);
   
    useEffect(() => {
       const fetchRequests = async () => {
         const snapshot = await firebase.firestore().collection('requests').get();
         const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         setRequests(data);
       };
   
       fetchRequests();
    }, []);
   
    return requests;
   };
   
   export default useRequests;