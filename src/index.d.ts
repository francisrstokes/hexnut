// Type definitions for Hexnut
// Project: https://github.com/francisrstokes/hexnut/
// Definitions by:
//  - Francis Stokes <https://github.com/francisrstokes/

import { ServerOptions } from "ws";
import { IncomingHttpHeaders } from 'http';

export declare type MessageType = 'connection' | 'message' | 'closing';

export declare type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | 'CONNECT'
  | 'TRACE'
  | 'PATCH';


export declare type Ctx<CtxExtensions> = CtxExtensions & {
  send(...args: Array<any>): void;
  sendToAll(...args: Array<any>): void;
  done(): void;
  throw(err): void;
  isConnection: boolean;
  isMessage: boolean;
  isClosing: boolean;
  requestHeaders: IncomingHttpHeaders;
  ip: string;
  path: string;
  method: HTTPMethod;
  app: HexNut<CtxExtensions>;
  message: any;
  type: MessageType;
};

export declare type MiddlewareFunction<CtxExtensions> = (ctx: Ctx<CtxExtensions>, next: () => any) => Promise<any> | any;

declare class HexNut<CtxExtensions> {
  constructor(wsConfig?: ServerOptions, WebsocketClientImpl?: any);
  use(middleware: MiddlewareFunction<CtxExtensions>);
  start(): void;
  stop(): void;
  send(...args: Array<any>): void;
  isReady(): boolean;
}

export default HexNut;
