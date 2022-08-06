import { React, useState } from "react";
import ApiUrl from "../../services/Api";
import axios from "axios";
function Grid(endPoint, sort) {
  var data = axios
    .get(`${ApiUrl}/${endPoint}?page=${0}&page_size=${100}&sort=${sort}`)
    .then((Response) => {
      return Response.data.data.Paginated_data.content;
    });
  return data;
}
export default Grid;
