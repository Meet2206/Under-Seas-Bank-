export default function Card({ title, value }) {

    return (

        <div className="card">

            <h4>{title}</h4>

            <h2 style={{ marginTop: "10px" }}>{value}</h2>

        </div>

    )

}