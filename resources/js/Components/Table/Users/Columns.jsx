export const UserColumns = [
    {
        name: "id",
        selector: row=>row.id,
        sortable: true
    },
    {
        name: "Name",
        selector: row=>row.name,
        sortable: true
    },
    {
        name: "Email Address",
        selector: row=>row.email,
        sortable: true
    },
    {
        name: "Joined at",
        selector: row=>row.created_at,
        sortable: true
    },
];
