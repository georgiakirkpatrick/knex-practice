require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

console.log('knex and driver installed correctly');

function getAllItemsThatContainText(searchTerm) {
    knexInstance
        .select('name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

getAllItemsThatContainText('facon')

function getAllItemsPaginated(pageNumber) {
    const productsPerPage = 6
    const offset = productsPerPage * (pageNumber - 1)
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(results => {
            console.log(results)
        })
}

getAllItemsPaginated(2)

function getAllItemsAfterDate(daysAgo) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('date_added', 
            '>',
            knexInstance.raw(`now() - '?? daysAgo'::INTERVAL`, daysAgo)
        )
        .then(results => {
            console.log(results)
        })
}

getAllItemsAfterDate(5)

function getTotalCostsOfEachCategory() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log('COST PER CATEGORY')
            console.log(result)
        })
}

getTotalCostsOfEachCategory()