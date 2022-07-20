# Slack Utils

This is a set of tool that helps working with Slack in bulk such as: listing channels, archiving, etc...

## Installation

```
$ npm install -g slack-utils
```

## Configuration

All the subcommands and interactions require a Slack access token (Api token) to work. You need to pass the token as a parameter

### Generating your token
To get started, you can generate an APP token here: https://api.slack.com/tutorials/tracks/getting-a-token

### Slack App manifest example
```
display_information:
  name: slack-utils
  description: An app for slack utils
  background_color: "#d982b5"
features:
  app_home:
    home_tab_enabled: false
    messages_tab_enabled: true
    messages_tab_read_only_enabled: true
  bot_user:
    display_name: Slack Utils
    always_online: true
oauth_config:
  scopes:
    user:
      - channels:history
      - channels:read
      - channels:write
      - chat:write
      - files:read
      - files:write
      - groups:history
      - groups:read
      - groups:write
      - im:history
      - im:read
      - im:write
      - links:read
      - links:write
      - mpim:history
      - mpim:read
      - mpim:write
      - pins:read
      - pins:write
      - reactions:read
      - reactions:write
      - reminders:read
      - reminders:write
      - team:read
      - usergroups:read
      - usergroups:write
      - users.profile:read
      - users:read
      - users:write
    bot:
      - app_mentions:read
      - channels:history
      - channels:join
      - channels:manage
      - channels:read
      - chat:write.customize
      - chat:write.public
      - chat:write
      - files:read
      - files:write
      - groups:history
      - groups:read
      - groups:write
      - im:history
      - im:read
      - im:write
      - links:read
      - links:write
      - mpim:history
      - mpim:read
      - mpim:write
      - pins:read
      - pins:write
      - reactions:read
      - reactions:write
      - reminders:read
      - reminders:write
      - team:read
      - usergroups:read
      - usergroups:write
      - users:read
      - users:write
      - users.profile:read
settings:
  event_subscriptions:
    bot_events:
      - app_mention
  interactivity:
    is_enabled: true
  org_deploy_enabled: false
  socket_mode_enabled: true
  token_rotation_enabled: false

```

### Getting help :smiley:
```
$ slack-utils --version
v0.1.0

$ slack-utils --help
  Usage: slack-utils [options] [command]

  Options:
    -V, --version         output the version number
    -a, --token <token>,  Slack API token
    -h, --help            display help for command

  Commands:
    channels [options]    Works with the channels API
    help [command]        display help for command


  See <https://github.com/mrtrom/slack-utils> for more complete docs
  Please report bugs to <https://github.com/mrtrom/slack-utils/issues>
```

## Usage

Basic authoization
```
$ slack-utils --token=[YOUR_TOKEN]
```

### Channels

This allows you to interact with Slack channels (conversations). All these subcommands accept filters like --starts-with or --contains. Deleting and Archiving allow --dry-run mode to simulate the behavior without making real changes.

#### Listing Channels

Listing all your channels
```
$ slack-utils --token=[YOUR_TOKEN] channels --list
```
Listing all your channels, excluding archived
```
$ slack-utils --token=[YOUR_TOKEN] channels --list --exclude-archived
```
Listing all your channels with 1 member
```
$ slack-utils --token=[YOUR_TOKEN] channels --list --members 1
```
Listing all your channels with no members
```
$ slack-utils --token=[YOUR_TOKEN] channels --list --empty-only
```

#### Archiving Channels
Remember to first test the execution of this command with the `--dry-run` argument!!

Watching changes before running this command
```
$ slack-utils --token=[YOUR_TOKEN] channels --archive --exclude-archived --members 1 --dry-run
```
Archiving all your channels with 1 member
```
$ slack-utils --token=[YOUR_TOKEN] channels --archive --exclude-archived --members 1
```
Listing all your channels with no members
```
$ slack-utils --token=[YOUR_TOKEN] channels --archive --exclude-archived --empty-only
```

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

**Note:** Inspired by https://github.com/santiagobasulto/slack.py