import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { useAuth } from "../context/AuthContext";

const AuthForm = ({ mode }) => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const isLogin = mode === "login";

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Kullanıcı adı gerekli"),
            password: Yup.string().required("Şifre gerekli"),
            ...(isLogin
                ? {}
                : {
                    confirmPassword: Yup.string()
                        .oneOf([Yup.ref("password"), null], "Şifreler eşleşmeli")
                        .required("Şifre tekrar gerekli"),
                }),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                if (isLogin) {
                    const res = await AuthService.login({
                        username: values.username,
                        password: values.password,
                    });
                    login(res.data.token);

                    const decoded = jwtDecode(res.data.token);
                    const userRole = decoded.role;

                    if (userRole === "ADMIN") {
                        navigate("/admin");
                    } else {
                        navigate("/panel");
                    }
                } else {
                    await AuthService.register({
                        username: values.username,
                        password: values.password,
                    });
                    alert("Kayıt başarılı! Giriş yapabilirsiniz.");
                    navigate("/login");
                }
            } catch (error) {
                setErrors({ submit: error.response?.data?.message || "Hata oluştu" });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, border: "1px solid #ccc", borderRadius: 2 }}
        >
            <Typography variant="h5" mb={3} textAlign="center">
                {isLogin ? "Giriş Yap" : "Kayıt Ol"}
            </Typography>

            <TextField
                fullWidth
                id="username"
                name="username"
                label="Kullanıcı Adı"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                margin="normal"
            />

            <TextField
                fullWidth
                id="password"
                name="password"
                label="Şifre"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                margin="normal"
            />

            {!isLogin && (
                <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Şifre Tekrar"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    margin="normal"
                />
            )}

            {formik.errors.submit && (
                <Typography color="error" mt={1} textAlign="center">
                    {formik.errors.submit}
                </Typography>
            )}

            <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
                {isLogin ? "Giriş Yap" : "Kayıt Ol"}
            </Button>
        </Box>
    );
};

export default AuthForm;
