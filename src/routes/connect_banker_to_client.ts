import express from "express";
import { Client } from "../entities/Client";
import { Banker } from "../entities/Banker";

const router = express.Router();

router.put("/api/banker/:bankerId/client/:clientId", async (req, res) => {
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
});

export { router as connectBankerToClientRouter };
