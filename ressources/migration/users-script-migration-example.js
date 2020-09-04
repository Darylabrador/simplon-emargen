module.exports = {
    up(db) {
        return db.createCollection('users', {
            capped: false,
            autoIndexId: true,
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["promoId", "name", "surname", "email", "password", "role", "firstConnection", "signImage", "resetToken"],
                    properties: {
                        promoId: {
                            bsonType: 'objectId'
                        },
                        name: {
                            bsonType: 'string'
                        },
                        surname: {
                            bsonType: 'string'
                        },
                        email: {
                            bsonType: 'string'
                        },
                        password: {
                            bsonType: 'string'
                        },
                        role: {
                            bsonType: 'string'
                        },
                        firstConnection: {
                            bsonType: 'bool'
                        },
                        signImage: {
                            bsonType: 'string'
                        },
                        resetToken: {
                            bsonType: 'string'
                        }
                    }
                }
            },
            validationLevel: 'strict',
            validationAction: 'error',
        })
    },
    down(db) {
        return db.collection('users').drop()
    }
}
