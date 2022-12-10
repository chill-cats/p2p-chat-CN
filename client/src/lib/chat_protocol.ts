type ChatMessageType = "file" | "text";
type Epoch = number;
type ContentType = Buffer | string;

class ChatMessage {
    type: ChatMessageType;
    author: string;
    timestamp: Date;

    content: ContentType;

    constructor(
        type: ChatMessageType,
        author: string,
        timestamp: Epoch,
        content: Buffer
    ) {
        this.type = type;
        this.author = author;
        this.timestamp = new Date(timestamp);
        if (this.type === "text") {
            this.content = content.toString("utf8");
        } else {
            this.content = content;
        }
    }
}

function parseMessage(data: Buffer, timestamp: Epoch): ChatMessage {
    const END_OF_PROTOCOL = 5;
    const protocol = data.subarray(0, END_OF_PROTOCOL).toString("utf-8");
    if (protocol !== "P2PCP") {
        throw Error("Invalid message protocol");
    }

    const authorUserNameLength = data.readUInt32LE(5);
    const START_OF_USERNAME = END_OF_PROTOCOL + 4;
    const END_OF_USERNAME = START_OF_USERNAME + authorUserNameLength;
    const authorName = data
        .subarray(START_OF_USERNAME, END_OF_USERNAME)
        .toString("utf-8");
    console.log(authorName);

    const messageType: ChatMessageType =
        data[END_OF_USERNAME] === 0 ? "text" : "file";

    const START_OF_CONTENT_LENGTH = END_OF_USERNAME + 1;
    const END_OF_CONTENT_LENGTH = START_OF_CONTENT_LENGTH + 4;
    const contentLength = data.readUInt32LE(START_OF_CONTENT_LENGTH);
    const content = data.subarray(
        END_OF_CONTENT_LENGTH,
        END_OF_CONTENT_LENGTH + contentLength
    );

    // console.log(
    //     `Recieved message from ${authorName}, with type: ${messageType}, length: ${contentLength}, content: ${content}`
    // );

    return new ChatMessage(messageType, authorName, timestamp, content);
}
export { ChatMessage, parseMessage };
