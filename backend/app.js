const express = require("express")
require("dotenv").config();

const app = express();


app.get("/weather/:city", async (req, res) => {
    const { city } = req.params;
    try {
        const res = await fetch(`url?1=${city}&id=${process.env.API_KEY}`);
        if (!res.oK) {
            throw new Error("Failed to fetch");
        }
        const data = await res.json();
        res.json({
            success: true,
            city,
            data
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Surver Running...");
})