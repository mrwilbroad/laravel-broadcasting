import React, { useState } from "react";
import { Table, Button, Spinner, ProgressBar } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { WebSocketEcho } from "@/bootstrap";
import AlertMessage from "@/Components/AlertMessage";
import { UserColumns } from "@/Components/Table/Users/Columns";
import DataTableComponent from "@/Components/Table/DataTableComponent";

const index = () => {
    const initialD = {
        filename: "",
    };

    const { userList, total_users, flash } = usePage().props;
    const { success } = flash;

    const [exportProgress, setExportProgress] = useState({
        message: "",
        show: {
            progress: false,
            alert: false,
        },
        type: "success",
        percentage: 0,
    });

    const HandleSubmit = (values, otherprops) => {
        setExportProgress({
            ...exportProgress,
            message: "Please wait while processing...",
            show: {
                alert: true,
                progress: true,
            },
            percentage: 1,
        });

        router.visit("/exports", {
            method: "post",
            data: values,
            preserveState: true,
            onError: (er) => {
                for (const e in er) {
                    otherprops.setFieldError(e, er[e]);
                }
                setExportProgress({
                    ...exportProgress,
                    message: "Something went wrong ...",
                    type: "danger",
                    show: {
                        alert: true,
                        progress: false,
                    },
                });
            },
            onFinish: () => {
                otherprops.setSubmitting(false);
            },
        });
    };

    const ExportToExcell = () => {
        router.get("/exports/exportdata");
    };

    useEffect(() => {
        const SocketChannel = WebSocketEcho.channel("JobImportAnalysis");
        SocketChannel.listen("JobAnalysisEvent", (event) => {
            setExportProgress({
                ...exportProgress,
                percentage: event.progress,
                type: event.output.messageType,
                message: event.output.message,
                show: {
                    progress: event.output.messageType === "success",
                    alert: true,
                },
            });
        });

        return () => {
            SocketChannel.stopListening("JobAnalysisEvent");
        };
    }, []);

    return (
        <div className="container mt-4 vstack gap-2">
            <h5>Excell export data</h5>

            <AlertMessage
                type={exportProgress.type}
                show={exportProgress.show.alert}
            >
                <section>
                    <strong>{exportProgress.message}</strong>
                </section>
            </AlertMessage>

            <section className="col-lg-4 col-md-7 col-sm-7">
                {exportProgress.show.progress && (
                    <section className="my-2">
                        <small>Export Progress</small>
                        <ProgressBar
                            animated
                            variant="success"
                            now={exportProgress.percentage}
                            label={`${exportProgress.percentage}%`}
                        />
                    </section>
                )}

                <section className="vstack gap-3">
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
                                    <ErrorMessage
                                        name="filename"
                                        component="small"
                                        className="text-danger"
                                    />
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
                    <Link
                        className=""
                        preserveState
                        preserveScroll
                        href="/exports/delete-all"
                    >
                        <button className="btn btn-danger col-lg-10 ">
                            Truncate Data
                        </button>
                    </Link>
                </section>
            </section>

            <section>
                {success && (
                    <section>
                        <strong className="text-success">{success}</strong>
                    </section>
                )}
            </section>

            <DataTableComponent Data={userList} Columns={UserColumns} />
            {/* <Table striped bordered responsive hover>
                <caption className="caption-top">
                    <section className="hstack gap-3">
                        <button
                            onClick={ExportToExcell}
                            className="btn btn-success"
                        >
                            Export to Excell
                        </button>
                        <button
                            disabled
                            onClick={ExportToExcell}
                            className="btn btn-primary"
                        >
                            Export to PDF
                        </button>

                        <button className="btn btn-success">
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
            </Table> */}
        </div>
    );
};

export default index;
