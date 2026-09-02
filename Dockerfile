FROM ubuntu:latest
RUN apt-get update && apt-get install -y git bash
WORKDIR /app
ARG GH_PAT
RUN git clone https://${GH_PAT}@github.com/sachit1751-art/Sachin-portfolio-ao-studio.git .
RUN chmod +x runner.sh
CMD ["/bin/bash", "./runner.sh"]
