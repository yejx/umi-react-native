import { join, resolve } from 'path';
import { execFileSync } from 'child_process';
import { IApi } from '@umijs/types';
import { yargs } from '@umijs/utils';
import { generateFiles, asyncClean } from '../../utils';

export interface IHaulBundleOptions {
  config?: string;
  dev: boolean;
  minify?: boolean;
  platform: string;
  assetsDest?: string;
  bundleOutput?: string;
  sourcemapOutput?: string;
  progress: string;
  maxWorkers?: number;
}

interface ICommand {
  name: string;
  alias?: string;
  description?: string;
  details?: string;
  fn: {
    <T>({ args }: { args: yargs.Arguments<T> }): void;
  };
}

export default (api: IApi) => {
  const {
    paths: { absTmpPath, absOutputPath },
    utils: { rimraf },
  } = api;
  async function handler({ args }: { args: yargs.Arguments<IHaulBundleOptions> }): Promise<void> {
    if (!args.platform) {
      throw new TypeError('The required argument: "--platform <ios|android>" was not present!');
    }
    const assetPath = resolve(absOutputPath || '', 'assets');
    const bundleOutput = join(absOutputPath || '', args.bundleOutput || `index.${args.platform}.bundle`);
    const sourcemapOutput = join(
      absOutputPath || '',
      args.bundleOutput ? `${args.bundleOutput}.map` : `index.${args.platform}.bundle.map`,
    );
    const argv: string[] = [
      'bundle',
      '--platform',
      args.platform,
      '--config',
      join(absTmpPath || '', 'haul.config.js'),
      '--entry-file',
      join(absTmpPath || '', 'index.js'),
      '--bundle-output',
      bundleOutput,
      '--sourcemap-output',
      sourcemapOutput,
      '--assets-dest',
      assetPath,
      '--progress',
      'minimal',
      '--dev',
      JSON.stringify(process.env.NODE_ENV === 'development'),
    ];
    api.logger.info('bundle for:', args.platform, ',output:', bundleOutput);

    if (absTmpPath) {
      await asyncClean(api, absTmpPath, '.cache', 'node_modules');
    }

    await generateFiles({ api, watch: false });

    const cli = require.resolve('@haul-bundler/cli/bin/haul.js');
    execFileSync(cli, argv, {
      stdio: 'inherit',
      cwd: absTmpPath,
      env: process.env,
    });

    if (process.env.RM_TMPDIR !== 'none') {
      absTmpPath && rimraf.sync(absTmpPath);
    }
  }

  api.registerCommand({
    name: 'build-rn',
    description: 'builds react-native offline bundle',
    fn: handler,
  } as ICommand);
};