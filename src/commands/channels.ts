import type { Channel } from '@slack/web-api/dist/response/ConversationsListResponse';
import chalk from 'chalk';
import { WebClient } from '@slack/web-api';
import { getChannelsInfo, parseChannels } from '../utils/parsers.utils';
import { timeout } from '../utils/general.utils';

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
  dryRun?: boolean;
  members?: number;
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

const archive = async (
  web: WebClient,
  options: ChannelOptions
): Promise<void> => {
  const channels = await getChannels(web, options);
  const parsedChannels = parseChannels(channels, options);

  console.log(
    chalk.blue(`Archiving ${parsedChannels?.length || 0} channels: `)
  );

  for (const channel of parsedChannels) {
    if (options?.dryRun) {
      console.log(
        chalk.yellow(`Would archive channel ${channel.id} - #${channel.name}`)
      );
    } else {
      console.log(
        chalk.yellow(`Archiving channel ${channel.id} - #${channel.name}`)
      );
      await web.conversations.archive({
        channel: channel.id!,
      });
      await timeout(1000);
    }
  }

  console.log(chalk.green(`Archived ${parsedChannels?.length || 0} channels`));
};

const main = async (params: Channels) => {
  const { token, list: isList, archive: isArchive, ...otherOptions } = params;
  const web = new WebClient(token);

  if (isList) {
    await list(web, otherOptions);
  }

  if (isArchive) {
    await archive(web, otherOptions);
  }
};

export default main;
