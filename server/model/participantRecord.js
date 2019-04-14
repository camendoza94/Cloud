const params = {
    TableName: "Records",
    KeySchema: [
        {AttributeName: "id", KeyType: "HASH"}
    ],
    AttributeDefinitions: [
        {AttributeName: "id", AttributeType: "S"},
        {AttributeName: "contestId", AttributeType: "S"},
        {AttributeName: "state", AttributeType: "S"}
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
                KeyType: "RANGE"
            }
        ],
        Projection: {
            ProjectionType: "ALL"
        },
        BillingMode: "PAY_PER_REQUEST"
    }]
};

module.exports = params;