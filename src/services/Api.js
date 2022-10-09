import axios from "axios";

const demo1 = localStorage.getItem("authenticate");
let x = JSON.parse(demo1);

// Local

const ApiUrl = `http://192.168.0.179:8080/api`;

// Staging backend
// const ApiUrl = `https://www.stageapi-acharyainstitutes.in/api`;

axios.interceptors.request.use(
  (config) => {
    config.headers.authorization = `Bearer  ${x.token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default ApiUrl;

// import axios from "axios";

// const ApiUrl = "http://192.168.0.179:8080/api";
// const TOKEN = localStorage.getItem("authenticate");
// const x=

// console.log(TOKEN);

// // export const userRequest = axios.create({

// // });

// export default ApiUrl;

// import axios from "axios";

// const ApiUrl = "http://192.168.0.179:8080/api";
// const TOKEN = () => {
//   if (
//     JSON.parse(JSON.parse(localStorage.getItem("authenticate")).user)
//       .currentUser.accessToken
//   ) {
//     return JSON.parse(JSON.parse(localStorage.getItem("authenticate")).user)
//       .currentUser.accessToken;
//   } else {
//     return "";
//   }
// };
// console.log(TOKEN);

// export const publicRequest = axios.create({
//   baseURL: ApiUrl,
// });

// export const userRequest = axios.create({
//   baseURL: ApiUrl,
//   headers: { token: `Bearer ${TOKEN}` },
// });
// export default ApiUrl;
