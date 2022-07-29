import express from "express"
import {Client} from "../entities/Client"
import {createQueryBuilder} from "typeorm"
const router = express.Router()


router.get('/api/clients', async (req, res) =>{
    const client = await createQueryBuilder(
        'client'
    ).select('client.first_name')
    .addSelect('client.last_name')
    .addSelect('client.balance')
    .from(Client, 'client')
    .leftJoinAndSelect(
        'client.transactions',
        'transactions'
    )
    .where('client.balance >= :minBalance AND client.balance <= :maxBalance', {minBalance: 10200, maxBalance: 10250})
    .getMany()


    return res.json(client)
    

})

export {router as fetchClientsRouter}

