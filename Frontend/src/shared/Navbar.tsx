
import { useSelector, useDispatch } from "react-redux";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import type { RootState } from "../store/TaskAppStore";
import { logout } from "../feature/login/LoginAuthSlice";

export default function Navbar() {
    const { user } = useSelector((state: RootState) => state.AppAuth);
    const dispatch = useDispatch();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Task Manager
                </Typography>
                {user ? (
                    <>
                        <Typography sx={{ mr: 2 }}>Hi, {user.username}</Typography>
                        <Button color="inherit" onClick={() => dispatch(logout())}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}
