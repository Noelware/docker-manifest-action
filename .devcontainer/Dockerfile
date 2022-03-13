FROM auguwu/devcontainers:latest

ARG NODE_VERSION=17.7.1

# Setup Node.js + Yarn
RUN su "${USERNAME}" -c "mkdir /home/${USERNAME}/.nvm"
RUN su "${USERNAME}" -c "curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash"
RUN su "${USERNAME}" -c "source /home/${USERNAME}/.nvm/nvm.sh && \
  nvm install ${NODE_VERSION} && \
  nvm alias default ${NODE_VERSION} && \
  nvm use ${NODE_VERSION}"

CMD ["sleep", "infinity"]
