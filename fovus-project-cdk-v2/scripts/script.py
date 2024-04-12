import json
import boto3

# Function to get inputs from DynamoDB based on ID
def get_inputs_from_dynamodb(id):
    # Initialize DynamoDB client
    client = boto3.client('dynamodb')
    
    # Retrieve item from DynamoDB table by ID
    response = client.get_item(
        TableName='FileUploadTableV2',
        Key={'id': {'S': id}},
        ProjectionExpression='input_text, input_file_path'  # Include inputFile attribute
    )
    
    # Extract input text and input file from the response
    input_text = response['Item']['input_text']['S']
    input_file_uri = response['Item']['input_file_path']['S']
    
    # Extract filename from S3 URI
    input_file = input_file_uri.split('/')[-1]  # Get the last part of the URI as the filename
    
    return {'input_text': input_text, 'input_file_path': input_file}


# Function to download input file from S3
def download_input_file_from_s3(bucket, input_file):
    s3 = boto3.client('s3')
    s3.download_file(bucket, input_file, '/home/ec2-user/input.txt')

# Function to append retrieved input text to input file
def append_input_text_to_file(input_text):
    with open('/home/ec2-user/input.txt', 'a') as file:
        file.write("File Content: " + input_text + "\n")

# Function to upload output file to S3
def upload_output_file_to_s3(bucket):
    s3 = boto3.client('s3')
    s3.upload_file('/home/ec2-user/output.txt', bucket, 'output.txt')

# Main function
def main(id, bucket):
    # Get inputs from DynamoDB
    inputs = get_inputs_from_dynamodb(id)

    # Download input file from S3
    download_input_file_from_s3(bucket, inputs['input_file_path'])

    # Append retrieved input text to input file
    append_input_text_to_file(inputs['input_text'])

    # Rename the input file to the output file
    import os
    os.rename('/home/ec2-user/input.txt', '/home/ec2-user/output.txt')

    # Upload output file to S3
    upload_output_file_to_s3(bucket)

# Call the main function with arguments: ID, S3 Bucket Name
if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python script.py <Json>")
        sys.exit(1)
    
    # Parse input JSON
    value = json.loads(sys.argv[1])
    
    # Call the main function with ID and S3 Bucket Name
    main(value['id'], value['bucket'])


#rupesh=$(echo '{"id":"1e7f959a-310b-47c4-bfda-fc998179f583","bucket":"1229544838-fovus-bucket-v2"}')