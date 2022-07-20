import type { Channel } from '@slack/web-api/dist/response/ConversationsListResponse';
import { WebClient } from '@slack/web-api';
import { getChannelsInfo } from '../utils/parsers.utils';

type Channels = ChannelOptions & {
  token: string;
  list: boolean;
};

type ChannelOptions = {
  excludeArchived?: boolean;
  emptyOnly?: boolean;
  startsWith?: string;
  contains?: string;
  archive?: boolean;
};

const getChannels = async (
  web: WebClient,
  options: ChannelOptions
): Promise<Channel[]> => {
  let channels: Channel[] = [];
  const { excludeArchived, ...otherOptions } = options;

  const recursiveList = async (cursor?: string): Promise<Channel[]> => {
    const { channels: newChannels, response_metadata: responseMetadata } =
      await web.conversations.list({
        cursor,
        exclude_archived: !!excludeArchived,
        types: 'public_channel,private_channel,mpim,im',
      });

    if (newChannels) {
      channels = channels.concat(newChannels);
    }

    if (responseMetadata?.next_cursor) {
      return recursiveList(responseMetadata?.next_cursor);
    }

    return channels;
  };

  channels = await recursiveList();

  return channels;
};

const list = async (web: WebClient, options: ChannelOptions): Promise<void> => {
  const { excludeArchived, ...otherOptions } = options;

  const channels = await getChannels(web, options);
  await getChannelsInfo(channels, otherOptions);
};

const main = async (params: Channels) => {
  const { token, list: isList, ...otherOptions } = params;
  const web = new WebClient(token);

  if (isList) {
    await list(web, otherOptions);
  }
};

export default main;
