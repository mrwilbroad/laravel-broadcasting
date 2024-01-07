import React from "react";

import DataTable from "react-data-table-component";
import SearchComponent from "@/Components/Table/SearchComponent";
// due to dependencies issues , style componet v5.0.0 work fine..

const DataTableComponent = ({ Columns = [], Data = [], title = "" }) => {
    return (
        <DataTable
            data={Data}
            columns={Columns}
            title={title}
            fixedHeader
            persistTableHead
            direction="auto"
            fixedHeaderScrollHeight="300px"
            responsive
            pagination
            subHeader
            subHeaderWrap
            subHeaderComponent={<SearchComponent />}
            paginationPerPage={3}
            paginationRowsPerPageOptions={[3, 5, 10]}
            dense
            selectableRows
            selectableRowsVisibleOnly
            selectableRowsHighlight
            pointerOnHover
            striped
            subHeaderAlign="right"
        />
    );
};

export default DataTableComponent;
