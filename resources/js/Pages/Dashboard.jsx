import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { WebSocketEcho } from "@/bootstrap";

export default function Dashboard({ auth }) {
    const [Message, setMessage] = useState("");
    const { totaluser } = usePage().props;
    const [showAlert, SetShowAlert] = useState(false);

    // listen to any changes
    useEffect(() => {
        const NotificationChannel = WebSocketEcho.channel("notification");
        NotificationChannel.listen("DocumentEvent", (event) => {
            router.visit("/dashboard", {
                preserveScroll: true,
                preserveState: true,
                method: "get",
                onSuccess: (e) => {
                    console.log(e);
                },
                onFinish: () => {
                    setMessage("Process complete");
                },
            });
        });
        return () => {
            NotificationChannel.stopListening("DocumentEvent");
        };
    }, []);

    const HandleSub = (e) => {
        e.preventDefault();

        router.visit("/dashboard", {
            method: "post",
            preserveScroll: true,
            preserveState: true,
            onSuccess: ({ props }) => {
                const { flash } = props;
                const { success } = flash;
                SetShowAlert(true);
                setMessage(success);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                        <section className="ms-3">
                            <button className="btn btn-primary" type="button">
                                Total user : {totaluser}
                            </button>
                        </section>
                        {Message && (
                            <section className="m-2 col-5">
                                <Alert
                                    show={showAlert}
                                    onClose={() => SetShowAlert(!showAlert)}
                                    variant="success"
                                    dismissible
                                >
                                    <strong>{Message}</strong>
                                </Alert>
                            </section>
                        )}

                        <form className="p-4" onSubmit={HandleSub}>
                            <button type="submit" className="btn btn-success">
                                Send broadcasting test
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
