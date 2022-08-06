import React from "react";
import ApiUrl from "../../services/Api";
import axios from "axios";

function SubmitData(endPoint, Data) {
  const data = axios.post(`${ApiUrl}/${endPoint}`, Data).then(
    (response) => {
      return response.data.status;
    },
    (err) => {
      alert(err.response.data.message);
    }
  );
  return data;
}
export default SubmitData;
