import { Request, Response } from 'express';
import knex from '../database/connection';
class ItemController{
    async index(req: Request, res: Response) {
        const items = await knex('items').select('*');
        
        const serialAlized = items.map( item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.15.7:3333/uploads/${item.image}`
            }
        })
            return res.json(serialAlized)
    }
}

export default ItemController;