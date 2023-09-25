import { PlatformInterceptorBuilder } from "@uniscale-sdk/ActorCharacter-SimpleX"
import { Patterns } from "@uniscale-sdk/ActorCharacter-SimpleX/sdk/WherebyDemo/Streams"
import { MessageFull } from "@uniscale-sdk/ActorCharacter-SimpleX/sdk/WherebyDemo/Streams/Streams"

const messages = new Map<string,MessageFull>()

export const registerStreamsInterceptors = (builder: PlatformInterceptorBuilder) => {
    // In here we define all our prototyping mocks to simulate implemented functionaly that we want
    // to use while we build our frontend through high speed iterations.
    //
    // In this case have have defined a static map of users that we utilise
    // when implementing the features. As a result the applicatin will reset
    // every time you reload. If you wanted a more complex scenario you could
    // use the browsers local storage so that your prototype data can be 
    // persisted between reloads
    builder
        .interceptMessage(
            // We can use the generated pattern structures in the generated SDK to 
            // find the functionality we want to intercept. By using the
            // allRequestUsages we will intercept a call to any of the use case flows
            // that contains this feature
            Patterns.streams.sendMessage.allMessageUsages,
            // From the generated pattern pattern structure we can also find helper
            // methods that we can use to implement the feature handler
            Patterns.streams.sendMessage.handleDirect((input, ctx) => {
                const msg: MessageFull = {
                    messageIdentifier: crypto.randomUUID(),
                    message: input.message,
                    created: {
                        by: input.by,
                        at: new Date()
                    }
                }
                messages.set(msg.messageIdentifier as string, msg)
            })
        )
        .interceptRequest(
            Patterns.streams.getMessageList.allRequestUsages,
            Patterns.streams.getMessageList.handleDirect((input, ctx) => {
                return Array.from(messages.values())
                    .reverse()
            })
        )
}
