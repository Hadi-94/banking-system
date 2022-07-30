import express, { Router } from "express";
import { Client } from "../entities/Client";

const router = express.Router();

router.delete("/api/client/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const client = await Client.delete(Number(clientId));

  return res.json({
    msg: "Client is removed successfully",
    client,
  });
});

export { router as deleteClientRouter };
