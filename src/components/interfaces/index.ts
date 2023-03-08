export interface PatientInfo {
  patient_id: Number;
  first_name: String;
  last_name: String;
  policy_number: String;
  record_id: Number;
  hospital_id: Number;
  bill_id: Number;
  type: String;
  created_time: Date;
  status: String;
  doctor_record_id: Number;
  examination: String;
  disease: String;
  pathological_process: String;
  prescript_id: Number;
  med_name: String;
  quantity: Number;
  date_ordered: Date;
  instruction: String;
}

export interface Hospital {
  address: String;
  capacity: Number;
  hospital_id: Number;
  hospital_name: String;
  province: String;
}
