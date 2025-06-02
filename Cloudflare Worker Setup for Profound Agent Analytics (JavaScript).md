# Cloudflare Worker Setup for Profound Agent Analytics (JavaScript)

This guide provides step-by-step instructions to set up and deploy the Cloudflare Worker using the provided JavaScript files to send request data to Profound Agent Analytics.

**Provided Files:**

*   `src/index.js`: The worker code in JavaScript.
*   `wrangler.toml`: Configuration file for the worker.
*   `package.json`: Project dependencies and scripts.

**Prerequisites:**

1.  **Cloudflare Account:** You need an active Cloudflare account with your domain configured.
2.  **Node.js & npm:** Ensure Node.js (which includes npm) is installed on your machine. You can download it from [https://nodejs.org/](https://nodejs.org/).
3.  **Wrangler CLI:** Install the Cloudflare Wrangler CLI globally if you haven't already:
    ```bash
    npm install -g wrangler
    ```
4.  **Profound API Key:** You need your API key from the Profound Agent Analytics platform.

**Setup Steps:**

1.  **Create Project Directory:**
    *   Create a folder on your local machine for this project (e.g., `profound-worker`).
    *   Inside this folder, create a `src` subfolder.
    *   Place the provided `index.js` file inside the `src` folder.
    *   Place the provided `wrangler.toml` and `package.json` files directly inside the main project folder (`profound-worker`).

    Your folder structure should look like this:
    ```
    profound-worker/
    ├── src/
    │   └── index.js
    ├── package.json
    └── wrangler.toml
    ```

2.  **Install Dependencies:**
    *   Open your terminal or command prompt.
    *   Navigate into the project directory (`cd profound-worker`).
    *   Run the following command to install the necessary development dependencies (specifically, Wrangler):
        ```bash
        npm install
        ```

3.  **Configure `wrangler.toml`:**
    *   Open the `wrangler.toml` file in a text editor.
    *   Locate the `routes` section.
    *   **Crucially, replace the placeholder values** `your-domain.com/*` and `your-domain.com` with your actual domain details.
        *   `pattern`: This should match the URL pattern of the site you want to track (e.g., `www.yourwebsite.com/*` or `subdomain.yourwebsite.com/*`).
        *   `zone_name`: This should be your root domain name registered with Cloudflare (e.g., `yourwebsite.com`).
    *   Save the changes to `wrangler.toml`.

4.  **Login to Cloudflare:**
    *   In your terminal (still in the project directory), run:
        ```bash
        npx wrangler login
        ```
    *   This will open a browser window asking you to log in to your Cloudflare account and authorize Wrangler.

5.  **Configure Profound API Key (Secret):**
    *   **Do not** put your API key directly into `wrangler.toml`. Use Cloudflare Secrets for security.
    *   Run the following command in your terminal:
        ```bash
        npx wrangler secret put PROFOUND_API_KEY
        ```
    *   You will be prompted to paste your Profound API key. Paste it and press Enter.

6.  **Deploy the Worker:**
    *   Run the deployment command:
        ```bash
        npx wrangler deploy
        ```
    *   Wrangler will build and upload your worker to Cloudflare, associating it with the route you configured.

7.  **Test Your Implementation:**
    *   Access the website URL specified in your `wrangler.toml` route pattern.
    *   Navigate to your Profound Agent Analytics dashboard.
    *   Check the Logs panel to see if request data is appearing. Remember that the AI log filter might be on by default; you may need to disable it to see all incoming logs initially.
    *   If logs are appearing, the setup is successful!

**Troubleshooting:**

*   **No Logs:**
    *   Double-check the `PROFOUND_API_KEY` secret was set correctly (`npx wrangler secret list`).
    *   Verify the `PROFOUND_API_URL` in `wrangler.toml` is correct (it should be pre-filled).
    *   Ensure the `routes` pattern in `wrangler.toml` accurately matches the domain/path you are testing.
    *   Check the Cloudflare dashboard under Workers > Your Worker Name > Logs for any execution errors reported by the worker itself.
*   **Deployment Errors:** Consult the error messages provided by Wrangler and the [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/commands/).
*   **Other Issues:** Refer to the original documentation or contact Profound support as mentioned in the document.


