# Klin - Cloud Computing
A brief description of what this project does and who it's for

---

# Cloud Infrastructure
<img src="./assets//klin.png">

---

# API Reference
## Endpoint Routes

| Route                           | HTTP Method | Description                                  |
|---------------------------------|-------------|----------------------------------------------|
| /users                          | GET         | Get all users                                |
| /users/{{idUser}}               | GET         | Get users by Id                              |
| /users                          | POST        | Add user                                     |
| /users/{{idUser}}               | PUT         | Update users                                 |
| /users/{{idUser}}               | DEL         | Delete users                                 |
| /laundry                        | GET         | Get all laundry                              |
| /laundry/{{idLaundry}}          | GET         | Get laundry by Id                            |
| /laundry                        | POST        | Add laundry                                  |
| /laundry/{{idLaundry}}          | PUT         | Update laundry                               |
| /laundry/{{idLaundry}}          | DEL         | Delete laundry                               |
| /transaction                    | GET         | Get all transaction                          |
| /transaction/{{idTransaksi}}    | GET         | Get transaction by Id                        |
| /transaction                    | POST        | Add transaction                              |
| /transaction/{{idTransaksi}}    | PUT         | Update transaction                           |
| /transaction/{{idTransaksi}}    | DEL         | Delete transaction                           |

## Endpoints
All requests to the Users API must include the `x-api-key` header with a valid API key.


### Get All Users

#### `GET /users`

Retrieve information about all users.

##### Request

- Method: GET
- Headers:
  - `x-api-key`: Your API Key

##### Response

- Status Code: 200 OK
- Body:
  - `users`: An array of user objects.

##### Example Response

```json
{
    "users": [
        {
            "users_email": "yodya1532626336262@gmail.com",
            "users_role": "user",
            "users_id": "u1701666978475",
            "firebase_uid": "1wFq80ZwfnTgAAju7pKPSuzdqdY2",
            "users_picture": "https://storage.googleapis.com/klinbangkit2023/users/u1701666978475.jpg",
            "users_name": "Yodya Mahesa",
            "users_phone": "08961012345"
        },
        {
            "users_email": "gintingherisanjaya@gmail.com",
            "users_role": "user",
            "users_name": "Heri",
            "users_id": "u1702048723322",
            "users_phone": "12357900099",
            "firebase_uid": "kJdNqMLEPJeAdJVrDTayCIKkKYt2",
            "users_picture": "https://storage.googleapis.com/klinbangkit2023/users/u1702048723322.png"
        }
    ]
}
```

### Get User by ID

#### `GET /users/{id}`

Retrieve information about a specific user identified by their ID.

##### Request

- Method: GET
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the user

##### Response

- Status Code: 200 OK
- Body: User object

### Create New User

#### `POST /users`

Create a new user.

##### Request

- Method: POST
- Headers:
  - `x-api-key`: Your API Key
- Body Parameters:
  - `users_name`: Name of the user
  - `users_email`: Email of the user
  - `users_phone`: Phone number of the user
  - `users_role`: Role of the user
  - `users_password`: Password for the user
  - `users_picture`: User profile picture (multipart/form-data)

##### Response

- Status Code: 200 OK
- Body:
  - `status`: "success"

### Update User by ID

#### `PUT /users/{id}`

Update information for a specific user identified by their ID.

##### Request

- Method: PUT
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the user
- Body Parameters:
  - `users_name`: Updated name of the user
  - `users_email`: Updated email of the user
  - `users_phone`: Updated phone number of the user
  - `users_role`: Updated role of the user
  - `users_picture`: Updated user profile picture (multipart/form-data)

##### Response

- Status Code: 200 OK
- Body:
  - `status`: "success"

### Delete User by ID

#### `DELETE /users/{id}`

Delete a specific user identified by their ID.

#### Request

- Method: DELETE
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the user

#### Response

- Status Code: 200 OK
- Body:
  - `status`: "success"


## Retrieve All Laundry

Endpoint to retrieve information about all laundry.

#### Request

- Method: GET
- Headers:
  - `x-api-key`: Your API Key

#### Response

- Status Code: 200 OK

#### Example JSON Data Response

```json
{
    "laundry": [
        {
            "laundry_owner": "John Doe",
            "laundry_name": "Clean Clothes",
            "laundry_address": "123 Main Street",
            "laundry_coordinate": "40.7128° N, 74.0060° W",
            "laundry_picture": "https://storage.googleapis.com/your-bucket/laundry/l123456789.jpg",
            "laundry_id": "l123456789"
        },
        {
            "laundry_owner": "Jane Doe",
            "laundry_name": "Fresh Linens",
            "laundry_address": "456 Oak Avenue",
            "laundry_coordinate": "34.0522° N, 118.2437° W",
            "laundry_picture": "https://storage.googleapis.com/your-bucket/laundry/l987654321.png",
            "laundry_id": "l987654321"
        }
    ]
}
```

