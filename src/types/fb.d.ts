declare module 'fb' {
  interface FacebookOptions {
    appId?: string;
    appSecret?: string;
    version?: string;
    accessToken?: string;
    timeout?: number;
    scope?: string | string[];
    redirectUri?: string;
    proxy?: string;
    beta?: boolean;
    [key: string]: any;
  }

  interface FacebookApiOptions {
    method?: string;
    timeout?: number;
    [key: string]: any;
  }

  interface FacebookApiCallback {
    (error: Error | null, response: any): void;
  }

  interface FacebookBatchApiCallback {
    (error: Error | null, responses: any[]): void;
  }

  interface FacebookBatchItem {
    method: string;
    relative_url: string;
    name?: string;
    body?: any;
    omit_response_on_success?: boolean;
    [key: string]: any;
  }

  class Facebook {
    constructor(options?: FacebookOptions);
    
    setAccessToken(accessToken: string): void;
    getAccessToken(): string;
    
    setAppId(appId: string): void;
    getAppId(): string;
    
    setAppSecret(appSecret: string): void;
    getAppSecret(): string;
    
    setVersion(version: string): void;
    getVersion(): string;
    
    setOptions(options: FacebookOptions): void;
    getOptions(): FacebookOptions;
    
    api(path: string, callback: FacebookApiCallback): void;
    api(path: string, method: string, callback: FacebookApiCallback): void;
    api(path: string, params: any, callback: FacebookApiCallback): void;
    api(path: string, method: string, params: any, callback: FacebookApiCallback): void;
    api(path: string, options: FacebookApiOptions, callback: FacebookApiCallback): void;
    
    napi(path: string, callback: FacebookApiCallback): Promise<any>;
    napi(path: string, method: string, callback?: FacebookApiCallback): Promise<any>;
    napi(path: string, params: any, callback?: FacebookApiCallback): Promise<any>;
    napi(path: string, method: string, params: any, callback?: FacebookApiCallback): Promise<any>;
    napi(path: string, options: FacebookApiOptions, callback?: FacebookApiCallback): Promise<any>;
    
    batch(requests: FacebookBatchItem[], callback: FacebookBatchApiCallback): void;
    batch(requests: FacebookBatchItem[], options: FacebookApiOptions, callback: FacebookBatchApiCallback): void;
    
    nbatch(requests: FacebookBatchItem[], callback?: FacebookBatchApiCallback): Promise<any[]>;
    nbatch(requests: FacebookBatchItem[], options: FacebookApiOptions, callback?: FacebookBatchApiCallback): Promise<any[]>;
    
    getLoginUrl(options: {
      scope?: string | string[];
      redirect_uri?: string;
      display?: string;
      state?: string;
      response_type?: string;
      [key: string]: any;
    }): string;
  }

  const facebook: Facebook;
  export = facebook;
}