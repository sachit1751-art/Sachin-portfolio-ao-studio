FROM ubuntu:latest
RUN apt-get update && apt-get install -y git bash
WORKDIR /app
COPY . .
RUN chmod +x runner.sh
CMD ["/bin/bash", "./runner.sh"]
