import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import MainContent from "../../components/layout/MainContent";

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
                    display: "flex",
                    flex: 1,
                }}
            >
                <Sidebar />

                <MainContent />
            </div>
        </div>
    );
}

export default Dashboard;