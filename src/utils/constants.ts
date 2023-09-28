export enum EServerOnEventType {
  /**用户建立连接 */
  CLIENT_CONNECTION = 'connection',
  /**用户断开连接 */
  CLIENT_DISCONNECT = 'disconnect',
  /**广播 */
  BROADCAST = 'broadcast',
  /**收到消息 */
  EVENT_MESSAGE = 'EVENT_MESSAGE',
  /**发送消息 */
  EVENT_SEND = 'EVENT_SEND',

  CHAT_WITH_SOMEONE = 'CHAT_WITH_SOMEONE',
  CHAT_AT_ROOM = 'CHAT_AT_ROOM',
}

export enum EClientOnEventType {
  CLIENT_GET_CHAT_DATA = 'CLIENT_GET_CHAT_DATA',
}

/**路由 */
export enum Routes {
  USERS = 'users',
}
