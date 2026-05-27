import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

export default function MainLayout({ children, title, subtitle }) {

    return (

        <div className="app-layout">

            <Sidebar />

            <div className="app-main">

                <Header title={title} subtitle={subtitle} />

                <div className="app-content">
                    {children}
                </div>

            </div>

        </div>

    )

}