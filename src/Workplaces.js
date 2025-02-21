import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Container,
  Card,
  Table,
  Button,
  Form as BootstrapForm,
  Row,
  Col,
} from "react-bootstrap";
import { useEffect } from "react";
import client from "./pbconn";
import { useAuth } from "./contexts/AuthContext";

const Workplaces = () => {
  const { currentUser } = useAuth();
  const [workplaces, setWorkplaces] = useState(null);
  useEffect(() => {
    client
      .collection("workplaces")
      .getFullList()
      .then((res) => {
        console.log(res);
        setWorkplaces(res);
      });
  }, []);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Workplaces</h2>
      <Card className="p-4 shadow mb-4">
        <h4 className="mb-3">Add Workplace</h4>
        <Formik
          initialValues={{ name: "" }}
          validationSchema={Yup.object({
            name: Yup.string().required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            client.collection("workplaces").create({
              user: currentUser.id,
              name: values.name,
            });
            setWorkplaces([...workplaces, values]);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>Name</BootstrapForm.Label>
                <Field
                  name="name"
                  type="text"
                  as={BootstrapForm.Control}
                  placeholder="Enter workplace name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger small"
                />
              </BootstrapForm.Group>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Add
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
      <Card className="p-4 shadow mb-4">
        <h4 className="mb-3">Workplaces</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {workplaces &&
              workplaces.map((workplace) => (
                <tr key={workplace.id}>
                  <td>{workplace.name}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default Workplaces;
