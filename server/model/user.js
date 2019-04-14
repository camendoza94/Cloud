const params = {
    TableName: "Users",
    KeySchema: [
        {AttributeName: "email", KeyType: "HASH"},
    ],
    AttributeDefinitions: [
        {AttributeName: "email", AttributeType: "S"},
    ],
    BillingMode: "PAY_PER_REQUEST"
};

module.exports = params;