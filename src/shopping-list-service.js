const ShoppingListService = {
    getAllGroceries(knex) {
        // return Promise.resolve('all the articles!!')
        return knex.select('*').from('shopping_list')
    },

    insertGroceries(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    
    getById(knex, id) {
        return knex.from('shopping_list').select('*').where('id', id).first()
    },

    updateGroceryItem(knex, id, newGroceryItemFields) {
        return knex('shopping_list')
            .where({ id })
            .update(newGroceryItemFields)
    },

    deleteGroceryItem(knex, id) {
        return knex('shopping_list')
            .where({ id })
            .delete()
    }
}

module.exports = ShoppingListService;