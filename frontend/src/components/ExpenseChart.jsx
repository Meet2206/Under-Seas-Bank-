import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { getAnalytics } from "../services/api"


const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]


export default function ExpenseChart() {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const load = async () => {

            try {

                const result = await getAnalytics()

                // Backend returns expense data — adapt to chart format
                if (Array.isArray(result)) {
                    setData(result)
                } else if (result.expenses) {
                    setData(result.expenses)
                }

            } catch (err) {

                console.log("Analytics not available:", err.message)

            } finally {

                setLoading(false)

            }

        }

        load()

    }, [])


    if (loading) return <p>Loading chart...</p>

    if (data.length === 0) return <p>No expense data available</p>


    return (

        <PieChart width={350} height={300}>

            <Pie
                data={data}
                dataKey="value"
                nameKey="category"
                outerRadius={100}
            >

                {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}

            </Pie>

            <Tooltip />

        </PieChart>

    )

}