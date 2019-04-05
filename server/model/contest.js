const params = {
    TableName: "Contests",
    KeySchema: [
        {AttributeName: "url", KeyType: "HASH"},
    ],
    AttributeDefinitions: [
        {AttributeName: "url", AttributeType: "S"},
        {AttributeName: "userId", AttributeType: "S"}
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
                KeyType: "HASH"
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