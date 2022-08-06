import React from "react";
import ApiUrl from "../../services/Api";
import axios from "axios";

function fetchData(endPoint) {
  var data = axios.get(`${ApiUrl}/${endPoint}`).then((response) => {
    return response.data;
  });
  return data;
}
export default fetchData;
