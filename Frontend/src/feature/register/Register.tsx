import React, { useState } from "react";
import { Box, Button, MenuItem, Paper, TextField, Typography, } from "@mui/material";
import { useRegisterMutation } from "../../api/TaskManagerApis";

export default function Register() {
    const [register] = useRegisterMutation();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(0); // 0 for USER, 1 for ADMIN

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ username, email, password, role }).unwrap();
            alert("User registered successfully");
            setUsername("");
            setEmail("");
            setPassword("");
            setRole(0);
        } catch (err) {
            alert("Registration failed");
            console.error(err);
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
            <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
                <Typography variant="h5" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value === "1" ? 1 : 0)}
                        required
                    >
                        <MenuItem value={0}>USER</MenuItem>
                        <MenuItem value={1}>ADMIN</MenuItem>
                    </TextField>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Register
                    </Button>
                </form>
            </Box>
        </Paper>
    );
}
