FROM auguwu/devcontainers:latest

ARG NODE_VERSION=18.7.0
USER ${USERNAME}

RUN mkdir $HOME/.nvm && \
  curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash && \
  source $HOME/.nvm/nvm.sh && \
  nvm install ${NODE_VERSION} && \
  nvm alias default ${NODE_VERSION} && \
  nvm use ${NODE_VERSION} && \
  echo "export NVM_DIR=\"$HOME/.nvm\"" >> $HOME/.bashrc && \
  echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> $HOME/.bashrc && \
  npm i -g yarn && \
  sudo git lfs install --system
 
CMD ["sleep", "infinity"]
