import { React, useState } from "react";
import ApiUrl from "../../services/Api";
import axios from "axios";

export default function ActivateInactiveApi(endPoint, id) {
  var data = axios.delete(`${ApiUrl}/${endPoint}/${id}`).then((Response) => {
    return Response.data.status;
  });
  return data;
}
