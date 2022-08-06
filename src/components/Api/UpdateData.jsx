import React from "react";
import ApiUrl from "../../services/Api";
import axios from "axios";

export default function UpdateData(endPoint, Data, id) {
  let data = axios.put(`${ApiUrl}/${endPoint}/${id}`, Data).then((response) => {
    return response.data.status;
  });
  return data;
}
