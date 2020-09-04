module.exports = {
    up(db) {
        return db.createCollection('templates', {
            capped: false,
            autoIndexId: true,
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["name", "intitule", "organisme", "logo"],
                    properties: {
                        name: {
                            bsonType: 'string'
                        },
                        intitule: {
                            bsonType: 'string'
                        },
                        organisme: {
                            bsonType: 'string'
                        },
                        logo: {
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
        return db.collection('templates').drop()
    }
}
