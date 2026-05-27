import { useEffect, useState } from "react"
import { getMe } from "../services/api"


export default function Header({ title, subtitle }) {

    const [user, setUser] = useState(null)

    useEffect(() => {

        const load = async () => {

            try {

                const data = await getMe()
                setUser(data)

            } catch (err) {

                console.log(err)

            }

        }

        load()

    }, [])


    const getInitials = (name) => {

        if (!name) return "UB"

        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

    }


    return (

        <div className="header">

            <div className="header-left">
                <h3>{title || "Underseas Bank"}</h3>
                {subtitle && <p>{subtitle}</p>}
            </div>

            <div className="header-right">

                {/* Notification Bell */}
                <div className="header-notif">
                    <svg viewBox="0 0 24 24">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <div className="header-notif-badge"></div>
                </div>

                {/* User Info */}
                <div className="header-user">

                    <div className="header-avatar">
                        {getInitials(user?.name)}
                    </div>

                    <div className="header-user-info">
                        <p>{user?.name || "User"}</p>
                        <span>Customer</span>
                    </div>

                </div>

            </div>

        </div>

    )

}