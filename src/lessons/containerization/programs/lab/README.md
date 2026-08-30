# Containerization lab project

Sample app for the in-browser Docker simulation.

```bash
ls -la
cat Dockerfile
docker build -t myapp:1.0 .
docker images
docker run -d --name web -p 8080:80 myapp:1.0
docker ps
docker logs web
```