## Retrieve Specific Laundry

Endpoint to retrieve information about a specific laundry identified by its ID.

#### Request

- Method: GET
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `laundryId`: The ID of the laundry

#### Response

- Status Code: 200 OK
- Body: Laundry object

## Create New Laundry

Endpoint to create a new laundry.

#### Request

- Method: POST
- Headers:
  - `x-api-key`: Your API Key
- Body Parameters:
  - `laundry_owner`: Owner of the laundry
  - `laundry_name`: Name of the laundry
  - `laundry_address`: Address of the laundry
  - `laundry_coordinate`: Coordinates of the laundry
  - `laundry_picture`: Laundry picture (multipart/form-data)

#### Response

- Status Code: 200 OK
- Body:
  - `status`: "success"

## Update Specific Laundry

Endpoint to update information for a specific laundry identified by its ID.

#### Request

- Method: PUT
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the laundry
- Body Parameters:
  - `laundry_owner`: Updated owner of the laundry
  - `laundry_name`: Updated name of the laundry
  - `laundry_address`: Updated address of the laundry
  - `laundry_coordinate`: Updated coordinates of the laundry
  - `laundry_picture`: Updated laundry picture (multipart/form-data)

#### Response

- Status Code: 200 OK
- Body:
  - `status`: "success"

## Delete Specific Laundry

Endpoint to delete a specific laundry identified by its ID.

#### Request

- Method: DELETE
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the laundry

#### Response

- Status Code: 200 OK
- Body:
  - `status`: "success"

---

## Retrieve All Transactions

Endpoint to retrieve information about all transactions.

#### Request

- Method: GET
- Headers:
  - `x-api-key`: Your API Key

#### Response

- Status Code: 200 OK

#### Example JSON Data Response

```json
{
    "transaction": [
        {
            "transaction_user": "John Doe",
            "transaction_laundry": "Clean Clothes",
            "transaction_delivery": "Home Delivery",
            "transaction_laundryType": "Regular",
            "transaction_detail": "Express service",
            "transaction_progress": "Completed",
            "transaction_dateStart": "2023-01-01",
            "transaction_dateEnd": "2023-01-02",
            "transaction_payMethod": "Credit Card",
            "transaction_priceDelivery": 10.0,
            "transaction_priceDiscount": 2.0,
            "transaction_priceTotal": 50.0,
            "transaction_photoStart": "https://storage.googleapis.com/your-bucket/transaction/t123456789_start.jpg",
            "transaction_photoEnd": "https://storage.googleapis.com/your-bucket/transaction/t123456789_end.png",
            "transaction_id": "t123456789"
        },
        {
            "transaction_user": "Jane Doe",
            "transaction_laundry": "Fresh Linens",
            "transaction_delivery": "In-Store Pickup",
            "transaction_laundryType": "Express",
            "transaction_detail": "Next-day service",
            "transaction_progress": "In Progress",
            "transaction_dateStart": "2023-01-03",
            "transaction_dateEnd": "2023-01-04",
            "transaction_payMethod": "Cash",
            "transaction_priceDelivery": 5.0,
            "transaction_priceDiscount": 1.0,
            "transaction_priceTotal": 30.0,
            "transaction_photoStart": "https://storage.googleapis.com/your-bucket/transaction/t987654321_start.jpg",
            "transaction_photoEnd": "https://storage.googleapis.com/your-bucket/transaction/t987654321_end.png",
            "transaction_id": "t987654321"
        }
    ]
}
```

## Retrieve Specific Transaction

Endpoint to retrieve information about a specific transaction identified by its ID.

#### Request

- Method: GET
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the transaction

#### Response

- Status Code: 200 OK
- Body: Transaction object

## Create New Transaction

Endpoint to create a new transaction.

#### Request

- Method: POST
- Headers:
  - `x-api-key`: Your API Key
- Body Parameters:
  - `transaction_user`: User of the transaction
  - `transaction_laundry`: Laundry of the transaction
  - `transaction_delivery`: Delivery method
  - `transaction_laundryType`: Type of laundry service
  - `transaction_detail`: Additional details
  - `transaction_progress`: Progress status
  - `transaction_dateStart`: Start date of the transaction
  - `transaction_dateEnd`: End date of the transaction
  - `transaction_payMethod`: Payment method
  - `transaction_priceDelivery`: Delivery price
  - `transaction_priceDiscount`: Discount applied
  - `transaction_priceTotal`: Total price
  - `transaction_photoStart`: Transaction start photo (multipart/form-data)
  - `transaction_photoEnd`: Transaction end photo (multipart/form-data)

