import app from "./app/app.js";
import config from "./config/config.js";
import dbConnection from "./config/db.js";

try {
    // 1. Try to connect to the database first
    await dbConnection();

    // 2. If successful, start the server
    app.listen(config.PORT, () => {
        console.log(`Database connected successfully. Server is live on PORT ${config.PORT}`);
    });

} catch (error) {
    // 3. If the database fails, log the exact error so you can fix it
    console.error("Failed to start server because database connection failed:");
    console.error(error);
}