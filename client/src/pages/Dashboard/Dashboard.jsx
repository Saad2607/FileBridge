import Navbar from "../../components/layout/Navbar";
import MainContent from "../../components/layout/MainContent";
import DashboardOverview from "../../components/dashboard/DashboardOverview";

function Dashboard() {

    return (

        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >

            <Navbar />

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                }}
            >

                <DashboardOverview />

                <MainContent />

            </div>

        </div>

    );

}

export default Dashboard;