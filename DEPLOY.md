# Deployment Guide (Render)

This project is configured for easy deployment on [Render](https://render.com).

## Prerequisites

1.  A GitHub repository containing this code.
2.  A [Render](https://render.com) account.

## Deployment Steps

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Create New Blueprint**:
    - Go to the Render Dashboard.
    - Click **New +** and select **Blueprint**.
    - Connect your GitHub repository.
    - Render will automatically detect the `render.yaml` file.
3.  **Configure Environment**:
    - Render will prompt you to review the services (`botx-api`, `botx-web`, `botx-db`).
    - You may need to provide values for:
        - `WHATSAPP_API_TOKEN`
        - `WHATSAPP_PHONE_NUMBER_ID`
        - `WHATSAPP_VERIFY_TOKEN`
    - Click **Apply**.
4.  **Wait for Deployment**:
    - Render will provision a PostgreSQL database (`botx-db`).
    - It will build and deploy the API (`botx-api`).
    - It will build and deploy the Frontend (`botx-web`).

## Environment Variables

The `render.yaml` automatically sets up most variables. You only need to manually provide the WhatsApp credentials if you haven't already.

-   `DATABASE_URL`: Automatically set by Render (links to `botx-db`).
-   `JWT_SECRET`: Automatically generated.
-   `VITE_API_URL`: Automatically set for the frontend to point to the backend.

## Troubleshooting

-   **Build Failures**: Check the logs in the Render dashboard.
-   **Database Issues**: Ensure the `preDeployCommand` (`npx prisma migrate deploy`) ran successfully.
