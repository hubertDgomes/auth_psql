import { con } from "../config/dbConnector.js"

const editMe = async (req, res) => {
    const userId = req.user.id
    const { is_available, last_donation_date, health_notes } = req.body

    try {
        const result = await con.query(`
            update users
            set is_available = COALESCE($1, is_available),
                last_donation_date = COALESCE($2, last_donation_date),
                health_notes       = COALESCE($3, health_notes)
            where id = $4
            RETURNING id, is_available, last_donation_date, health_notes
            `, [is_available, last_donation_date, health_notes, userId])
        res.json(result.rows[0])

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' })
    }
}

export default editMe