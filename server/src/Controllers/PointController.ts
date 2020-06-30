import { Request, Response, query } from 'express';
import knex from '../database/connection';


class PontController {

    async index(req: Request, res: Response){
        const { city, uf, items } = req.query;

        const parseItems = String(items)
        .split(',')
        .map(item => Number(item.trim()))

        const search = await knex('points')
        .join('point_items', 'points.id' , '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parseItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')

        const serialAlized = search.map( point => {
            return {
                ...point,
                image_url: `http://192.168.15.7:3333/uploads/${point.image}`
            }
        })

        return res.json(serialAlized)
    }

    async show(req: Request, res: Response){
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return res.status(400).json({message: 'Point not found'})
        }

        const serialalizedPoint = {
                ...point,
                image_url: `http://192.168.15.7:3333/uploads/${point.image}`
        }

        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title');
        
        return res.json({point: serialalizedPoint, items});

    }


async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;
        
        const data = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }
        const tr = await knex.transaction();
    const insertId = await tr('points').insert(data);
    const point_id = insertId[0];
    
    const pointItems = items.split(',')
    .map((item: String) => Number(item.trim()))
    .map((item_id: Number) => {
        return {
            point_id,
            item_id,
        };
    });
    
    
    await tr('point_items').insert(pointItems);

    await tr.commit();
    
    return res.json({
        id: point_id,
        ...data
    });
    }


}
export default PontController;