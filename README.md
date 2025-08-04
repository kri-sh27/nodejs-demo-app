

```markdown
# 🚀 Node.js Demo App - CI/CD Pipeline with GitHub Actions and Docker

This project demonstrates a complete CI/CD pipeline setup using **GitHub Actions**, **Docker**, and a **self-hosted runner**. The pipeline builds and deploys a Node.js application to Docker Hub on every push to the `main` branch.
```
---

## 📁 Project Structure

``` bash

.
├── Dockerfile
├── .github
│   └── workflows
│       └── main.yml
├── src/
│   └── ... (App source code)
├── package.json
└── README.md

````

---

## 🛠️ Step-by-Step Setup

### 1. ✅ Created a Dockerfile

```Dockerfile
# Use Node.js 16 slim as the base image
FROM node:16-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000 (or the port your app is configured to listen on)
EXPOSE 3000

# Start your Node.js server (assuming it serves the React app)
CMD ["npm", "start"]

````

> This Dockerfile sets up the environment to build and run the Node.js app.

---

### 2. ✅ Created GitHub Actions Workflow (`main.yml`)

Location: `.github/workflows/main.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: self-hosted

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
      - name: Set up Docker Buildx # Add this step to set up Buildx
        uses: docker/setup-buildx-action@v3 
      - name: Log in to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image to Docker Hub
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/${{ secrets.DOCKERHUB_REPO }}:latest

```

---

### 3. ✅ Set Up Self-Hosted Runner

* Added a self-hosted runner in GitHub under **Settings → Actions → Runners**
* Downloaded and configured runner on a remote Ubuntu machine:

  ```bash
  ./config.sh --url https://github.com/<user>/<repo> --token <token>
  ./run.sh
  ```

---

### 4. ✅ Installed Docker on Self-Hosted Runner

```bash
sudo apt update
sudo apt install docker.io -y
```

---

### 5. 🛠️ Fixed `docker.sock` Permission Issue

* Encountered the error:

  ```
  Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock
  ```

* Fixed it using:

  ```bash
  sudo chmod 666 /var/run/docker.sock
  ```

> This allows the GitHub Actions runner to execute Docker commands.

---

## 📦 Output

* On each push to `main`, the app is:

  1. Tested 
  2. Dockerized
  3. Pushed to DockerHub repository:

     ```
     ${{ secrets.DOCKERHUB_USERNAME }}/${{ secrets.DOCKERHUB_REPO }}:latest
     ```

---

## 🔐 GitHub Secrets Used

| Secret Name          | Description             |
| -------------------- | ----------------------- |
| `DOCKERHUB_USERNAME` | Your DockerHub username |
| `DOCKERHUB_PASSWORD` | Your DockerHub password |
| `DOCKERHUB_REPO`     | DockerHub repo name     |

---

## ✅ Conclusion

This setup helps automate build and deployment using GitHub Actions and Docker efficiently on a self-hosted runner.

---

## 📎 References

* [GitHub Actions Documentation](https://docs.github.com/en/actions)
* [DockerHub](https://hub.docker.com/)
* [Self-Hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners)

```
