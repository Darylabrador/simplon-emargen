module.exports = {
    async up(db, client) {
        return db.createCollection('users', {
            capped: false,
            autoIndexId: true,
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            bsonType: 'string'
                        },
                        password: {
                            bsonType: 'string'
                        }
                    },
                },
            },
            validationLevel: 'strict',
            validationAction: 'error',
        })
    },

    async down(db, client) {
        return await db.collection('users').drop()
    }
};
