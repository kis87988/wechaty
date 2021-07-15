import { EventEmitter } from 'events'

import type TypedEventEmitter  from 'typed-emitter'

import {
  CHAT_EVENT_DICT,
  Puppet,
  ScanStatus,
}                       from 'wechaty-puppet'

import {
  Friendship,
  ContactSelf,
  Room,
  RoomInvitation,
  Contact,
  Message,
}                       from '../user/mod'

const WECHATY_EVENT_DICT = {
  ...CHAT_EVENT_DICT,
  dong      : 'Should be emitted after we call `Wechaty.ding()`',
  error     : "Will be emitted when there's an Error occurred.",
  heartbeat : 'Will be emitted periodically after the Wechaty started. If not, means that the Wechaty had died.',
  puppet    : 'Will be emitted when the puppet has been set.',
  ready     : 'All underlined data source are ready for use.',
  start     : 'Will be emitted after the Wechaty had been started.',
  stop      : 'Will be emitted after the Wechaty had been stopped.',
}

export type WechatyEventName  = keyof typeof WECHATY_EVENT_DICT

/**
 * Wechaty Event Listener Interfaces
 */
export type WechatyDongEventListener       = (data?: string) => void
export type WechatyErrorEventListener      = (error: Error) => void
export type WechatyFriendshipEventListener = (friendship: Friendship) => void
export type WechatyHeartbeatEventListener  = (data: any) => void
export type WechatyLoginEventListener      = (user: ContactSelf) => void
export type WechatyLogoutEventListener     = (user: ContactSelf, reason?: string) => void
export type WechatyMessageEventListener    = (message: Message) => void
export type WechatyPuppetEventListener     = (puppet: Puppet) => void
export type WechatyReadyEventListener      = () => void
export type WechatyRoomInviteEventListener = (roomInvitation: RoomInvitation) => void
export type WechatyRoomJoinEventListener   = (room: Room, inviteeList: Contact[], inviter: Contact,  date?: Date) => void
export type WechatyRoomLeaveEventListener  = (room: Room, leaverList: Contact[],  remover?: Contact, date?: Date) => void
export type WechatyRoomTopicEventListener  = (room: Room, newTopic: string, oldTopic: string, changer: Contact, date?: Date) => void
export type WechatyScanEventListener       = (qrcode: string, status: ScanStatus, data?: string) => void
export type WechatyStartStopEventListener  = () => void

/**
 * @desc       Wechaty Class Event Type
 * @typedef    WechatyEventName
 * @property   {string}  error       - When the bot get error, there will be a Wechaty error event fired.
 * @property   {string}  login       - After the bot login full successful, the event login will be emitted, with a Contact of current logged in user.
 * @property   {string}  logout      - Logout will be emitted when bot detected log out, with a Contact of the current login user.
 * @property   {string}  heartbeat   - Get heartbeat of the bot.
 * @property   {string}  friendship  - When someone sends you a friend request, there will be a Wechaty friendship event fired.
 * @property   {string}  message     - Emit when there's a new message.
 * @property   {string}  ready       - Emit when all data has load completed, in wechaty-puppet-padchat, it means it has sync Contact and Room completed
 * @property   {string}  room-join   - Emit when anyone join any room.
 * @property   {string}  room-topic  - Get topic event, emitted when someone change room topic.
 * @property   {string}  room-leave  - Emit when anyone leave the room.<br>
 *                                   - If someone leaves the room by themselves, WeChat will not notice other people in the room, so the bot will never get the "leave" event.
 * @property   {string}  room-invite - Emit when there is a room invitation, see more in  {@link RoomInvitation}
 * @property   {string}  scan        - A scan event will be emitted when the bot needs to show you a QR Code for scanning. </br>
 *                                    It is recommend to install qrcode-terminal(run `npm install qrcode-terminal`) in order to show qrcode in the terminal.
 */

/**
 * @desc       Wechaty Class Event Function
 * @typedef    WechatyEventFunction
 * @property   {Function} error           -(this: Wechaty, error: Error) => void callback function
 * @property   {Function} login           -(this: Wechaty, user: ContactSelf)=> void
 * @property   {Function} logout          -(this: Wechaty, user: ContactSelf) => void
 * @property   {Function} scan            -(this: Wechaty, url: string, code: number) => void <br>
 * <ol>
 * <li>URL: {String} the QR code image URL</li>
 * <li>code: {Number} the scan status code. some known status of the code list here is:</li>
 * </ol>
 * <ul>
 * <li>0 initial_</li>
 * <li>200 login confirmed</li>
 * <li>201 scanned, wait for confirm</li>
 * <li>408 waits for scan</li>
 * </ul>
 * @property   {Function} heartbeat       -(this: Wechaty, data: any) => void
 * @property   {Function} friendship      -(this: Wechaty, friendship: Friendship) => void
 * @property   {Function} message         -(this: Wechaty, message: Message) => void
 * @property   {Function} ready           -(this: Wechaty) => void
 * @property   {Function} room-join       -(this: Wechaty, room: Room, inviteeList: Contact[],  inviter: Contact) => void
 * @property   {Function} room-topic      -(this: Wechaty, room: Room, newTopic: string, oldTopic: string, changer: Contact) => void
 * @property   {Function} room-leave      -(this: Wechaty, room: Room, leaverList: Contact[]) => void
 * @property   {Function} room-invite     -(this: Wechaty, room: Room, roomInvitation: RoomInvitation) => void <br>
 *                                        see more in  {@link RoomInvitation}
 */

