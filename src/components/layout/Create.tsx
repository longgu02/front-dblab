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
  InputAdornment,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
} from "@mui/material";
import { useState, useEffect } from "react";
import SideBar from "../sidebar/SideBar";
import axios from "axios";
import { PatientInfo } from "../interfaces";
import MedicalRecordsCard from "../RecordCard";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";

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
const INPUT = [
  {
    label: "Insurance",
    attribute: {
      patient_id: "id",
      policy_number: "string",
      start_date: "date",
      end_date: "date",
    },
  },
  {
    label: "Patient",
    attribute: {
      first_name: "string",
      last_name: "string",
      gender: "select",
      dob: "date",
      phone: "string",
      address: "string",
      employment: "string",
      work_place: "string",
    },
  },
  {
    label: "Record",
    attribute: { patient_id: "id", hospital_id: "id", bill_id: "id" },
  },
  {
    label: "Bill",
    attribute: {
      payment_date: "date",
      payment_type: "select",
      insurance_payment: "number",
      total_price: "number",
    },
  },
  {
    label: "Hospital",
    attribute: {
      hospital_name: "string",
      province: "string",
      address: "string",
      capacity: "number",
    },
  },
  {
    label: "Doctor_Record",
    attribute: {
      record_id: "id",
      doctor_id: "id",
      prescript_id: "id",
      examination: "long",
      disease: "string",
      pathological_process: "long",
    },
  },
  {
    label: "Prescript",
    attribute: {
      med_name: "string",
      quantity: "number",
      date_ordered: "date",
      instruction: "long",
    },
  },
  {
    label: "Doctor",
    attribute: {
      first_name: "string",
      last_name: "string",
      specialization: "string",
    },
  },
];

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

export default function Create() {
  const [listToggle, setListToggle] = useState<boolean>(false);
  const { id } = useParams();
  const [record, setRecord] = useState<Array<Patient> | undefined>();
  const [value, setValue] = useState("Record");
  const [selectedPatient, setSelectedPatient] = useState<
    PatientInfo | undefined
  >();
  const [body, setBody] = useImmer({});
  console.log(body);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  console.log(
    Object.keys(INPUT.filter((input) => input.label == value)[0]["attribute"])
  );

  const options = {
    url: `http://localhost:1234/api/v1/record/${id}`,
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
  useEffect(() => {
    console.log("useEffect");
    axios(options).then((response) => {
      setRecord(response.data.result);
      console.log(response.data.result);
    });
  }, []);

  const handleSubmit = () => {
    axios({
      url: `http://localhost:1234/api/v1/${value.toLowerCase()}/create`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: body,
    }).then((res) => {
      console.log(res.data);
    });
  };

  return (
    <Box sx={{ height: 2000, flexWrap: "wrap", display: "flex" }}>
      <Grid container>
        <Grid item xs={9}>
          <Container sx={{ height: 2000 }}>
            <Box sx={{ textAlign: "center", mb: 4, mt: 2 }}>
              <Typography variant="h6">CREATE</Typography>
            </Box>
            <Box>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Type</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="row-radio-buttons-group"
                  value={value}
                  onChange={handleChange}
                >
                  {INPUT.map((input) => (
                    <FormControlLabel
                      value={input.label}
                      control={<Radio />}
                      label={input.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              {Object.keys(
                INPUT.filter((input) => input.label == value)[0]["attribute"]
              ).map((item) => (
                <TextField
                  label={item}
                  id="outlined-start-adornment"
                  sx={{ m: 1, width: "25ch" }}
                  onChange={(e) => {
                    setBody((draft: any) => {
                      draft[item as keyof typeof draft] = e.target.value;
                    });
                  }}
                />
              ))}
              {/* {INPUT.map((input) => {
                if (input.label == value) {
                  Object.keys(input.attribute).map((item) => (
                    <TextField
                      label={item}
                      id="outlined-start-adornment"
                      sx={{ m: 1, width: "25ch" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">kg</InputAdornment>
                        ),
                      }}
                    />
                  ));
                }
              })} */}
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
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
