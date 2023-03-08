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
import { useState, useEffect } from "react";
import SideBar from "../sidebar/SideBar";
import axios from "axios";
import { PatientInfo } from "../interfaces";
import MedicalRecordsCard from "../RecordCard";
import Epidemiology from "../Epidemiology";

const options = {
  url: "http://localhost:1234/api/v1/patient",
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
  // data: {
  //   name: 'David',
  //   age: 45
  // }
};

interface Patient {
  patient_id: Number;
  address: String;
  dob: String;
  first_name: String;
  last_name: String;
  gender: String;
  phone: String;
  work_place: String;
}

interface EpidemiologyContent {
  appointment: Array<{
    hospital_id: Number;
    hospital_name: String;
    hospital_address: String;
    province: String;
    visit_time: Date;
    doctor_name: String;
  }>;
  people: Array<Patient>;
}

export default function MainLayout(props: { setSelectedRecord: any }) {
  const [listToggle, setListToggle] = useState<boolean>(false);
  const [patients, setPatients] = useState<Array<Patient> | undefined>();
  const [epiOpen, setEpiOpen] = useState<boolean>(false);
  const [epiContent, setEpiContent] = useState<EpidemiologyContent>();
  const [hospitalValue, setHospitalsValue] = useState<Number>(-1);
  const [selectedPatient, setSelectedPatient] = useState<
    PatientInfo | undefined
  >();
  const [records, setRecords] = useState<any>();
  const { setSelectedRecord } = props;
  useEffect(() => {
    console.log("useEffect");
    axios(options).then((response) => {
      setPatients(response.data.result);
    });
    axios({
      url: `http://localhost:1234/api/v1/record`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      // data: {
      //   name: 'David',
      //   age: 45
      // }
    }).then((res) => {
      setRecords(res.data.result);
      console.log(res.data);
    });
  }, []);

  const handleSelectPatient = (patientId: Number) => {
    axios({
      url: `http://localhost:1234/api/v1/patient/${patientId}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      // data: {
      //   name: 'David',
      //   age: 45
      // }
    }).then((res) => {
      setSelectedPatient(res.data.result[0]);
      console.log(res.data);
      setListToggle(false);
    });
  };
  console.log(records);
  useEffect(() => {
    if (!selectedPatient) {
      if (hospitalValue == -1) {
        return;
      } else {
        axios({
          url: `http://localhost:1234/api/v1/record/hospital/${hospitalValue}`,
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        }).then((res) => {
          setRecords(res.data.filtered);
          console.log(res.data);
        });
      }
    } else {
      if (hospitalValue == -1) {
        axios({
          url: `http://localhost:1234/api/v1/record`,
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        }).then((res) => {
          const result = res.data.result.filter(
            (record: any) => record.patient_id == selectedPatient.patient_id
          );
          setRecords(result);
          console.log(res.data);
        });
      } else {
        axios({
          url: `http://localhost:1234/api/v1/record/hospital/${hospitalValue}`,
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        }).then((res) => {
          const result = res.data.filtered.filter(
            (record: any) => record.patient_id == selectedPatient.patient_id
          );
          setRecords(result);
          console.log(res.data);
        });
      }
    }
  }, [hospitalValue, selectedPatient]);

  const handleEpi = () => {
    axios({
      url: `http://localhost:1234/api/v1/epidemiology/track/${selectedPatient?.patient_id}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      // data: {
      //   name: 'David',
      //   age: 45
      // }
    }).then((res) => {
      // setSelectedPatient(res.data);
      setEpiContent({
        appointment: res.data.appointments,
        people: res.data.people,
      });
      console.log(res.data);
      setEpiOpen(true);
      // setListToggle(false);
    });
  };
  return (
    <Box sx={{ height: 2000, flexWrap: "wrap", display: "flex" }}>
      {/* <Typography variant="h4">Medical Record Management System</Typography> */}
      <Grid container>
        <Grid item xs={9}>
          <Container sx={{ height: 2000 }}>
            {/* <Box>Result: Hien list ten nguoi benh</Box> */}
            <Box sx={{ mb: 5 }}>
              <TextField
                fullWidth
                // label="fullWidth"
                id="fullWidth"
                value={
                  selectedPatient &&
                  selectedPatient?.first_name + " " + selectedPatient?.last_name
                }
                onClick={() => setListToggle(!listToggle)}
              />
              <Collapse in={listToggle}>
                <Paper
                  sx={{
                    height: "300px",
                    width: "70%",
                    overflowY: "scroll",
                    position: "absolute",
                  }}
                >
                  {patients &&
                    patients.map((patient, index) => (
                      <Box
                        sx={{
                          width: "100%",
                          p: 1,
                          height: "20px",
                          "&:hover": {
                            cursor: "pointer",
                            backgroundColor: "#E8F0F2",
                          },
                        }}
                        key={index}
                        onClick={() => handleSelectPatient(patient.patient_id)}
                      >{`ID: ${patient["patient_id"]}. ${patient["first_name"]} ${patient["last_name"]}`}</Box>
                    ))}
                </Paper>
              </Collapse>
            </Box>
            <Box>
              <Paper>
                <Container>
                  <Box sx={{ width: "100%", textAlign: "center" }}>
                    <Typography variant="h5">Medical Record</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    {selectedPatient &&
                      Object.keys(selectedPatient).map((key) => (
                        <Box>
                          {`${key}: ${
                            selectedPatient[key as keyof PatientInfo]
                          }`}
                        </Box>
                      ))}
                  </Box>
                  {records && (
                    <MedicalRecordsCard
                      medicalRecords={records}
                      setRecord={setSelectedRecord}
                    ></MedicalRecordsCard>
                  )}
                  {/* <Card variant="outlined"> */}

                  {/* {[{ record_id: 1, created_time: "1/1/2023" }]((record) => )} */}
                  {/* </Card> */}
                </Container>
              </Paper>
            </Box>
          </Container>
        </Grid>
        <Grid item xs={3}>
          <SideBar value={hospitalValue} setValue={setHospitalsValue} />
          <Button
            variant="contained"
            onClick={() => handleEpi()}
            sx={{ mt: 1 }}
            disabled={!selectedPatient}
          >
            Epidemiology
          </Button>
          {selectedPatient && (
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => {
                axios
                  .request({
                    url: `http://localhost:1234/api/v1/record/dead/${selectedPatient.patient_id}`,
                    method: "PUT",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json;charset=UTF-8",
                    },
                  })
                  .then((res) => {
                    console.log(res.data);
                  });
              }}
            >
              Confirm Dead
            </Button>
          )}
          <br />
          <br />
          <a style={{ margin: 20 }} href="http://localhost:3000/edit">
            Edit
          </a>
          <a href="http://localhost:3000/create">Create</a>
        </Grid>
      </Grid>
      <Epidemiology
        open={epiOpen}
        onClose={() => setEpiOpen(false)}
        content={
          <Box>
            <Box>
              Appointment:{" "}
              {epiContent?.appointment.map((appointment, index) => (
                <Box>
                  <span style={{ fontWeight: "bold" }}>
                    Hospital {index + 1}:
                  </span>
                  {Object.keys(appointment).map((key) => (
                    <Box>
                      {" "}
                      {`${key}: ${
                        appointment[key as keyof typeof appointment]
                      }`}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
            <Box>People: ...</Box>
          </Box>
        }
      />
    </Box>
  );
}
