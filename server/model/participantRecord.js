const params = {
    TableName: "Records",
    KeySchema: [
        {AttributeName: "id", KeyType: "HASH"}
    ],
    AttributeDefinitions: [
        {AttributeName: "id", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 3,
        WriteCapacityUnits: 3
    },
    GlobalSecondaryIndexes: [{
        IndexName: "ContestIdIndex",
        KeySchema: [
            {
                AttributeName: "contestId",
                KeyType: "HASH"
            },
            {
                AttributeName: "state",
                KeyType: "range"
            }
        ],
        Projection: {
            ProjectionType: "ALL"
        },
        ProvisionedThroughput: {
            ReadCapacityUnits: 7,
            WriteCapacityUnits: 7
        }
    }]
};

module.exports = params;