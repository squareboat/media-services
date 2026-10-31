FROM public.ecr.aws/lambda/nodejs:24-x86_64 AS development
COPY package*.json ${LAMBDA_TASK_ROOT}
RUN npm ci
COPY . ${LAMBDA_TASK_ROOT}
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:24-x86_64 AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
# NestJS 12 is ESM only and this app is CommonJS, so it needs require(esm).
# The Lambda Node.js runtime turns that off (--no-experimental-require-module)
# unless NODE_OPTIONS asks for it.
ENV NODE_OPTIONS=--experimental-require-module
COPY package*.json ${LAMBDA_TASK_ROOT}
COPY --from=development ${LAMBDA_TASK_ROOT}/.env ${LAMBDA_TASK_ROOT}
COPY ffmpeg /usr/bin
RUN npm ci --omit=dev
COPY --from=development ${LAMBDA_TASK_ROOT}/dist ./dist
CMD ["dist/apps/media-service/src/main.handler"]
