import express from "express";
import { Client } from "../entities/Client";
import { Banker } from "../entities/Banker";

export const bankersRouter = express.Router();

bankersRouter.post("/api/banker", async (req, res) => {
  const { firstName, lastName, email, cardNumber, employeeNumber } = req.body;

  const banker = Banker.create({
    first_name: firstName,
    last_name: lastName,
    email,
    card_number: cardNumber,
    employee_number: employeeNumber,
  });

  await banker.save();
  return res.json(banker);
});

bankersRouter.delete("/api/banker/:bankerId", async (req, res) => {
  const { bankerId } = req.params;
  const banker = await Banker.delete(Number(bankerId));

  return res.json({
    msg: "Banker is removed successfully",
  });
});

bankersRouter.put(
  "/api/banker/:bankerId/client/:clientId",
  async (req, res) => {
    const { bankerId, clientId } = req.params;
    const client = await Client.findOne({ where: { id: Number(clientId) } });
    const banker = await Banker.findOne({ where: { id: Number(bankerId) } });

    if (!banker || !client) {
      return res.json({
        msg: "Banker or Client not found",
      });
    }

    banker.clients = [client];

    await banker.save();

    return res.json({
      msg: "Banker connected to Client",
    });
  }
);
