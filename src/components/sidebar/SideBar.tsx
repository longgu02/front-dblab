import {
  Box,
  Container,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  SelectChangeEvent,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { Hospital } from "../interfaces";

export default function SideBar(props: {
  value: any;
  setValue: (arg0: any) => void;
}) {
  const [hospitals, setHospitals] = useState<Array<Hospital>>([]);
  const [selectedHospital, setSelectedHospital] = useState<
    Hospital | undefined
  >();
  const { value, setValue } = props;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  useEffect(() => {
    axios({
      url: `http://localhost:1234/api/v1/hospital`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      // data: {
      //   name: 'David',
      //   age: 45
      // }
    }).then((res: any) => {
      setHospitals(res.data.result);
      console.log(res.data.result);
    });
  }, []);
  return (
    <Box
      sx={{
        width: 300,
        minHeight: 500,
        // backgroundColor: "#21c34f",
        position: "sticky",
      }}
    >
      <Container>
        {/* Query & feature */}
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Hospitals</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel value={-1} control={<Radio />} label="All" />
            {hospitals &&
              hospitals.map((hospital) => (
                <FormControlLabel
                  value={hospital.hospital_id}
                  control={<Radio />}
                  label={hospital.hospital_name}
                />
              ))}
          </RadioGroup>
        </FormControl>
      </Container>
    </Box>
  );
}
