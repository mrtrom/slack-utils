#!/usr/bin/env node

const { program } = require('commander');
const channels = require('../dist/commands/channels').default;

const getVersion = () => {
  return `v${require('../package.json').version}`;
};

// main program
program
  .name('slack-utils')
  .version(getVersion())
  .requiredOption('-a, --token <token>,', 'Slack API token')
  .addHelpText(
    'after',
    `

See <https://github.com/mrtrom/slack-utils> for more complete docs
Please report bugs to <https://github.com/mrtrom/slack-utils/issues>`
  );

// channels command
program
  .command('channels')
  .option('-l, --list', 'List of channels to show')
  .option('--exclude-archived', 'Exclude archived channels')
  .option(
    '--starts-with <string>',
    'Only show channels that start with the given string'
  )
  .option(
    '--contains <string>',
    'Only show channels that contains the given string'
  )
  .option('--empty-only', 'Only show empty channels')
  .option('--achive', 'Archive selected channels')
  .description('Works with the channels API')
  .action(commandOptions => {
    channels({ ...commandOptions, ...program.opts() });
  });

program.parse(process.argv);

process.on('uncaughtException', err => {
  function _indent(s) {
    let lines = s.split(/\r?\n/);
    for (var i = 0; i < lines.length; i++) {
      lines[i] = '*     ' + lines[i];
    }

    return lines.join('\n');
  }

  const title = encodeURIComponent(
    `slack-utils ${getVersion()} crashed: ${err.toString()}`
  );

  console.error(`
     * slack-utils crashed!
     *
     * Please report this issue and include the details below:
     *
     *    https://github.com/mrtrom/slack-utils/issues/new?title=${title}
     *
     * * *
     * platform:', process.platform
     * node version:', process.version
     * slack-utils version:', getVersion()
     * argv: %j', process.argv
     * stack:
      ${_indent(err.stack)}
  `);

  process.exit(1);
});
