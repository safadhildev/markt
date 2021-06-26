import React, { useEffect, useState } from "react";
import "./index.css";
import "firebase/firestore";
import {
    CircularProgress,
    Grid,
    IconButton,
    makeStyles,
    TextField,
    useMediaQuery,
    Typography,
    Button,
} from "@material-ui/core";

const Category = () => {

    const currentUser = firebase.auth().currentUser;
    const storageRef = firebase.storage().ref();
    const classes = useStyle();

    const [categoryData, setCategoryData] = useState([]);
    const getCategoryData = async () => {
        try {
            const querySnapshot = await db.collection("post").get();

            const results = querySnapshot.docs.map((doc) => {
                const formatData = {
                    id: doc.id,
                    ...doc.data(),
                };
                return formatData;
            });
            const posts = results.filter((item) => item.email === currentUser.email);

            setCategoryData(posts);
        } catch (error) {
            console.log("getPostData ::", error);
        }
    };

    useEffect(() => {
        getCategoryData();
    }, []);

}