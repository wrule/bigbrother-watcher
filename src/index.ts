import * as SocketIOClient from 'socket.io-client';
import { decode } from 'jsonwebtoken';

/**
 * 监听者类
 */
export default class BigBrotherWatcher {
  /**
   * 创建监听者
   * @param token 监听者的token
   * @param uri 上报地址，可不传入，若传入则覆盖token中的uri
   */
  constructor(
    token: string,
    uri?: string,
  ) {
    this.socket = null as any;
    try {
      const payload = this.TokenDecode(token);
      const srvAddr = uri ? uri : payload?.addr;
      if (!srvAddr) {
        throw new Error('上报地址无效');
      }
      this.socket = SocketIOClient.io(srvAddr, {
        query: {
          token,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  private socket: SocketIOClient.Socket;

  /**
   * 解码token提取其中的数据荷载，这里无需对于token进行验证
   * @param token 需要解码的token
   * @returns 数据荷载，解码失败返回null
   */
  public TokenDecode(token: string): any {
    let result = null;
    try {
      result = decode(token);
      if (!result) {
        result = null;
      }
    } catch (e) {
      console.error(e);
    }
    return result;
  }

  /**
   * 监听并上报某一数据变化
   * @param data 需要监听的数据
   */
  public Watch(data: any) {
    try {
      if (this.socket.disconnected) {
        this.socket.connect();
      }
      this.socket.emit('watch', data);
    } catch (e) {
      console.error(e);
    }
  }
}
