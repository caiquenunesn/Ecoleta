import Knex from 'knex';

export async function seed(knex: Knex){
    await knex('items').insert([
        { title:  'Lâmpadas', image: 'lampadas.svg'},
        { title:  'Pilhas e Bateria', image: 'baterias.svg'},
        { title:  'Papeis e Papelão', image: 'papeis-papelao.svg'},
        { title:  'Residuos Eletrônicos', image: 'eletronicos.svg'},
        { title:  'Residous Orgânicos', image: 'organicos.svg'},
        { title:  'Óleo de Cozinha', image: 'oleo.svg'},
    ])
}