/**
 * @listens Wechaty
 * @param   {WechatyEventName}      event      - Emit WechatyEvent
 * @param   {WechatyEventFunction}  listener   - Depends on the WechatyEvent
 *
 * @return  {Wechaty}                          - this for chaining,
 * see advanced {@link https://github.com/wechaty/wechaty-getting-started/wiki/FAQ-EN#36-why-wechatyonevent-listener-return-wechaty|chaining usage}
 *
 * @desc
 * When the bot get message, it will emit the following Event.
 *
 * You can do anything you want when in these events functions.
 * The main Event name as follows:
 * - **scan**: Emit when the bot needs to show you a QR Code for scanning. After scan the qrcode, you can login
 * - **login**: Emit when bot login full successful.
 * - **logout**: Emit when bot detected log out.
 * - **message**: Emit when there's a new message.
 *
 * see more in {@link WechatyEventName}
 *
 * @example <caption>Event:scan</caption>
 * // Scan Event will emit when the bot needs to show you a QR Code for scanning
 *
 * bot.on('scan', (url, status) => {
 *   console.log(`[${status}] Scan ${url} to login.` )
 * })
 *
 * @example <caption>Event:login </caption>
 * // Login Event will emit when bot login full successful.
 *
 * bot.on('login', (user) => {
 *   console.log(`user ${user} login`)
 * })
 *
 * @example <caption>Event:logout </caption>
 * // Logout Event will emit when bot detected log out.
 *
 * bot.on('logout', (user) => {
 *   console.log(`user ${user} logout`)
 * })
 *
 * @example <caption>Event:message </caption>
 * // Message Event will emit when there's a new message.
 *
 * wechaty.on('message', (message) => {
 *   console.log(`message ${message} received`)
 * })
 *
 * @example <caption>Event:friendship </caption>
 * // Friendship Event will emit when got a new friend request, or friendship is confirmed.
 *
 * bot.on('friendship', (friendship) => {
 *   if(friendship.type() === Friendship.Type.Receive){ // 1. receive new friendship request from new contact
 *     const contact = friendship.contact()
 *     let result = await friendship.accept()
 *       if(result){
 *         console.log(`Request from ${contact.name()} is accept successfully!`)
 *       } else{
 *         console.log(`Request from ${contact.name()} failed to accept!`)
 *       }
 *  } else if (friendship.type() === Friendship.Type.Confirm) { // 2. confirm friendship
 *       console.log(`new friendship confirmed with ${contact.name()}`)
 *    }
 *  })
 *
 * @example <caption>Event:room-join </caption>
 * // room-join Event will emit when someone join the room.
 *
 * bot.on('room-join', (room, inviteeList, inviter) => {
 *   const nameList = inviteeList.map(c => c.name()).join(',')
 *   console.log(`Room ${room.topic()} got new member ${nameList}, invited by ${inviter}`)
 * })
 *
 * @example <caption>Event:room-leave </caption>
 * // room-leave Event will emit when someone leave the room.
 *
 * bot.on('room-leave', (room, leaverList) => {
 *   const nameList = leaverList.map(c => c.name()).join(',')
 *   console.log(`Room ${room.topic()} lost member ${nameList}`)
 * })
 *
 * @example <caption>Event:room-topic </caption>
 * // room-topic Event will emit when someone change the room's topic.
 *
 * bot.on('room-topic', (room, topic, oldTopic, changer) => {
 *   console.log(`Room ${room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
 * })
 *
 * @example <caption>Event:room-invite, RoomInvitation has been encapsulated as a RoomInvitation Class. </caption>
 * // room-invite Event will emit when there's an room invitation.
 *
 * bot.on('room-invite', async roomInvitation => {
 *   try {
 *     console.log(`received room-invite event.`)
 *     await roomInvitation.accept()
 *   } catch (e) {
 *     console.error(e)
 *   }
 * }
 *
 * @example <caption>Event:error </caption>
 * // error Event will emit when there's an error occurred.
 *
 * bot.on('error', (error) => {
 *   console.error(error)
 * })
 */
interface WechatyEvents {
  'room-invite' : WechatyRoomInviteEventListener
  'room-join'   : WechatyRoomJoinEventListener
  'room-leave'  : WechatyRoomLeaveEventListener
  'room-topic'  : WechatyRoomTopicEventListener
  dong          : WechatyDongEventListener
  error         : WechatyErrorEventListener
  friendship    : WechatyFriendshipEventListener
  heartbeat     : WechatyHeartbeatEventListener
  login         : WechatyLoginEventListener
  logout        : WechatyLogoutEventListener
  message       : WechatyMessageEventListener
  puppet        : WechatyPuppetEventListener
  ready         : WechatyReadyEventListener
  scan          : WechatyScanEventListener
  start         : WechatyStartStopEventListener
  stop          : WechatyStartStopEventListener
}

export const WechatyEventEmitter = EventEmitter as new () => TypedEventEmitter<
  WechatyEvents
>
