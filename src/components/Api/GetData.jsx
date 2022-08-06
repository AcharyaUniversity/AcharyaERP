import React from "react";
import ApiUrl from "../../services/Api";
import axios from "axios";

function GetData(endPoint, id) {
  let data = axios.get(`${ApiUrl}/${endPoint}/${id}`).then((response) => {
    return response.data.data;
  });
  return data;
}
export default GetData;
