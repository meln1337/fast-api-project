# Step 1: Use Node.js image to build the app
FROM node:16 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code and build the app
COPY . .
RUN npm run build

# Step 2: Serve the app using a lightweight web server
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]