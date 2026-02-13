# Hello World Express Server

A simple Express.js server with Hello World endpoints.

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will start on port 4000 (development) or port 80/PORT (production).

## Hello World Endpoints

- **GET /** - Returns "Hello World from Express!"
- **GET /hello** - Returns JSON with message and timestamp
- **GET /hello/:name** - Returns personalized greeting (e.g., /hello/John returns "Hello John!")

## Testing

```bash
# Test the main endpoint
curl http://localhost:4000/

# Test the JSON endpoint
curl http://localhost:4000/hello

# Test the personalized endpoint
curl http://localhost:4000/hello/YourName
```

## Advanced Features (Optional)

This server also includes user management and comment APIs that require MongoDB.

### Prerequisites for Full API
- MongoDB server installed locally
- Node.js installed

### Enable Database Features

Set the environment variable to enable database-dependent routes:
```bash
ENABLE_DB=true npm start
```

### API Routes (when database is enabled)
- **/users** - User management endpoints
- **/comment** - Comment management endpoints





