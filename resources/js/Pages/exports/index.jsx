import React from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { useEffect } from "react";
import { router, usePage } from "@inertiajs/react";

const index = () => {
    const initialD = {
        filename: "",
    };

    const { userList,total_users } = usePage().props;

    const HandleSubmit = (values, otherprops) => {
        router.visit("/exports", {
            method: "post",
            data: values,
            onFinish: ()=> {
                otherprops.setSubmitting(false);
            }
        });

    };

    const ExportToExcell = () => {
    router.get("/exports/exportdata");
    };

    useEffect(() => {
        console.log();
    }, []);

    return (
        <div className="container mt-4 vstack gap-2">
            <h5>Excell export data</h5>

            <section className="col-lg-4 col-md-7 col-sm-7">
                <Formik initialValues={initialD} onSubmit={HandleSubmit}>
                    {(formik) => {
                        return (
                            <Form
                                datatype="multipart/form-data"
                                className="vstack gap-3"
                            >
                                <Field
                                    className="form-control"
                                    type="file"
                                    name="filename"
                                >
                                    {({ form, field }) => {
                                        const { setFieldValue } = form;
                                        return (
                                            <input
                                                name="filename"
                                                type="file"
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        e.target.name,
                                                        e.target.files[0]
                                                    )
                                                }
                                                className="form-control"
                                            />
                                        );
                                    }}
                                </Field>
                                <section>
                                    <Button
                                        type="submit"
                                        variant="success"
                                        disabled={formik.isSubmitting}
                                    >
                                        Upload file
                                        {formik.isSubmitting && (
                                            <Spinner
                                                animation="border"
                                                variant="light"
                                                role="status"
                                                size="sm"
                                            />
                                        )}
                                    </Button>
                                </section>
                            </Form>
                        );
                    }}
                </Formik>
            </section>
            <Table striped bordered responsive hover>
                <caption className="caption-top">
                    <section className="hstack gap-3">
                        <button
                            onClick={ExportToExcell}
                            className="btn btn-success"
                        >
                            Export to Excell
                        </button>
                        <button
                            className="btn btn-success"
                        >
                          {total_users}
                        </button>
                    </section>
                </caption>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Fullname</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map(
                        (user, index) =>
                            index < 10 && (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                </tr>
                            )
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default index;
