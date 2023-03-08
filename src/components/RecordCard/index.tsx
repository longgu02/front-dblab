import { Card, CardContent, Typography, Box } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

type MedicalRecord = {
  record_id: number;
  created_time: string;
  hospital_id: number;
  patient_id: Number;
};

type Props = {
  medicalRecords: MedicalRecord[];
  setRecord: any;
};

const MedicalRecordsCard: React.FC<Props> = ({ medicalRecords }) => {
  return (
    <>
      {medicalRecords.map((record) => (
        <Card
          key={record.record_id}
          variant="outlined"
          style={{ marginBottom: "1rem" }}
        >
          <CardContent>
            <Link to={`/record/${record.record_id}`}>
              <Typography variant="h5" component="h2">
                Record ID: {record.record_id}
              </Typography>
            </Link>
            <Typography color="textSecondary" gutterBottom>
              {`Patient ID: ${record.patient_id}`}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Created Time: {record.created_time}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Hospital ID: {record.hospital_id}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default MedicalRecordsCard;
