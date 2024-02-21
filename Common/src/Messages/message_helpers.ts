import { IMessageType } from "@protobuf-ts/runtime";
import { BaseMessage } from './base_message';
import { Logger } from '../Logger/Logger';
import { MessageRegistry } from './message_registry';

export function createMessage(messageType: IMessageType<BaseMessage>, params?: object) {
    const message = messageType.create();
    message.type = messageType.typeName;
    if (params) {
        messageType.mergePartial(message, params);
    }
    return message;
}

export function validateMessage(msg: BaseMessage): IMessageType<BaseMessage> | null {
    let valid = true;

    if (!msg.type) {
        Logger.Error(Logger.GetStackTrace(), `Parsed message has no type. Rejected. ${JSON.stringify(msg)}`);
        return null;
    }

    const messageType = MessageRegistry[msg.type];
    if (!messageType) {
        Logger.Error(Logger.GetStackTrace(), `Message is of an unknown type: "${messageType}". Rejected.`);
        return null;
    }

    if (messageType.fields) {
        for (const field of messageType.fields) {
            if (!field.opt) {
                if (!Object.prototype.hasOwnProperty.call(msg, field.name)) {
                    Logger.Error(Logger.GetStackTrace(), `Message "${msg.type}"" is missing required field "${field.name}". Rejected.`);
                    valid = false;
                }
            }
        }
    }

    for (const fieldName in msg) {
        const found = messageType.fields.find(field => field.name === fieldName);
        if (!found) {
            Logger.Error(Logger.GetStackTrace(), `Message "${msg.type}" contains unknown field "${fieldName}". Rejected.`);
            valid = false;
        }
    }

    return valid ? messageType : null;
}