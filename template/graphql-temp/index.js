import "dotenv/config";
import express from "express";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";
import createGraphqlServer from "./graphql/index.js";

async function init() {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(
        "/graphql",
        expressMiddleware(await createGraphqlServer(), {
            context: async ({ req }) => {
                
                return { validAuth: true };
            },
        }),
    );

    app.listen(process.env.PORT, () => console.log(`Server running at ${process.env.PORT}....`));
}

init();
