describe('Visit Test', () => {
  it('should visit my website', () => {
    cy.visit('http://milos-dev.com')
  })
})

describe('DynamoDB Update Test', () => {
  it('should update the DynamoDB database and return the updated value', () => {
    cy.visit('http://milos-dev.com');

    const requestBody = {
      "visitor_id": "1",
    };

    // Get the initial DynamoDB value
    cy.request({
      method: 'POST',
      url: 'https://6m2c753lrh.execute-api.us-east-2.amazonaws.com/CountVisitor',
      body: requestBody,
    }).its('body.view_count').as('initialDynamoDBValue');

    // Trigger the API request to update DynamoDB
    cy.request({
      method: 'POST',
      url: 'https://6m2c753lrh.execute-api.us-east-2.amazonaws.com/CountVisitor',
      body: requestBody,
    });

    // Verify that the updated value is greater than the initial value
    cy.get('@initialDynamoDBValue').then((initialValue) => {
      cy.request({
        method: 'POST',
        url: 'https://6m2c753lrh.execute-api.us-east-2.amazonaws.com/CountVisitor',
        body: requestBody,
      }).its('body.view_count').should('be.gt', initialValue);
    });
  });
});


