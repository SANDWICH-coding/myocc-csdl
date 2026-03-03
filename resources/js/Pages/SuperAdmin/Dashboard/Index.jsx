import AppLayout from '../../../Layouts/AppLayout';

export default function Dashboard({
    auth,
}) {

    const user = auth?.user;

    return (
        <AppLayout user={user} breadcrumbs={["Dashboard"]}>
            <div className="container px-3 py-4 space-y-6">

            </div>
        </AppLayout>
    );
}