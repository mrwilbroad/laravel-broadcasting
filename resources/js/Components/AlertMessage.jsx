import React from "react";
import { Alert } from "react-bootstrap";

const AlertMessage = ({ show = false, type = "success", children }) => {
    return (
        <div>
            <Alert show={show} variant={type} dismissible>
                <section>{children}</section>
            </Alert>
        </div>
    );
};

export default AlertMessage;
