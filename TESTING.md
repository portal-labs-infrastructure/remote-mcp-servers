# Testing Documentation

This project uses Vitest for testing the v0 API endpoints. The test suite includes unit tests, integration tests, and performance tests.

## Test Structure

```
tests/
├── setup.ts                      # Global test configuration
├── utils/
│   └── api-helpers.ts            # Test utilities and helpers
├── api/
│   └── v0/
│       ├── servers.test.ts       # Comprehensive servers list tests
│       └── server-by-id.test.ts  # Individual server endpoint tests
├── integration/
│   └── api-v0.test.ts           # Integration tests
└── performance/
    └── api-v0.test.ts           # Performance and load tests
```

## Available Test Commands

```bash
# Run all tests in watch mode
npm test

# Run tests once and exit
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui

# Run only API integration tests (with server startup)
npm run test:api

# Run only integration tests
npm run test:integration

# Run only performance tests
npm run test:performance
```

## API Test Coverage

### GET `/api/v0/servers` (Servers List)

✅ **Basic Functionality**

- Default pagination (limit=20)
- Custom limit parameter
- Search functionality by name/description
- Updated since filtering
- Combined parameters

✅ **Pagination**

- Cursor-based pagination
- Next cursor generation
- Page isolation (no overlapping results)

✅ **Input Validation**

- Limit bounds (1-100)
- Invalid datetime format handling
- Malformed cursor handling

### GET `/api/v0/servers/[server_id]` (Server by ID)

✅ **Successful Requests**

- Valid server ID lookup
- Complete server object structure
- Data consistency across requests

✅ **Error Handling**

- Invalid UUID format validation (400)
- Non-existent server handling (404)
- Malformed ID rejection
- Proper error message formatting

✅ **Edge Cases**

- Empty server ID fallback to list endpoint
- Special characters in ID
- Very long strings as ID

## Performance Tests

✅ **Response Time**

- API responds within 2 seconds
- Concurrent request handling
- Pagination efficiency

## Test Data Validation

All tests validate:

- Proper HTTP status codes
- Expected response structure
- UUID format validation
- Timestamp format validation
- Error message consistency

## Running Tests

### Prerequisites

1. Development server must be running on `http://localhost:3000`
2. Database must be accessible with test data

### Manual Test Execution

```bash
# Start development server
npm run dev

# In another terminal, run tests
npm run test:run
```

### Automated Test Execution

```bash
# Uses the test runner script that handles server startup
npm run test:api
```

## Test Configuration

The test suite is configured in `vitest.config.ts` with:

- Node.js environment
- Global test utilities
- Path aliases matching the project structure
- Coverage reporting with v8 provider
- Reasonable timeouts for API tests

## Migrated from Scripts

The following manual test scripts have been converted to proper tests:

- `scripts/test-v0-servers-api.js` → `tests/api/v0/servers.test.ts`
- `scripts/test-v0-server-by-id-api.js` → `tests/api/v0/server-by-id.test.ts`
- `scripts/comprehensive-v0-api-test.js` → `tests/integration/api-v0.test.ts`

The test scripts provide better:

- Structure and organization
- Error reporting and debugging
- CI/CD integration capability
- Coverage reporting
- Parallel execution
- Watch mode for development
