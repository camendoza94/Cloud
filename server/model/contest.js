const params = {
    TableName: "Contests",
    KeySchema: [
        {AttributeName: "url", KeyType: "HASH"},
    ],
    AttributeDefinitions: [
        {AttributeName: "url", AttributeType: "S"},
        {AttributeName: "userId", AttributeType: "S"},
        {AttributeName: "name", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    GlobalSecondaryIndexes: [{
        IndexName: "UserIdIndex",
        KeySchema: [
            {
                AttributeName: "userId",
                KeyType: "HASH",
            },
            {
                AttributeName: "name",
                KeyType: "RANGE",
            }
        ],
        Projection: {
            ProjectionType: "ALL"
        },
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    }]
};

module.exports = params;