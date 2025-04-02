FROM public.ecr.aws/lambda/nodejs:18-x86_64 as development
COPY package*.json ${LAMBDA_TASK_ROOT}
RUN npm install -g @nestjs/cli
RUN npm install --only=development
COPY . ${LAMBDA_TASK_ROOT}
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:18-x86_64 as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY package*.json ${LAMBDA_TASK_ROOT}
COPY --from=development ${LAMBDA_TASK_ROOT}/.env ${LAMBDA_TASK_ROOT}
COPY ffmpeg /usr/bin
RUN npm install --omit=dev
COPY --from=development ${LAMBDA_TASK_ROOT}/dist ./dist
CMD ["dist/apps/media-service/src/main.handler"]
