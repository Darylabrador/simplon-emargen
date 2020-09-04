module.exports = {
    up(db) {
        return db.createCollection('assigns', {
            capped: false,
            autoIndexId: true,
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["userId", "signoffsheetId", "signLink", "qrcode", "alreadySign"],
                    properties: {
                        userId: {
                            bsonType: 'objectId'
                        },
                        signoffsheetId: {
                            bsonType: 'objectId'
                        },
                        signLink: {
                            bsonType: 'string'
                        },
                        qrcode: {
                            bsonType: 'string'
                        },
                        alreadySign: {
                            bsonType: 'bool'
                        }
                    }
                }
            },
            validationLevel: 'strict',
            validationAction: 'error',
        })
    },
    down(db) {
        return db.collection('assigns').drop()
    }
}
