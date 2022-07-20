import chalk from 'chalk';
import type { Channel } from '@slack/web-api/dist/response/ConversationsListResponse';

type ChannelOptions = {
  emptyOnly?: boolean;
  startsWith?: string;
  contains?: string;
};

export const parseChannel = (channel: Channel) => {
  const {
    id,
    name,
    is_channel: isChannel,
    is_archived: isArchived,
    is_general: isGeneral,
    is_private: isPrivate,
    num_members: numMembers,
  } = channel;

  return {
    id,
    name,
    isChannel,
    isArchived,
    isGeneral,
    isPrivate,
    numMembers,
  };
};

export const parseChannels = (
  channels: Channel[],
  { emptyOnly, startsWith, contains }: ChannelOptions = {}
): Record<string, any>[] => {
  let parsedChannels = channels.map(parseChannel);

  if (emptyOnly) {
    parsedChannels = parsedChannels.filter(
      ({ numMembers }) => numMembers === 0
    );
  }
  console.log('startsWith', startsWith);

  if (startsWith) {
    parsedChannels = parsedChannels.filter(({ name }) =>
      name?.toLowerCase()?.startsWith(startsWith?.toLowerCase())
    );
  }

  if (contains) {
    parsedChannels = parsedChannels.filter(({ name }) =>
      name?.toLowerCase()?.includes(contains?.toLowerCase())
    );
  }

  return parsedChannels;
};

export const getChannelsSummary = (parsedChannels: any) => {
  const summary = {
    numChannels: 0,
    numArchived: 0,
    numGeneral: 0,
    numPrivate: 0,
    numChannelsWithNoMembers: 0,
  };

  for (const channel of parsedChannels) {
    if (channel.isChannel) {
      summary.numChannels += 1;
    }

    if (channel.isArchived) {
      summary.numArchived += 1;
    }

    if (channel.isGeneral) {
      summary.numGeneral += 1;
    }

    if (channel.isPrivate) {
      summary.numPrivate += 1;
    }

    if (channel.numMembers === 0) {
      summary.numChannelsWithNoMembers += 1;
    }
  }

  console.log(`SUMMARY:
  ${chalk.green(`Total Channels: ${summary.numChannels}`)}
  ${chalk.yellow(`Archived: ${summary.numArchived}`)}
  ${chalk.blue(`General: ${summary.numGeneral}`)}
  ${chalk.magenta(`Private: ${summary.numPrivate}`)}
  ${chalk.red(`Channels with no members: ${summary.numChannelsWithNoMembers}`)}
  `);
};

export const getChannelsInfo = async (
  channels: Channel[],
  options: ChannelOptions = {}
) => {
  const parsedChannels = await parseChannels(channels, options);
  console.table(parsedChannels);
  await getChannelsSummary(parsedChannels);
};
