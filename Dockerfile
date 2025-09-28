# Use the official Puppeteer image as a base
FROM ghcr.io/puppeteer/puppeteer:24.4.0

# Change to root user to install global packages
USER root

# Install pnpm globally
RUN npm install -g pnpm

# Be sure to install Chromium (if not included in the base image)
RUN apt-get update && apt-get install -y chromium \
    && rm -rf /var/lib/apt/lists/*

# Change to a non-root user
USER pptruser
WORKDIR /home/pptruser/app

# Copy package files
COPY --chown=pptruser:pptruser package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY --chown=pptruser:pptruser . .

# Compile the TypeScript code
RUN pnpm build

# Configure environment variables and expose the port
ENV HOST=0.0.0.0 PORT=3000
EXPOSE ${PORT}

# Start the application
CMD ["pnpm", "start"]
