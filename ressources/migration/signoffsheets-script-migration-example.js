module.exports = {
    up(db) {
        return db.createCollection('signoffsheets', {
            capped: false,
            autoIndexId: true,
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["templateId", "promoId", "urlSheet", "name", "learners", "days", "trainers", "timeStart", "timeEnd", "version", "versionningHistory", "fileExist", "signLocation"],
                    properties: {
                        templateId: {
                            bsonType: 'objectId'
                        },
                        promoId: {
                            bsonType: 'objectId'
                        },
                        urlSheet: {
                            bsonType: 'string'
                        },
                        name: {
                            bsonType: 'string'
                        },
                        learners: {
                            bsonType: 'array'
                        },
                        days: {
                            bsonType: 'array'
                        },
                        trainers: {
                            bsonType: 'array'
                        },
                        timeStart: {
                            bsonType: 'string'
                        },
                        timeEnd: {
                            bsonType: 'string'
                        },
                        version: {
                            bsonType: 'int'
                        },
                        versionningHistory: {
                            bsonType: 'array'
                        },
                        fileExist: {
                            bsonType: 'bool'
                        },
                        signLocation: {
                            bsonType: 'array'
                        }
                    }
                }
            },
            validationLevel: 'strict',
            validationAction: 'error',
        })
    },
    down(db) {
        return db.collection('signoffsheets').drop()
    }
}