#### Response

- Status Code: 200 OK
- Body:
  - `status`: "success"

## Update Specific Transaction

Endpoint to update information for a specific transaction identified by its ID.

#### Request

- Method: PUT
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the transaction
- Body Parameters:
  - `transaction_user`: Updated user of the transaction
  - `transaction_laundry`: Updated laundry of the transaction
  - `transaction_delivery`: Updated delivery method
  - `transaction_laundryType`: Updated type of laundry service
  - `transaction_detail`: Updated additional details
  - `transaction_progress`: Updated progress status
  - `transaction_dateStart`: Updated start date of the transaction
  - `transaction_dateEnd`: Updated end date of the transaction
  - `transaction_payMethod`: Updated payment method
  - `transaction_priceDelivery`: Updated delivery price
  - `transaction_priceDiscount`: Updated discount applied
  - `transaction_priceTotal`: Updated total price
  - `transaction_photoStart`: Updated transaction start photo (multipart/form-data)
  - `transaction_photoEnd`: Updated transaction end photo (multipart/form-data)

#### Response

- Status Code: 200 OK
- Body:
  - `status`: "success"

## Delete Specific Transaction

Endpoint to delete a specific transaction identified by its ID.

#### Request

- Method: DELETE
- Headers:
  - `x-api-key`: Your API Key
- Path Parameters:
  - `id`: The ID of the transaction

#### Response

- Status Code: 200 OK
- Body:
  - `status`: "success"

---

## Deploying to Cloud Run
- ### Preconditions
  Before deploying your app to Google Cloud Run, ensure that you meet the following prerequisites:
  - Create a Google Cloud Platform (GCP) account and manage projects.
  - Install and configure the Google Cloud SDK on your local machine.
  Please note that "prerequisites" is a plural noun, so it is more appropriate to use "meet the following prerequisites" instead of "meet the following prerequisite" in this context.

- ### Steps
  - Prepare the application
    Ensure that your application is ready for deployment on Google Cloud Run. This involves conducting local testing and ensuring that the necessary configuration is in place.
  - Create a container image
    Google Cloud Run requires the application to be packaged as a distributable container image. Build container images of your applications using tools like Docker.
  - Upload the container image
    Upload the container image you created to the Google Container Registry (GCR) using the gcloud command. Before proceeding, ensure that you are signed in to the correct Google Cloud Platform (GCP) account.
    Example command to upload a container image:
    ```
    gcloud builds submit --tag gcr.io/[PROJECT-ID]/[IMAGE-NAME]
    ```
  - Deploy to Google Cloud Run
    Use the gcloud run deploy command to deploy your application to Google Cloud Run. Specify the service name, select the uploaded container image, and configure any additional options as necessary.
    Example command to deploy an application to Google Cloud Run:
    ```
    gcloud run deploy [SERVICE-NAME] --image gcr.io/[PROJECT-ID]/[IMAGE-NAME] --platform managed
    ```
  - Accessing the application
    After the deployment process is complete, you will receive a URL that provides access to the deployed application. Utilize this URL to access the app through a web browser or by employing an API testing tool such as cURL or Postman.
    
---

# Team Members
Bangkit 2023 Capstone Team CH2-PS058

| ID              | Name                                                                    | Learning Path       |
|:----------------|:------------------------------------------------------------------------|:--------------------|
| `M180BSX0946`   | **[Mutiara Afifah](https://github.com/Mautiarap)**                      | Machine Learning    |
| `M193BSY0446`   | **[Fiqri Maulana Syach](https://github.com/dibfira)**                   | Machine Learning    |
| `M298BSY1784`   | **[Ketut Yudi Witanarya Desimahendra](https://github.com/yudiwtnrya)**  | Machine Learning    |
| `C014BSY3908`   | **[Mananda Davar Sinaga](https://github.com/Mndavr)**                   | Cloud Computing     |
| `C014BSY4145`   | **[I Nyoman Yodya Mahesa Sastra](https://github.com/yodyamahesa)**      | Cloud Computing     |
| `A014BSY2809`   | **[Made Jiyestha Arturito](https://github.com/mdarturito)**             | Mobile Development  |
| `A528BSY2074`   | **[Heri Sanjaya Ginting](https://github.com/gintingherisanjaya)**       | Mobile Development  |
