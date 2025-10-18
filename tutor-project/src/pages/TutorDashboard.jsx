import { Outlet } from "react-router-dom";
import { TutorSideNav } from "../components/TutorSideNav";
import { Header } from "../components/Header";
import './TutorDashboard.css';

export function TutorDashboard() {
    return (
        <>
        <Header />
        <div className="tutor-dashboard">
            <TutorSideNav />
            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
        </>
    );
}