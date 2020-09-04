module.exports = {
    up(db) {
        return db.createCollection('yeargroups', {
            capped: false,
            autoIndexId: true,
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["label"],
                    properties: {
                        label: {
                            bsonType: 'string'
                        },
                    }
                }
            },
            validationLevel: 'strict',
            validationAction: 'error',
        })
    },
    down(db) {
        return db.collection('yeargroups').drop()
    }
}
