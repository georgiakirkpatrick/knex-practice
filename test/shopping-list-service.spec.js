const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')
const { expect } = require('chai')

describe(`Shopping list service object`, function() {

    let db
    let testShoppingList = [
        {
            id: 1,
            name: 'fist shopping list item', 
            price: "10.01", 
            category: 'Snack', 
            checked: false,
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 2,
            name: 'second shopping list item', 
            price: "11.02", 
            category: 'Lunch', 
            checked: true,
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 3,
            name: 'third shopping list item', 
            price: "15.03", 
            category: 'Main', 
            checked: false,
            date_added: new Date('2029-01-22T16:28:32.615Z')
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    // before(() => {
    //     return db
    //         .into('shopping_list')
    //         .insert(testShoppingList)
    // })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testShoppingList)
        })

        it(`getAllGroceries() resolves all groceries from 'shopping_list' table`, () => {
            const expectedItems = testShoppingList.map(item => ({
                ...item,
                checked: false,
            }));
            // test that shopping-list-service.getAllGroceries gets data from table
            return ShoppingListService.getAllGroceries(db)
                .then(actual => {
                    expect(actual).to.eql(testShoppingList)
                })
        })

        it(`getById() resoves an item by id from 'shopping_list' table`, () => {
            const idToGet = 3;
            const thirdItem = testShoppingList[idToGet - 1]

            return ShoppingListService.getById(db, idToGet)
                .then(actual => {
                    expect(actual).to.eql({
                        id: idToGet,
                        name: thirdItem.name,
                        date_added: thirdItem.date_added,
                        price: thirdItem.price,
                        category: thirdItem.category,
                        checked: false,
                    })
                })
        })

        it(`updateGroceryItem() updates an item from the 'shopping_list' table`, () => {
                    const idOfItemToUpdate = 3
                    const newItemData = {
                        name: 'updated grocery item',
                        price: '99.99',
                        date_added: new Date(),
                        checked: true,
                    }
                    const originalItem = testShoppingList[idOfItemToUpdate - 1]
                    return ShoppingListService.updateGroceryItem(db, idOfItemToUpdate, newItemData)
                        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                        .then(item => {
                            expect(item).to.eql({
                                id: idOfItemToUpdate,
                                ...originalItem,
                                ...newItemData,
                            })
                        })
        })

        it(`deleteGroceryItem() removes an item by id from 'shopping_list' table`, () => {
            const idToDelete = 3;
            return ShoppingListService.deleteGroceryItem(knex, idToDelete)
                .then(() => ShoppingListService.getAllGroceries(db))
                .then(allItems => {
                    const expected = testShoppingList
                        .filter(item => item.id !== idToDelete)
                        .map(item => ({
                            ...item,
                            checked: false
                        }))
                        expect(allItems).to.eql(expected)
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllGroceries() resolves an empty array`, () => {
            return ShoppingListService.getAllGroceries(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
    

        it(`insertGroceries() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'Test new name name',
                price: '5.05',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: true,
                category: 'Lunch',
            }
            return ShoppingListService.insertGroceries(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category,
                    })
                })
        })
    })
})