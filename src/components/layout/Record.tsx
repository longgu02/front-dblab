import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Collapse,
  Grid,
  Card,
  Button,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SideBar from "../sidebar/SideBar";
import axios from "axios";
import { PatientInfo } from "../interfaces";
import MedicalRecordsCard from "../RecordCard";
import Epidemiology from "../Epidemiology";
import { Link } from "react-router-dom";

export default function Record(props: { record: any }) {
  const [content, setContent] = useState<any>();
  const id = useRef();
  useEffect(() => {
    axios
      .request({
        url: `http://localhost:1234/api/v1/record/${id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then((res) => {
        setContent(res.data.result[0]);
        console.log("content", res.data);
      });
  }, []);
  return (
    <Box>
      <Link to="/">Back</Link>
      <Paper>
        {Object.keys(content).map((key) => (
          <Typography>{`${key}: ${content[key]}`}</Typography>
        ))}
      </Paper>
    </Box>
  );
}
