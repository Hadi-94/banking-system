import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { Client } from "./entities/Client";
import { Banker } from "./entities/Banker";
import { Transaction } from "./entities/Transaction";
import {
  createClientRouter,
  deleteClientRouter,
  fetchClientsRouter,
} from "./routes/users_route";
import {
  createBankerRouter,
  deleteBankerRouter,
  connectBankerToClientRouter,
} from "./routes/bankers_route";
import {
  createTransactionRouter,
  fetchTransactionsRouter,
} from "./routes/transactions_route";

const app = express();

const main = async () => {
  try {
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, {
      entities: [Client, Banker, Transaction],
    });

    await createConnection(connectionOptions);

    console.log("Connected to Postgres");

    app.use(express.json());
    app.use(createClientRouter);
    app.use(createBankerRouter);
    app.use(createTransactionRouter);
    app.use(connectBankerToClientRouter);
    app.use(deleteClientRouter);
    app.use(deleteBankerRouter);
    app.use(fetchTransactionsRouter);
    app.use(fetchClientsRouter);

    app.listen(8080, () => {
      console.log("Now running on port 8080");
    });
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to Postgres DB");
  }
};

main();
