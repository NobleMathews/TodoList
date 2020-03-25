const APIURL = "http://localhost:3000";
export const getquestions = async () => {
  const res = await fetch(`${APIURL}/ms`);
  return res.json();
};
// export const addquestion = async data => {
//   const response = await fetch(`${APIURL}/questions`, {
//     method: "POST",
//     mode: "cors",
//     cache: "no-cache",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   });
//   return response.json();
// };