import React, { useState } from "react";
import { Table, Button, Spinner, ProgressBar } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { WebSocketEcho } from "@/bootstrap";
import AlertMessage from "@/Components/AlertMessage";

const index = () => {
    const initialD = {
        filename: "",
    };

    const { userList, total_users } = usePage().props;
    const [exportProgress, setExportProgress] = useState({
        message: "",
        show: {
            progress: false,
            alert: false
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
                progress: true
            },
            percentage: 1,
        })

        router.visit("/exports", {
            method: "post",
            data: values,
            preserveState: true,
            onFinish: () => {
                console.log("FINIS")
                otherprops.setSubmitting(false);
                
            },
        });
    };

    const ExportToExcell = () => {
        router.get("/exports/exportdata");
    };

    useEffect(() => {
        const SocketChannel = WebSocketEcho.channel("JobImportAnalysis");
        SocketChannel.listen("JobAnalysisEvent", (event)=> {
            setExportProgress({
                ...exportProgress,
                percentage: event.progress,
                type: event.output.messageType,
                message: event.output.message,
                show: {
                    progress: event.output.messageType === 'success',
                    alert: true
                }
            })
        })

        return ()=> {
            SocketChannel.stopListening("JobAnalysisEvent");
        }

    }, []);

    return (
        <div className="container mt-4 vstack gap-2">
            <h5>Excell export data</h5>

            <AlertMessage type={exportProgress.type} show={exportProgress.show.alert}>
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
            </Table>
        </div>
    );
};

export default index;
