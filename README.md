# n8n-nodes-personio-hr

Community node for [n8n](https://n8n.io/) to interact with the [Personio](https://www.personio.com/) HR platform via their v2 API.

## Installation

### In n8n Desktop / Self-Hosted

Go to **Settings > Community Nodes** and install:

```
n8n-nodes-personio-hr
```

### Manual Installation

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-personio-hr
```

Then restart n8n.

## Credentials

You need a Personio API client ID and client secret. Create them in **Personio > Settings > Integrations > API credentials**.

When configuring the credential in n8n, enter:
- **Client ID** - Your API client ID
- **Client Secret** - Your API client secret

The node handles token authentication automatically (OAuth2 Client Credentials flow with expirable tokens).

## Supported Resources & Operations

### Personio HR (Regular Node)

| Resource | Operations |
|---|---|
| **Person** | Create, Get, Get Many, Update, Delete |
| **Employment** | Get, Get Many, Update |
| **Absence Period** | Create, Get, Get Many, Get Breakdowns, Update, Delete |
| **Absence Type** | Get, Get Many |
| **Attendance Period** | Create, Get, Get Many, Update, Delete |
| **Project** | Create, Get, Get Many, Update, Delete, Get Members, Add Members, Remove Members |
| **Document** | Get Many, Download (binary), Update, Delete |
| **Compensation** | Create, Get Many, Get Types, Create Type |
| **Organization** | Get Legal Entities, Get Legal Entity |

### Personio Trigger (Webhook Node)

Automatically registers webhooks with Personio for real-time events:

- Person: created, updated, deleted
- Employment: created, updated, deleted
- Absence Period: created, updated, deleted
- Attendance Period: created, updated, deleted
- Compensation: created, updated, deleted
- Project: created, updated, deleted
- Custom reports: created

Webhooks are auto-registered on workflow activation and cleaned up on deactivation.

## Features

- **Cursor-based pagination** on all list endpoints with "Return All" toggle
- **Custom Attributes** support on Person Create/Update (dynamic key-value pairs for instance-specific fields like date of birth, phone, address, etc.)
- **Nested body formats** handled correctly for the Personio v2 API (employments, positions, supervisors, org units, cost centers)
- **Binary file download** for documents
- **Proper Accept headers** for DELETE/PATCH operations (`application/problem+json`)

## Custom Attributes

Personio stores many personal details (date of birth, phone, nationality, etc.) as custom attributes with instance-specific IDs. The Person Create and Update operations include a "Custom Attributes" section where you can add multiple attribute rows.

**Single value:**
- Attribute ID: `laptop_serial_number`
- Value: `ABC-123`

**Array value (tags/multi-select):**
- Attribute ID: `peripheries`
- Value: `["mouse","keyboard","monitor"]`

## Known Limitations

- **Compensation Create** returns 403 Forbidden - this is a Personio-side issue (also fails in their own API playground)
- **Organization** - Cost Centers and Workplaces endpoints return 404 (not live in Personio API despite being documented). Only Legal Entities are available.
- **Org Units** - No list endpoint exists, so you need to know the org unit ID beforehand
- **Recruiting API** - Not included (known to be unstable)

## API Scopes Required

Ensure your Personio API credentials have the following scopes enabled:
- `persons:read`, `persons:write`
- `employments:read`, `employments:write`
- `absences:read`, `absences:write`
- `attendances:read`, `attendances:write`
- `projects:read`, `projects:write`
- `documents:read`, `documents:write`
- `compensations:read`, `compensations:write`
- `webhooks:read`, `webhooks:write` (for the Trigger node)

## License

MIT
