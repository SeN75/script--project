// import { NextApiRequest, NextApiResponse } from "next";
// import { supabase } from "lib/supabaseClient";

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<any>
// ) {
//   // if (req["method"] === "POST") return post(req, res);
//   // else if (req["method"] === "GET") return get(req, res);
//   // else if (req["method"] === "DELETE") return remove(req, res);
//   // else if (req["method"] === "PUT" || req["method"] === "PATCH")
//   //   return put(req, res);
//   // return res.status(HttpStatusCode.NotFound);
// }

// //get exercise

// async function get(req: NextApiRequest, res: NextApiResponse) {
//   const { body, query } = req;

//   if (query.model == "exercise") {
//     const { data, error } = await getExercise({
//       user_id: query.user_id + "",
//       exerice_id: query.exercise_id + "",
//     });
//     if (data) return res.status(201).json({ data, status: true });
//     return res.status(400).json({ error, status: false });
//   }
//   //get exercise

//   return res.status(400).json({ message: "not found" });
// }

// async function post(req: NextApiRequest, res: NextApiResponse) {
//     const {body, query} = req;
//     if(query.model == 'exercise') {
//         const {data, error} = await insrtNewRecord({user_id: body.user_id, exerice_id: body.exerice_id})
//         if (data){
//             const user = await supabase.from('profiles').select()
//         };
//         return res.status(400).json({ error, status: false });
//     }
//     return res.status(400).json({ message: "not found" });

// }
// // /api/progress/exercise?user_id&exercise_id
// export async function getExercise({
//   user_id,
//   exerice_id,
// }: {
//   user_id: string;
//   exerice_id: string;
// }) {
//   return await supabase
//     .from("progress")
//     .select()
//     .eq("user_id", user_id)
//     .eq("exerice_id", exerice_id);
// }
// //insert new record when get equal non
// async function insrtNewRecord({
//   user_id,
//   exerice_id,
// }: {
//   user_id: string;
//   exerice_id: string;
// }) {

//     return  await supabase
//     .from("progress")
//     .insert([{ user_id, exerice_id }])
//     .select();
  
// }
