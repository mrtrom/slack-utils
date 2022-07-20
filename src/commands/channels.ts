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
};

const list = async (web: WebClient, options: ChannelOptions): Promise<void> => {
  let channels: Channel[] = [];
  const { excludeArchived, emptyOnly, startsWith, contains } = options;

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
  await getChannelsInfo(channels, { emptyOnly, startsWith, contains });
};

const main = async (params: Channels) => {
  const {
    token,
    list: isList,
    excludeArchived,
    emptyOnly,
    startsWith,
    contains,
  } = params;
  const web = new WebClient(token);

  if (isList) {
    await list(web, { excludeArchived, emptyOnly, startsWith, contains });
  }
};

export default main;
