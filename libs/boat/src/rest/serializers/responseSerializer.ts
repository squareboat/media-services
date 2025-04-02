export class ResponseSerializer {
  private payload: Record<string, any>;
  constructor() {
    this.payload = { status: 400, success: false };
  }

  success(
    data: Record<string, any> | Array<any> | string,
    status = 200,
  ): Record<string, any> {
    this.payload['data'] = data;
    this.payload['status'] = status;
    this.payload['success'] = true;
    return this.payload;
  }

  error(
    data: Record<string, any> | Array<any> | string,
    status = 400,
  ): Record<string, any> {
    this.payload['data'] = data;
    this.payload['status'] = status;
    this.payload['success'] = false;
    return this.payload;
  }

  withMeta(payload: Record<string, any>, status = 200): Record<string, any> {
    const { data, ...meta } = payload;
    this.payload['data'] = data;
    this.payload['status'] = status;
    this.payload['success'] = true;
    this.payload['meta'] = meta;
    return this.payload;
  }
}
