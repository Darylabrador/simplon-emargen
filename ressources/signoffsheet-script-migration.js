module.exports = {
    up(db) {
        return db.createCollection('signoffsheets', {
            capped: false,
            autoIndexId: true,
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['subject', 'quota', 'choices', 'nbVote', 'participants', 'createdBy', 'visibility', 'status'],
                    properties: {
                        urlSheet: {
                            bsonType: 'string'
                        },
                        name: {
                            bsonType: 'string'
                        },
                        templateId: {
                            bsonType: 'objectId'
                        },
                        learners: {
                            bsonType: 'array'
                        },
                        days: {
                            bsonType: 'array',
                        },
                        trainers: {
                            bsonType: 'array',
                        },
                        timeStart: {
                            bsonType: 'string'
                        },
                        timeEnd: {
                            bsonType: 'string'
                        },
                        version: {
                            bsonType: 'int',
                        },
                        fileExist: {
                            bsonType: 'bool'
                        }
                    }
                },
            },
            validationLevel: 'strict',
            validationAction: 'error',
        })
    },
    down(db) {
        return db.collection('signoffsheets').drop()
    }
}
