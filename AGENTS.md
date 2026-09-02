# Agent & Developer Guidelines — Achal Artworks

Welcome to the **Achal Artworks** codebase. This document outlines project architecture, Google Drive image warehouse integration, and autonomous site management using Antigravity (`agy`).

---

## 1. Project Overview

Achal Artworks is a handcrafted Indian art, pooja essentials, decorative rangoli mats, and spiritual artifacts web storefront.
- **Frontend**: Lightweight vanilla HTML5 (`index.html`, `cart.html`), CSS3 (`style.css`), and JavaScript (`script.js`, `cart-page.js`).
- **Media & Assets**: Product imagery, logos, and motifs are stored in `assets/`.
- **Deployment**:
  - **Automated**: GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds and deploys to GitHub Pages on every push to the `main` branch.
  - **Cloud Infrastructure (Optional)**: AWS S3 & CloudFront distribution managed via Terraform in `terraform/` and `deploy.sh`.

---

## 2. Google Drive Image Warehouse Integration

Product photos, artwork captures, and gallery images are centrally stored in a dedicated Google Drive folder connected via the Google Workspace MCP server (`google-personal`).

### Warehouse Details:
- **Account**: `shreyasmakde@gmail.com`
- **Target Folder Name**: `"A A Warehouse "`
- **Target Folder ID**: `1LWS88sL0BLrHbMDq_NGb3eLd288ljbZN`
- **MCP Server**: `google-personal` (`uvx workspace-mcp --single-user --tools drive`)
- **Credentials Location**: `~/.credentials/google-personal/` (stored outside repository)

### Workflow for Adding New Images & Artworks:
1. **Upload Images to Drive**:
   - Artists, store operators, or developers can simply drop new artwork pictures and photos directly into the **"A A Warehouse "** Google Drive folder (`1LWS88sL0BLrHbMDq_NGb3eLd288ljbZN`).
2. **Autonomous Site Updates via `agy`**:
   - `agy` (Antigravity) is equipped with Google Drive tools (`list_drive_items`, `get_drive_file_content`, `get_drive_file_download_url`, etc.) via the active `google-personal` MCP server.
   - `agy` is fully capable of updating the website end-to-end:
     - Reading and listing newly added files from the Google Drive warehouse.
     - Downloading and optimizing images into `assets/` with consistent naming conventions.
     - Updating `index.html` with new product listings, categories, descriptions, dimensions, and prices.
     - Updating modal previews, search filters, and shopping cart logic.
     - Running verification checks, staging changes, and pushing directly to GitHub `main` to trigger live deployment.

---

## 3. Developer & Agent Rules

- **Never Commit Secrets**:
  - Keep all OAuth client secrets, tokens, and credentials outside the repository (`~/.credentials/`).
  - `.gitignore` explicitly excludes `.credentials/`, `client_secret*.json`, `*.token.json`, and environment files.
- **Asset Conventions**:
  - Store image files in `assets/` using lowercase snake_case or standard descriptive naming (e.g., `cat_<category>_<name>.jpg`).
  - Keep relative asset paths in HTML/CSS/JS (e.g. `assets/filename.jpg`).
- **Site Deployment**:
  - Pushing commits to `origin/main` automatically triggers the GitHub Pages deployment pipeline.
