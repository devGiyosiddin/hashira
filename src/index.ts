import "dotenv/config";
import express from "express";
import uploadRoutes from './routes/upload.routes.ts';

const app = express();
app.use('/api', uploadRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});