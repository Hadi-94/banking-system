import express from "express";
import { Client } from "../entities/Client";
import { createQueryBuilder } from "typeorm";

export const clientRouter = express.Router();

clientRouter.post("/api/client", async (req, res) => {
  const { firstName, lastName, email, cardNumber, balance } = req.body;

  const client = Client.create({
    first_name: firstName,
    last_name: lastName,
    email,
    card_number: cardNumber,
    balance,
  });

  await client.save();
  return res.json(client);
});

clientRouter.delete("/api/client/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const client = await Client.delete(Number(clientId));

  return res.json({
    msg: "Client is removed successfully",
    client,
  });
});

clientRouter.get("/api/clients", async (req, res) => {
  const client = await createQueryBuilder("client")
    .select("client.first_name")
    .addSelect("client.last_name")
    .addSelect("client.balance")
    .from(Client, "client")
    .leftJoinAndSelect("client.transactions", "transactions")
    .where("client.balance >= :minBalance AND client.balance <= :maxBalance", {
      minBalance: 10200,
      maxBalance: 10250,
    })
    .getMany();

  return res.json(client);
});
