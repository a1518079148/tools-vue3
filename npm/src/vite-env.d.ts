/// <reference types="vite/client" />
import { Router } from 'vue-router'
import { RouterComName } from "./router";

/**
 * Router instance.
 */
export declare interface Router extends Router {
    push(to: RouterComName): void;
}