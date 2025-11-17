# n8n Workflows

This directory contains n8n workflow definitions for the Marketing Automation Platform.

## Overview

The platform uses **n8n** as a workflow orchestration engine to handle:
- **Job failure alerts** - Automated notification and logging when campaign jobs fail
- **Scheduled campaigns** - Daily cron job to trigger campaigns that are due

## Workflows

### 1. Job Failure Alert (`job-failure-alert.json`)

**Purpose:** Receives webhook calls from the NestJS API when a campaign job fails, logs the failure to the database, and sends notifications.

**Trigger:** Webhook POST to `/webhook/job-failure`

**Flow:**
1. Webhook receives failure data (jobId, campaignId, userId, error)
2. Extracts and structures the data
3. Logs failure to the database via API POST to `/api/failure-logs`
4. Sends a console log alert (can be replaced with email/Slack notification)
5. Responds to the webhook

**Payload Example:**
```json
{
  "jobId": "abc123",
  "campaignId": "campaign-456",
  "userId": "user-789",
  "error": "Network timeout"
}
```

---

### 2. Scheduled Daily Campaigns (`scheduled-campaigns.json`)

**Purpose:** Runs daily at 8 AM to check for scheduled campaigns that are due and triggers them automatically.

**Trigger:** Cron schedule (`0 8 * * *` - every day at 8:00 AM)

**Flow:**
1. Cron trigger fires at 8 AM daily
2. Fetches all campaigns with status `SCHEDULED` from the API
3. Loops through each campaign
4. Checks if the campaign's `scheduledAt` time is in the past (due)
5. If due: Calls `POST /campaigns/:id/start` to trigger the campaign
6. Logs success or skip status

---

## Setup Instructions

### Prerequisites

- n8n running in Docker (already configured in `docker-compose.yml`)
- NestJS API running on `http://localhost:3000`

### Step 1: Start n8n

Make sure n8n is running:

```bash
docker-compose up -d n8n
```

Access n8n at: **http://localhost:5678**

### Step 2: Import Workflows

1. Open n8n in your browser: http://localhost:5678
2. Click **Workflows** in the sidebar
3. Click **Import from File**
4. Select `job-failure-alert.json`
5. Click **Save** and **Activate** the workflow
6. Repeat for `scheduled-campaigns.json`

### Step 3: Configure Webhook URLs

The workflows are pre-configured to call the NestJS API at:
- `http://host.docker.internal:3000` (for Docker on Mac/Windows)
- Change to `http://172.17.0.1:3000` if using Linux

If your API runs on a different host/port, update the HTTP Request nodes in each workflow.

### Step 4: Set Environment Variables

Ensure your NestJS API has the correct n8n webhook URL in `.env`:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

### Step 5: Test the Workflows

#### Test Job Failure Alert:

1. In n8n, open the **Job Failure Alert** workflow
2. Click **Execute Workflow** and manually trigger with test data
3. Or trigger a real failure by:
   - Creating a campaign
   - Modifying the job processor to throw an error
   - Starting the campaign

#### Test Scheduled Campaigns:

1. Create a campaign with status `SCHEDULED` and `scheduledAt` in the past
2. Manually execute the **Scheduled Daily Campaigns** workflow
3. Check the API logs to confirm the campaign was started

---

## Production Considerations

### Security
- Add authentication to webhooks (API keys or JWT)
- Use HTTPS for webhook URLs in production
- Restrict n8n access with login credentials

### Monitoring
- Enable n8n execution logging
- Set up alerts for workflow failures
- Monitor webhook response times

### Scaling
- n8n supports clustering for high availability
- Consider using n8n cloud for managed hosting
- Implement retry logic with exponential backoff

---

## Troubleshooting

### Webhook not triggered
- Check that n8n is running: `docker ps | grep n8n`
- Verify the webhook URL in `.env`: `N8N_WEBHOOK_URL`
- Check n8n logs: `docker logs n8n`

### API connection refused
- Ensure the API is accessible from n8n container
- Use `host.docker.internal` on Mac/Windows
- Use `172.17.0.1` or the container IP on Linux

### Workflow fails
- Check execution logs in n8n UI
- Verify API endpoints are correct and accessible
- Check for authentication/authorization issues

---

## Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Workflow Best Practices](https://docs.n8n.io/workflows/best-practices/)
- [BullMQ Documentation](https://docs.bullmq.io/)
