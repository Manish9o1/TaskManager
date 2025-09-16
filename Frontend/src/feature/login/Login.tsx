import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api/TaskManagerApis";
import type { LoginRequest } from "../../shared/model";
import { setCredentials } from "./LoginAuthSlice";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();
    const [form, setForm] = useState<LoginRequest>({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login(form).unwrap();
            dispatch(setCredentials({ token: result.result.token, user: result.result.user }));
            console.log({ token: result.result.token, user: result.result.user });
            navigate("/");
        } catch {
            alert("Login failed");
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
            <Typography variant="h5" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    margin="normal"
                    value={form.email}
                    onChange={handleChange}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={form.password}
                    onChange={handleChange}
                />
                <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </Button>
            </form>
        </Paper>
    );
}
