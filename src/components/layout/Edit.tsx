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
    attribute: {
      patient_id: "id",
      hospital_id: "id",
      bill_id: "id",
      status: "string",
      type: "string",
    },
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

export default function Edit() {
  const [listToggle, setListToggle] = useState<boolean>(false);
  const [id, setId] = useState<Number>();
  const [record, setRecord] = useState<Array<Patient> | undefined>();
  const [value, setValue] = useState("Record");
  const [selectedPatient, setSelectedPatient] = useState<
    PatientInfo | undefined
  >();
  const [body, setBody] = useImmer({
    patient_id: null,
    first_name: null,
    last_name: null,
    gender: null,
    dob: null,
    phone: null,
    ethnic: null,
    address: null,
    employment: null,
    work_place: null,
    hospital_id: null,
    hospital_name: null,
    province: null,
    capacity: null,
    record_id: null,
    transfer_hospital: null,
    bill_id: null,
    type: null,
    created_time: null,
    status: null,
    insurance_id: null,
    policy_number: null,
    start_date: null,
    end_date: null,
    doctor_id: null,
    specialization: null,
    payment_date: null,
    payment_type: null,
    insurance_payment: null,
    total_price: null,
    prescript_id: null,
    med_name: null,
    quantity: null,
    date_ordered: null,
    instruction: null,
  });
  console.log("UseImmer", body);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
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

  useEffect(() => {}, [value]);

  const handleSubmit = () => {
    console.log(
      `http://localhost:1234/api/v1/${value.toLowerCase()}/${id}/update`
    );

    axios({
      url: `http://localhost:1234/api/v1/${value.toLowerCase()}/${id}/update`,
      method: "PUT",
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
              <Typography variant="h6">EDIT</Typography>
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
              <TextField
                label="id"
                id="outlined-start-adornment"
                sx={{ m: 1, width: "25ch" }}
                onChange={(e) => {
                  setId(Number(e.target.value));
                  axios({
                    url: `http://localhost:1234/api/v1/${value.toLowerCase()}/${
                      e.target.value
                    }`,
                    method: "GET",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json;charset=UTF-8",
                    },
                    data: body,
                  })
                    .then((res) => {
                      const matchedValue = INPUT.find(
                        (item: any) => item.label == value
                      );
                      const attributes = matchedValue?.attribute;
                      console.log(res.data.result);
                      setBody((draft: any) => {
                        Object.keys(res.data.result[0]).map((key) => {
                          console.log(res.data.result[0][key]);
                          console.log(
                            attributes &&
                              attributes[key as keyof typeof attributes] ==
                                "date"
                          );

                          if (
                            attributes &&
                            attributes[key as keyof typeof attributes] == "date"
                          ) {
                            draft[key] = getFormatedTime(
                              new Date(res.data.result[0][key])
                            );
                          } else {
                            draft[key] = res.data.result[0][key];
                          }
                        });
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      setBody((draft) => {
                        draft.patient_id = null;
                        draft.first_name = null;
                        draft.last_name = null;
                        draft.gender = null;
                        draft.dob = null;
                        draft.phone = null;
                        draft.ethnic = null;
                        draft.address = null;
                        draft.employment = null;
                        draft.work_place = null;
                        draft.hospital_id = null;
                        draft.hospital_name = null;
                        draft.province = null;
                        draft.capacity = null;
                        draft.record_id = null;
                        draft.transfer_hospital = null;
                        draft.bill_id = null;
                        draft.type = null;
                        draft.created_time = null;
                        draft.status = null;
                        draft.insurance_id = null;
                        draft.policy_number = null;
                        draft.start_date = null;
                        draft.end_date = null;
                        draft.doctor_id = null;
                        draft.specialization = null;
                        draft.payment_date = null;
                        draft.payment_type = null;
                        draft.insurance_payment = null;
                        draft.total_price = null;
                        draft.prescript_id = null;
                        draft.med_name = null;
                        draft.quantity = null;
                        draft.date_ordered = null;
                        draft.instruction = null;
                      });
                    });
                }}
              />
              {Object.keys(
                INPUT.filter((input) => input.label == value)[0]["attribute"]
              ).map((item) => (
                <Box>
                  <Typography>{item}</Typography>
                  <TextField
                    id="outlined-start-adornment"
                    sx={{ m: 1, width: "25ch" }}
                    value={body[item as keyof typeof body]}
                    onChange={(e) => {
                      setBody((draft: any) => {
                        draft[item as keyof typeof draft] = e.target.value;
                      });
                    }}
                  />
                </Box>
              ))}
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
