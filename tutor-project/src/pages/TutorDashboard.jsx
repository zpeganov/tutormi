import { Outlet } from "react-router-dom";
import { SideNav } from "../components/SideNav";
import { Header } from "../components/Header";
import './StudentDashboard.css';

export function TutorDashboard() {
    return (
        <>
        <Header />
        <div className="student-dashboard">
            <SideNav />
            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
        </>
    );
}