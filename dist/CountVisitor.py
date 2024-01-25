import boto3
import json

# Connect to DynamoDB
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("VisitorCount")

def lambda_handler(event, context):
    try:
        response = table.update_item(
            Key={"visitor_id": "1"}, # Specify the primary key of the item to be updated
            UpdateExpression="SET view_count = view_count + :val", # Define the update expression
            ExpressionAttributeValues={':val': 1}, # Provide the values for expression placeholders
            ConditionExpression="attribute_exists(visitor_id)", # Set a condition for the update to occur
            ReturnValues="UPDATED_NEW" # Specify which item attributes to return after the update
        )

        updated_count = int(response['Attributes']['view_count'])
        return {
            "statusCode": 200,
            "body": json.dumps({"view_count": updated_count}),
            "headers": {
                'Content-Type': 'application/json',
            }
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": 'Invalid request body'}),
            "headers": {
                'Content-Type': 'application/json',
            }
        }

