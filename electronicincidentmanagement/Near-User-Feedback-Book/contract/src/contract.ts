import { NearBindgen, near, call, view } from 'near-sdk-js'
import { POINT_ONE, PostedMessage } from './model'

@NearBindgen({})
class GuestBook {
  messages: PostedMessage[] = [];

  @call({payableFunction: true})
  add_message({ text }: { text: string }) {
    // If the user attaches more than 0.01N the message is premium
    const premium = near.attachedDeposit() >= BigInt(POINT_ONE);
    const sender = near.predecessorAccountId();

    const message = new PostedMessage({premium, sender, text});
    this.messages.push(message);
  }
  
  @view({})
  get_messages({ from_index = 0, limit = 10 }: { from_index: number, limit: number }): PostedMessage[] {
    return this.messages.slice(from_index, from_index + limit);
  }
}
