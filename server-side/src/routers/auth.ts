import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

 async function getUserData() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

router.post("/login", async (req, res) => {
  const { body } = req;
  const data = await login({ email: body.email, password: body.password });
  if (data) return res.status(201).json(data);
});
router.post("/signup", async (req, res) => {
  const { body } = req;
  const { data, error } = await signup({
    email: body.email,
    password: body.password,
  });
  if (data) return res.status(201).json(data);
  return res.status(401).json(error);
});
router.post("/reset", async (req, res) => {
  const { body } = req;
  const { data, error } = await resetPassword(body["email"]);
  if (data) return res.status(201).json(data);
  return res.status(400).json(error);
});

async function signup({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (data) {
    const user = data.user;
    const newUser = await supabase
      .from("profiles")
      .insert([
        {
          id: user?.id,
          email: email,
          point: 0,
        },
      ])
      .select();
    return newUser;
  }
  return { data, error };
}
//
async function login({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (data && data.user) {
    supabase.auth.setSession({
      access_token: data.session?.access_token!,
      refresh_token: data.session?.refresh_token!,
    });
    const userReq = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user?.id);
    return userReq.data;
  }
  return { data, error };
}
//
async function resetPassword(email: string) {
  return await supabase.auth.resetPasswordForEmail(email);
}

export default router; 