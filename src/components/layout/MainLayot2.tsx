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
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { getFormatedTime } from "../utils/utils";

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

// record

interface MedicalRecord {
  record_id: Number;
  hospital_id: Number;
  patient_id: Number;
  bill_id: Number;
  type: String;
  created_time: Date;
  status: String;
  doctorRecord: [];
}

export default function MainLayout2() {
  const [content, setContent] = useImmer<any>({
    patient: {},
    record: {},
    doctor: {},
    bill: {},
  });
  let pulled = 0;
  const [record, setRecord] = useState<any>({});
  const [patient, setPatient] = useState<any>({});
  const [bill, setBill] = useState<any>({});
  const [doctorRecord, setDoctorRecord] = useState<any>([]);
  const [hospital, setHospital] = useState<any>({});
  // const [hospital, setHospital] = useState<any>({});

  const [refetch, setRefetch] = useState<boolean>(false);
  const { id } = useParams();
  // const [record, setRecord] = useState<Array<Patient> | undefined>();
  const [selectedPatient, setSelectedPatient] = useState<
    PatientInfo | undefined
  >();

  const fetchData = async () => {
    let resultContent: any = {};
    const _promise = await axios.request({
      url: `http://localhost:1234/api/v1/record/${id}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    const record = _promise.data.result[0];
    resultContent.record = record;
    await axios
      .request({
        url: `http://localhost:1234/api/v1/patient/${record.patient_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then((res) => {
        // setContent((prev: any) => {
        //   prev.patient = res.data.result[0];
        // });
        resultContent.patient = res.data.result[0];
      });
    await axios
      .request({
        url: `http://localhost:1234/api/v1/bill/${record.bill_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then((res) => {
        resultContent.bill = res.data.result[0];

        console.log("bill", res.data);
      });
    await axios
      .request({
        url: `http://localhost:1234/api/v1/bill/${record.bill_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then((res) => {
        resultContent.bill = res.data.result[0];
        setBill(res.data.result[0]);

        console.log("bill", res.data);
      });
    await axios
      .request({
        url: `http://localhost:1234/api/v1/hospital/${record.hospital_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then((res) => {
        resultContent.hospital = res.data.result[0];
        console.log("hospital", res.data);
      });
    await axios
      .request({
        url: `http://localhost:1234/api/v1/record/${record.record_id}/doctor_record`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then((res) => {
        resultContent.doctorRecord = res.data.result;
        console.log("hospital", res.data);
      });
    console.log("resultContent", resultContent);
    setRecord(resultContent.record);
    setPatient(resultContent.patient);
    setHospital(resultContent.hospital);
    setDoctorRecord(resultContent.doctorRecord);
    // setContent(resultContent);
  };

  useEffect(() => {
    if (pulled == 0) {
      fetchData();
      pulled = 1;
      console.log("pull");
      console.log("patient", patient);
      setRefetch(false);
    }
  }, [refetch]);

  console.log("all", record);

  return (
    <Box sx={{ height: 2000, flexWrap: "wrap", display: "flex" }}>
      <Grid container>
        <Grid item xs={9}>
          <Container sx={{ height: 2000 }}>
            <Box sx={{ textAlign: "center", mb: 4, mt: 2 }}>
              <Typography variant="h6">MEDICAL RECORD: ID {id}</Typography>
            </Box>
            <Box>
              <Paper>
                <Container maxWidth="md">
                  <Box sx={{ width: "100%" }}>
                    {console.log("?", patient)}
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      I. Administration
                    </Typography>
                    {patient && (
                      <Box>
                        <Typography>
                          First Name: {patient.first_name}
                        </Typography>
                        <Typography>Last Name: {patient.last_name}</Typography>
                        <Typography>
                          Date of Birth:{" "}
                          {getFormatedTime(new Date(patient.dob))}
                        </Typography>
                        <Typography>Gender: {patient.gender}</Typography>
                        <Typography>Address: {patient.address}</Typography>
                        <Typography>Phone: {patient.phone}</Typography>
                        <Typography>
                          Employment: {patient.employment}
                        </Typography>
                        <Typography>
                          Work place: {patient.work_place}
                        </Typography>
                      </Box>
                    )}

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      II. Hospital
                    </Typography>
                    {hospital && (
                      <Box>
                        <Typography>Name: {hospital.hospital_name}</Typography>
                        <Typography>Province: {hospital.province}</Typography>
                        <Typography>Address: {hospital.address}</Typography>
                      </Box>
                    )}

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      III. Doctor Records
                    </Typography>
                    {doctorRecord &&
                      doctorRecord.map((record: any, index: any) => (
                        <Box key={index}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Doctor Record {index + 1}:
                          </Typography>
                          <Typography>Disease: {record.disease}</Typography>
                          <Typography>
                            Pathological Process: {record.pathological_process}
                          </Typography>
                          <Typography>
                            Examination: {record.examination}
                          </Typography>
                          <Typography>
                            Medicine Name: {record.med_name}
                          </Typography>
                          <Typography>Quantity: {record.quantity}</Typography>
                          <Typography>
                            Date Ordered: {record.date_ordered}
                          </Typography>
                          <Typography>
                            Instruction: {record.instruction}
                          </Typography>
                        </Box>
                      ))}
                    {/* {medicalRecord.doctor_records.map((doctorRecord, index) => (
                      <div key={index}>
                        <Typography>
                          Doctor Name: {doctorRecord.doctor_name}
                        </Typography>
                        <Typography>
                          Notes: {doctorRecord.notes}
                        </Typography>
                        <Typography>
                          Prescription: {doctorRecord.prescription}
                        </Typography>
                      </div>
                    ))} */}

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      IV. Bill
                    </Typography>
                    {bill && (
                      <Box>
                        <Typography>
                          Payment Type: {bill.payment_type}
                        </Typography>
                        <Typography>
                          Insurance Payment: ${bill.insurance_payment}
                        </Typography>
                        <Typography>Total Cost: ${bill.total_price}</Typography>
                        <Typography>
                          Payment Date:
                          {getFormatedTime(new Date(bill.payment_date))}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Container>
              </Paper>
            </Box>
          </Container>
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              flexWrap: "wrap",
              display: "flex",
              justifyContent: "space-evenly",
              flexDirection: "column",
              mt: 3,
            }}
          >
            <Typography>
              Type:{" "}
              <span style={{ color: record.type == "dead" ? "red" : "green" }}>
                {record.type}
              </span>
            </Typography>
            <Typography>
              Status:{" "}
              <span
                style={{
                  color: record.status == "pending" ? "orange" : "green",
                }}
              >
                {record.status}
              </span>{" "}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => {
                axios
                  .request({
                    url: `http://localhost:1234/api/v1/record/submit/${record.record_id}`,
                    method: "PUT",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json;charset=UTF-8",
                    },
                  })
                  .then((res) => {
                    setRefetch(true);
                  });
              }}
            >
              Submit Record
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
