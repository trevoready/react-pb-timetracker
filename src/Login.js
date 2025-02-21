import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Container,
  Card,
  Button,
  Form as BootstrapForm,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const initialValues = { email: "", password: "" };
  const { currentUser, signin, logout } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Login Data:", values);
    try {
      signin(values.email, values.password);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Welcome Back!</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>Email</BootstrapForm.Label>
                <Field
                  name="email"
                  type="email"
                  as={BootstrapForm.Control}
                  placeholder="Enter email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger small"
                />
              </BootstrapForm.Group>

              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>Password</BootstrapForm.Label>
                <Field
                  name="password"
                  type="password"
                  as={BootstrapForm.Control}
                  placeholder="Enter password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger small"
                />
              </BootstrapForm.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center mt-3">
                <small>
                  Don't have an account? <Link to="/register">Register</Link>
                </small>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

export default Login;
