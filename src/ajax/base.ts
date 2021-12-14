import AxiosWingsEngine, { AxiosRequestConfig, RequestMethod, responseInterceptor } from "axios-wings";

interface JSONResult<T> {
    data: T;
    msg: string;
    code: number;
}

class BaseEngine extends AxiosWingsEngine {

    constructor(config?: AxiosRequestConfig) {
        super(config);
    }

    async request<T>(config: AxiosRequestConfig) {
        const jsonResult = await super.request<JSONResult<T>>(config);

        if (jsonResult.code === 0) {
            return jsonResult.data;
        } else {
            throw jsonResult;
        }

    }
}

class PostJsonEngine extends AxiosWingsEngine {
    constructor(config?: AxiosRequestConfig) {
        super(config);
    }

    async baseRequest<T>(config: AxiosRequestConfig) {
        const engine = this.engine

        const formatted = PostJsonEngine.requestInterceptor(config)

        const axiosResponse = await engine.request<T>(formatted)

        return responseInterceptor<T>(axiosResponse)
    }

    async request<T>(config: AxiosRequestConfig) {
        const jsonResult = await this.baseRequest<JSONResult<T>>(config);

        if (jsonResult.code === 0) {
            return jsonResult.data;
        } else {
            throw jsonResult;
        }

    }

    private static requestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
        const isGet = (config.method || RequestMethod.GET).toLowerCase() === RequestMethod.GET

        return Object.assign({
            params: isGet ? {
                _: Math.floor(new Date().getTime() * Math.random())
            } : {}
        }, config)
    }
}


export const engine = new BaseEngine();

export const postJsonEngine = new PostJsonEngine();