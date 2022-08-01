import express from "express";
import { Client } from "../entities/Client";
import { Transaction, TransactionTypes } from "../entities/Transaction";
import { createQueryBuilder } from "typeorm";

const router = express.Router();

const createTransactionRouter = router.post(
  "/api/client/:clientId/transaction",
  async (req, res) => {
    const { clientId } = req.params;
    const { type, amount } = req.body;

    const client = await Client.findOne({ where: { id: Number(clientId) } });

    if (!client) {
      return res.json({
        msg: "client not found",
      });
    }

    const transaction = Transaction.create({
      amount,
      type,
      client,
    });

    await transaction.save();

    if (type === TransactionTypes.DEPOSIT) {
      client.balance = client.balance + amount;
    } else if (type === TransactionTypes.WITHDRAW) {
      client.balance = client.balance - amount;
    }

    await client.save();

    return res.json({
      msg: "transaction is added",
      transaction,
    });
  }
);

const fetchTransactionsRouter = router.get(
  "/api/client/:clientId/transaction/:transactionId",
  async (req, res) => {
    const { transactionId } = req.params;
    const { clientId } = req.params;

    const selectedTransaction = await createQueryBuilder("transactions")
      .select("transactions.type")
      .addSelect("transactions.amount")
      .from(Transaction, "transactions")
      .leftJoinAndSelect("transactions.client", "client")
      .where("transactions.client_id = :uid AND transactions.id = :tid ", {
        uid: Number(clientId),
        tid: Number(transactionId),
      })
      .getMany();

    return res.json(selectedTransaction);
  }
);

export {
  createTransactionRouter as createTransactionRouter,
  fetchTransactionsRouter as fetchTransactionsRouter,
};
