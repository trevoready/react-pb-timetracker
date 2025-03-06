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
import { use } from "react";

const Timesheet = () => {
  const { currentUser } = useAuth();
  // State to store time entries
  const [timeEntries, setTimeEntries] = useState([]);
  const [workplaces, setWorkplaces] = useState(null);
  const [isWorkplaceSelected, setIsWorkplaceSelected] = useState(false);
  const [totalMonthlyHours, setTotalMonthlyHours] = useState(0);
  const workplaceRef = React.useRef();

  // Initial values for the form
  const initialValues = {
    startTime: "",
    endTime: "",
    notes: "",
  };

  // Validation schema
  const validationSchema = Yup.object({
    startTime: Yup.string().required("Start time is required"),
    endTime: Yup.string().required("End time is required"),
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
    notes: Yup.string().max(200, "Max 200 characters"),
  });

  // Form submission handler
  const handleSubmit = (values, { resetForm }) => {
    console.log("Timesheet Data:", values);
    //create date objects
    const startTime = new Date(`${values.startDate} ${values.startTime}`);
    const endTime = new Date(`${values.endDate} ${values.endTime}`);
    //make sure the end time is greater than the start time
    if (endTime < startTime) {
      alert("End time must be greater than start time");

      return false;
    }
    //calculate the difference in hours
    const hours = (endTime - startTime) / 1000 / 60 / 60;
    //add the new entry to the list
    console.log(hours);
    client
      .collection("time_entries")
      .create({
        user: currentUser.id,
        workplace: workplaceRef.current.value,
        start_time: startTime,
        end_time: endTime,
        notes: values.notes,
        total_hours: hours,
      })
      .then((res) => {
        console.log(res);
        //set workplace name to the selected workplace
        client
          .collection("workplaces")
          .getOne(workplaceRef.current.value)
          .then((res2) => {
            res.workplace = res2.name;
            setTimeEntries([...timeEntries, res]);
          });
      });
    resetForm();
  };

  useEffect(() => {
    client
      .collection("workplaces")
      .getFullList()
      .then((res) => {
        setWorkplaces(res);
      });
  }, []);
  useEffect(() => {
    //get entryies for the selected workplace
    if (isWorkplaceSelected) {
      //GET START OF THE MONTH
      const startDate = new Date();
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      //GET END OF THE MONTH
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      client
        .collection("time_entries")
        .getFullList({
          expand: "workplace",
          filter:
            "workplace='" +
            workplaceRef.current.value +
            "'&&start_time>='" +
            startDate.toISOString() +
            "' && start_time<='" +
            endDate.toISOString() +
            "'", //filter by selected workplace and current month
          sort: "start_time",
        })
        .then((res) => {
          //convert to local time
          res.forEach((entry) => {
            entry.start_time = new Date(entry.start_time).toLocaleString();
            entry.end_time = new Date(entry.end_time).toLocaleString();
            entry.workplace = entry.expand.workplace.name;
          });
          //calculate total hours
          const totalHours = res.reduce(
            (acc, entry) => acc + entry.total_hours,
            0
          );
          setTotalMonthlyHours(totalHours);
          setTimeEntries(res);
        });
    }
  }, [isWorkplaceSelected]);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Timesheet</h2>

      {/* Timesheet Entry Form */}
      <Card className="p-4 shadow mb-4">
        <h4 className="mb-3">Log Work Hours</h4>
        <BootstrapForm.Group className="mb-3">
          <BootstrapForm.Label>Workplace</BootstrapForm.Label>
          <BootstrapForm.Select
            ref={workplaceRef}
            name="workplace"
            onChange={(e) => {
              setIsWorkplaceSelected(true);
            }}
          >
            <option value="">Select Workplace</option>
            {workplaces &&
              workplaces.map((workplace) => (
                <option key={workplace.id} value={workplace.id}>
                  {workplace.name}
                </option>
              ))}
          </BootstrapForm.Select>
        </BootstrapForm.Group>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnMount={true}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                {isWorkplaceSelected && (
                  <>
                    <Row>
                      <Col>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Start Date</BootstrapForm.Label>
                          <Field
                            name="startDate"
                            type="date"
                            as={BootstrapForm.Control}
                          />
                          <ErrorMessage
                            name="startDate"
                            component="div"
                            className="text-danger small"
                          />
                        </BootstrapForm.Group>
                      </Col>
                      <Col>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Start Time</BootstrapForm.Label>
                          <Field
                            name="startTime"
                            type="time"
                            as={BootstrapForm.Control}
                          />
                          <ErrorMessage
                            name="startTime"
                            component="div"
                            className="text-danger small"
                          />
                        </BootstrapForm.Group>
                      </Col>
                      <Col>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>End Date</BootstrapForm.Label>
                          <Field
                            name="endDate"
                            type="date"
                            as={BootstrapForm.Control}
                          />
                          <ErrorMessage
                            name="endDate"
                            component="div"
                            className="text-danger small"
                          />
                        </BootstrapForm.Group>
                      </Col>
                      <Col>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>End Time</BootstrapForm.Label>
                          <Field
                            name="endTime"
                            type="time"
                            as={BootstrapForm.Control}
                          />
                          <ErrorMessage
                            name="endTime"
                            component="div"
                            className="text-danger small"
                          />
                        </BootstrapForm.Group>
                      </Col>
                    </Row>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>
                        Notes (Optional)
                      </BootstrapForm.Label>
                      <Field
                        name="notes"
                        as={BootstrapForm.Control}
                        placeholder="Additional details"
                      />
                      <ErrorMessage
                        name="notes"
                        component="div"
                        className="text-danger small"
                      />
                    </BootstrapForm.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-100"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Entry"}
                    </Button>
                  </>
                )}
              </Form>
            );
          }}
        </Formik>
      </Card>

      {/* Display Time Entries */}
      <Card className="p-4 shadow">
        <Row>
          <Col>
            <h4 className="mb-3">Timesheet Records</h4>
            <p className="text-muted">
              Total Monthly Hours: {totalMonthlyHours}
            </p>
          </Col>
          <Col className="text-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsWorkplaceSelected(false)}
            >
              View All
            </Button>
          </Col>
        </Row>
        {timeEntries.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Workplace</th>
                <th>Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.start_time}</td>
                  <td>{entry.end_time}</td>
                  <td>{entry.workplace}</td>
                  <td>{entry.total_hours}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        client
                          .collection("time_entries")
                          .delete(entry.id)
                          .then(() => {
                            setTimeEntries(
                              timeEntries.filter((item) => item.id !== entry.id)
                            );
                          })
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-muted">No entries yet.</p>
        )}
      </Card>
    </Container>
  );
};

export default Timesheet;
